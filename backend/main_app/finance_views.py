import json
import uuid
from django.shortcuts import render, redirect
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from main_app.models import Invoice, Payment, Scholarship, Student, Refund
from django.contrib import messages
import csv

import os
from django.conf import settings

# --- REAL RAZORPAY CREDENTIALS & SDK INITIALIZATION ---
def get_razorpay_client():
    key_id = os.environ.get('RAZORPAY_KEY_ID') or getattr(settings, 'RAZORPAY_KEY_ID', '')
    key_secret = os.environ.get('RAZORPAY_KEY_SECRET') or getattr(settings, 'RAZORPAY_KEY_SECRET', '')
    if key_id and key_secret:
        try:
            import razorpay
            return razorpay.Client(auth=(key_id, key_secret)), key_id, key_secret
        except ImportError:
            pass
    return None, key_id, key_secret


def student_finances(request):
    """ View for students to see their invoices, payments, and scholarships """
    if not request.user.is_authenticated or request.user.user_type != '3':
        return redirect('login_page')
    
    student = Student.objects.get(admin=request.user)
    invoices = Invoice.objects.filter(student=student)
    scholarships = Scholarship.objects.filter(student=student, is_active=True)
    payments = Payment.objects.filter(invoice__student=student)
    
    _, razorpay_key, _ = get_razorpay_client()
    context = {
        'invoices': invoices,
        'scholarships': scholarships,
        'payments': payments,
        'razorpay_key': razorpay_key
    }
    return render(request, 'student_template/finance.html', context)

@csrf_exempt
def razorpay_checkout(request):
    """ API endpoint called when student clicks 'Pay Now'. Generates a real Razorpay order. """
    if request.method == 'POST':
        data = json.loads(request.body)
        invoice_id = data.get('invoice_id')
        
        try:
            invoice = Invoice.objects.get(id=invoice_id)
            if invoice.is_paid:
                return JsonResponse({'status': 'error', 'message': 'Invoice already paid.'})
            
            # Apply active scholarships logic
            student = invoice.student
            scholarships = Scholarship.objects.filter(student=student, is_active=True)
            discount = sum([s.discount_percentage for s in scholarships])
            
            final_amount = float(invoice.amount)
            if discount > 0:
                final_amount = final_amount - (final_amount * float(discount) / 100)
            
            # Add GST
            final_amount = final_amount + (final_amount * float(invoice.gst_percentage) / 100)
            amount_in_paise = int(round(final_amount * 100))

            client, key_id, key_secret = get_razorpay_client()
            if client:
                order_params = {
                    'amount': amount_in_paise,
                    'currency': 'INR',
                    'receipt': f'inv_{invoice.id}_{uuid.uuid4().hex[:6]}',
                    'notes': {'invoice_id': str(invoice.id), 'student_email': str(student.admin.email)}
                }
                razorpay_order = client.order.create(data=order_params)
                order_id = razorpay_order['id']
            else:
                # Fallback unique reference order id when credentials pending in .env
                order_id = f"order_{uuid.uuid4().hex[:12]}"
            
            return JsonResponse({
                'status': 'success',
                'order_id': order_id,
                'key_id': key_id,
                'amount': amount_in_paise,
                'currency': 'INR',
                'name': 'College ERP Fee Payment',
                'description': f'Payment for Invoice #{invoice.id}',
            })
            
        except Invoice.DoesNotExist:
            return JsonResponse({'status': 'error', 'message': 'Invoice not found.'}, status=404)
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': f'Order creation failed: {str(e)}'}, status=500)
    return JsonResponse({'status': 'error', 'message': 'Method not allowed.'}, status=405)

@csrf_exempt
def razorpay_webhook(request):
    """ Webhook & verification callback for payments from Razorpay """
    if request.method == 'POST':
        data = json.loads(request.body)
        invoice_id = data.get('invoice_id')
        transaction_id = data.get('transaction_id') or data.get('razorpay_payment_id')
        razorpay_order_id = data.get('razorpay_order_id')
        razorpay_signature = data.get('razorpay_signature')
        
        client, key_id, key_secret = get_razorpay_client()
        
        # Verify HMAC-SHA256 signature if client and signature provided
        if client and razorpay_order_id and razorpay_signature and transaction_id:
            try:
                client.utility.verify_payment_signature({
                    'razorpay_order_id': razorpay_order_id,
                    'razorpay_payment_id': transaction_id,
                    'razorpay_signature': razorpay_signature
                })
            except Exception as sig_err:
                return JsonResponse({'status': 'error', 'message': f'Signature verification failed: {str(sig_err)}'}, status=400)

        try:
            invoice = Invoice.objects.get(id=invoice_id)
            invoice.is_paid = True
            invoice.save()
            
            Payment.objects.create(
                invoice=invoice,
                gateway="Razorpay",
                transaction_id=transaction_id or f"TXN_{uuid.uuid4().hex[:10]}",
                amount_paid=data.get('amount_paid', invoice.amount),
                status='Completed'
            )
            
            return JsonResponse({'status': 'success', 'message': 'Payment processed successfully.'})
        except Invoice.DoesNotExist:
            return JsonResponse({'status': 'error', 'message': 'Invoice not found.'}, status=404)
            
    return JsonResponse({'status': 'error', 'message': 'Method not allowed.'}, status=405)



def generate_gst_report(request):
    """ Generates a CSV report of all GST collected from completed payments """
    if not request.user.is_authenticated or request.user.user_type != '1':
        return HttpResponse("Unauthorized", status=401)
        
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="gst_report.csv"'
    
    writer = csv.writer(response)
    writer.writerow(['Payment ID', 'Invoice ID', 'Student', 'Base Amount', 'GST %', 'GST Amount Collected', 'Total Paid', 'Date'])
    
    payments = Payment.objects.filter(status='Completed').select_related('invoice', 'invoice__student')
    
    for payment in payments:
        invoice = payment.invoice
        base = float(invoice.amount)
        gst_pct = float(invoice.gst_percentage)
        
        # Reverse calculate base and GST from total if discount applied
        # For simplicity in this mock, we assume amount_paid = base + gst
        total_paid = float(payment.amount_paid)
        gst_amount = total_paid - (total_paid / (1 + (gst_pct/100)))
        base_amount = total_paid - gst_amount
        
        writer.writerow([
            payment.id, 
            invoice.id, 
            invoice.student.admin.email,
            round(base_amount, 2),
            gst_pct,
            round(gst_amount, 2),
            round(total_paid, 2),
            payment.paid_at.strftime("%Y-%m-%d") if payment.paid_at else payment.created_at.strftime("%Y-%m-%d")
        ])
        
    return response

def admin_finance_dashboard(request):
    """ View for HOD/Admin to manage finances, assign scholarships, and handle refunds """
    if not request.user.is_authenticated or request.user.user_type != '1':
        return redirect('login_page')
        
    payments = Payment.objects.all().order_by('-created_at')[:50]
    refunds = Refund.objects.filter(status='Requested')
    scholarships = Scholarship.objects.all()
    students = Student.objects.all()
    
    if request.method == 'POST':
        action = request.POST.get('action')
        if action == 'grant_scholarship':
            student_id = request.POST.get('student_id')
            name = request.POST.get('name')
            discount = request.POST.get('discount')
            
            student = Student.objects.get(id=student_id)
            Scholarship.objects.create(student=student, name=name, discount_percentage=discount)
            messages.success(request, f"Scholarship '{name}' assigned to {student}.")
            return redirect('admin_finance_dashboard')
            
        elif action == 'approve_refund':
            refund_id = request.POST.get('refund_id')
            refund = Refund.objects.get(id=refund_id)
            refund.status = 'Approved'
            refund.save()
            # Logic to refund via Razorpay API goes here
            messages.success(request, f"Refund {refund_id} approved.")
            return redirect('admin_finance_dashboard')
            
    context = {
        'payments': payments,
        'refunds': refunds,
        'scholarships': scholarships,
        'students': students
    }
    return render(request, 'hod_template/finance_dashboard.html', context)


# --- Accounts UI Mock Views ---

def chart_of_accounts(request):
    """ View for the Chart of Accounts """
    if not request.user.is_authenticated or request.user.user_type != '1':
        return redirect('login_page')
    return render(request, 'hod_template/chart_of_accounts.html', {})

def add_income(request):
    """ View for the Add Income form """
    if not request.user.is_authenticated or request.user.user_type != '1':
        return redirect('login_page')
    return render(request, 'hod_template/add_income.html', {})

def add_expense(request):
    """ View for the Add Expense form """
    if not request.user.is_authenticated or request.user.user_type != '1':
        return redirect('login_page')
    return render(request, 'hod_template/add_expense.html', {})

def account_statement(request):
    """ View for the Account Statement dashboard """
    if not request.user.is_authenticated or request.user.user_type != '1':
        return redirect('login_page')
    return render(request, 'hod_template/account_statement.html', {})
