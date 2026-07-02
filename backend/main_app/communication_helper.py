import os
import requests
from django.core.mail import send_mail
from django.conf import settings
from dotenv import load_dotenv

# Load env variables
load_dotenv()

def send_email_brevo(to_email, subject, html_content):
    """
    Sends email using Django's standard send_mail or falls back to Brevo SMTP / API.
    """
    print(f"[BREVO EMAIL] Sending to {to_email} | Subject: {subject}")
    try:
        # Check if django settings for email are configured
        from_email = getattr(settings, 'EMAIL_HOST_USER', 'noreply@college-erp.com')
        # Standard django mail uses configured SMTP settings in settings.py
        send_mail(
            subject=subject,
            message="",
            html_message=html_content,
            from_email=from_email,
            recipient_list=[to_email],
            fail_silently=False
        )
        return True
    except Exception as e:
        print(f"[BREVO EMAIL] Error sending email: {str(e)}")
        # Try direct API send if SMTP fails and key is present
        api_key = os.getenv('BREVO_API_KEY')
        if api_key:
            url = "https://api.brevo.com/v3/smtp/email"
            headers = {
                "accept": "application/json",
                "api-key": api_key,
                "content-type": "application/json"
            }
            payload = {
                "sender": {"name": "College ERP", "email": "noreply@college-erp.com"},
                "to": [{"email": to_email}],
                "subject": subject,
                "htmlContent": html_content
            }
            try:
                res = requests.post(url, json=payload, headers=headers)
                if res.status_code in [200, 201]:
                    return True
            except Exception as ex:
                print(f"[BREVO EMAIL API] Fallback error: {str(ex)}")
        return False

def send_sms_twilio(to_number, message_body):
    """
    Sends SMS using Twilio trial account API via direct requests.
    """
    account_sid = os.getenv('TWILIO_ACCOUNT_SID')
    auth_token = os.getenv('TWILIO_AUTH_TOKEN')
    from_number = os.getenv('TWILIO_FROM_NUMBER')
    
    print(f"[TWILIO SMS] Sending to {to_number} | Msg: {message_body}")
    
    if not (account_sid and auth_token and from_number):
        print("[TWILIO SMS] Twilio credentials missing in environmental variables. Skipping.")
        return False
        
    url = f"https://api.twilio.com/2010-04-01/Accounts/{account_sid}/Messages.json"
    data = {
        "To": to_number,
        "From": from_number,
        "Body": message_body
    }
    try:
        response = requests.post(url, data=data, auth=(account_sid, auth_token))
        if response.status_code in [200, 201]:
            return True
        else:
            print(f"[TWILIO SMS] Failed with status {response.status_code}: {response.text}")
    except Exception as e:
        print(f"[TWILIO SMS] Error: {str(e)}")
    return False

def send_fcm_push(fcm_token, title, body_text):
    """
    Dispatches push notification via Firebase Cloud Messaging API.
    """
    server_key = os.getenv('FCM_SERVER_KEY')
    print(f"[FCM PUSH] Sending notification to {fcm_token[:15]}... | Title: {title}")
    
    if not server_key:
        print("[FCM PUSH] FCM Server Key missing. Skipping.")
        return False
        
    url = "https://fcm.googleapis.com/fcm/send"
    headers = {
        "Authorization": f"key={server_key}",
        "Content-Type": "application/json"
    }
    payload = {
        "to": fcm_token,
        "notification": {
            "title": title,
            "body": body_text,
            "sound": "default"
        }
    }
    try:
        response = requests.post(url, json=payload, headers=headers)
        if response.status_code == 200:
            return True
    except Exception as e:
        print(f"[FCM PUSH] Error: {str(e)}")
    return False

# --- Aliases for consistent imports across the codebase ---
send_email_notification = send_email_brevo
send_sms_notification = send_sms_twilio
send_push_notification = send_fcm_push
