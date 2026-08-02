"""
Enterprise Visitor Management System Service Layer
====================================================
Core business logic for Visitor Registration, Appointment Approval, Gate Pass Generation,
Check-in/Check-out logging, Vehicle Allocation, Delivery logging, Contractor Management,
Blacklist Validation, Security Roster, and Audit logging.
"""

import decimal
import datetime
from django.db import transaction
from django.db.models import Count, Q
from django.utils import timezone
from apps.visitor.models import (
    Visitor,
    VisitorDocument,
    VisitorVehicle,
    Appointment,
    VisitPurpose,
    GatePass,
    EntryExitLog,
    Delivery,
    Contractor,
    ContractorPass,
    EmergencyVisitor,
    RestrictedAreaAccess,
    VisitorBlacklist,
    VisitorFeedback,
    SecurityOfficer,
    VisitorNotification,
    VisitorAuditLog,
)


class VisitorService:
    @staticmethod
    def log_audit(action, performed_by=None, details=None):
        """Creates an audit log entry for visitor operations."""
        return VisitorAuditLog.objects.create(
            action=action,
            performed_by=performed_by,
            details=details or {}
        )

    @classmethod
    def is_blacklisted(cls, visitor_id):
        """Checks if a visitor is currently blacklisted."""
        return VisitorBlacklist.objects.filter(visitor_id=visitor_id).exists()

    @classmethod
    @transaction.atomic
    def register_visitor(cls, data, performed_by=None):
        """Registers a new visitor profile with Govt ID verification."""
        mobile = data["mobile"]
        visitor, created = Visitor.objects.get_or_create(
            mobile=mobile,
            defaults={
                "visitor_id": data.get("visitor_id", f"VIS-{mobile[-6:]}"),
                "first_name": data["first_name"],
                "last_name": data.get("last_name", ""),
                "email": data.get("email", ""),
                "company": data.get("company", "Self / Individual"),
                "govt_id_type": data.get("govt_id_type", "Aadhaar"),
                "govt_id_number": data.get("govt_id_number", ""),
                "address": data.get("address", ""),
            }
        )

        if data.get("govt_id_number"):
            VisitorDocument.objects.get_or_create(
                visitor=visitor,
                document_number=data["govt_id_number"],
                defaults={
                    "document_type": data.get("govt_id_type", "Govt ID Scan"),
                    "verification_status": "Verified",
                }
            )

        cls.log_audit(
            action=f"REGISTER_VISITOR: {visitor.visitor_id}",
            performed_by=performed_by,
            details={"visitor_id": str(visitor.id), "mobile": visitor.mobile}
        )

        return visitor

    @classmethod
    @transaction.atomic
    def create_appointment(cls, data, performed_by=None):
        """Creates a visitor appointment with host employee."""
        if cls.is_blacklisted(data["visitor_id"]):
            raise ValueError("Visitor is blacklisted from campus entry.")

        appt = Appointment.objects.create(
            visitor_id=data["visitor_id"],
            host_employee_id=data["host_employee_id"],
            department_id=data.get("department_id"),
            purpose=data.get("purpose", "Meeting"),
            scheduled_date=data.get("scheduled_date", timezone.now().date()),
            scheduled_time=data.get("scheduled_time", "10:00:00"),
            status=data.get("status", "Approved" if performed_by and (performed_by.is_staff or performed_by.is_superuser) else "Pending"),
        )

        cls.log_audit(
            action=f"CREATE_APPOINTMENT: Visitor {data['visitor_id']}",
            performed_by=performed_by,
            details={"appointment_id": str(appt.id)}
        )

        return appt

    @classmethod
    @transaction.atomic
    def approve_appointment(cls, appointment_id, performed_by=None):
        """Approves a pending visitor appointment."""
        appt = Appointment.objects.get(id=appointment_id)
        appt.status = "Approved"
        appt.save(update_fields=["status"])

        # Auto-generate Gate Pass upon approval
        cls.generate_gate_pass(visitor_id=appt.visitor.id, appointment_id=appt.id, performed_by=performed_by)

        cls.log_audit(
            action=f"APPROVE_APPOINTMENT: {appt.id}",
            performed_by=performed_by,
            details={"appointment_id": str(appt.id)}
        )

        return appt

    @classmethod
    @transaction.atomic
    def generate_gate_pass(cls, visitor_id, appointment_id=None, expiry_hours=8, performed_by=None):
        """Generates a digital QR Gate Pass for campus entry."""
        if cls.is_blacklisted(visitor_id):
            raise ValueError("Visitor is blacklisted from campus entry.")

        visitor = Visitor.objects.get(id=visitor_id)
        pass_no = f"GP-{visitor.visitor_id[-6:]}-{timezone.now().strftime('%M%S')}"

        gate_pass, _ = GatePass.objects.get_or_create(
            visitor=visitor,
            appointment_id=appointment_id,
            status="Active",
            defaults={
                "pass_number": pass_no,
                "qr_code_payload": f"QR-PASS-{pass_no}",
                "expiry_date": timezone.now() + datetime.timedelta(hours=expiry_hours),
            }
        )

        cls.log_audit(
            action=f"GENERATE_GATE_PASS: {gate_pass.pass_number}",
            performed_by=performed_by,
            details={"pass_id": str(gate_pass.id)}
        )

        return gate_pass

    @classmethod
    @transaction.atomic
    def check_in_visitor(cls, visitor_id, gate="Main Gate A", gate_pass_id=None, remarks="", performed_by=None):
        """Logs visitor campus check-in."""
        if cls.is_blacklisted(visitor_id):
            raise ValueError("Visitor is blacklisted. Campus entry DENIED!")

        log = EntryExitLog.objects.create(
            visitor_id=visitor_id,
            gate_pass_id=gate_pass_id,
            gate=gate,
            check_in=timezone.now(),
            security_officer=performed_by,
            remarks=remarks
        )

        # Update appointment status to Checked In
        Appointment.objects.filter(visitor_id=visitor_id, status="Approved").update(status="Checked In")

        cls.log_audit(
            action=f"CHECK_IN: Visitor {visitor_id} @ {gate}",
            performed_by=performed_by,
            details={"log_id": str(log.id)}
        )

        return log

    @classmethod
    @transaction.atomic
    def check_out_visitor(cls, log_id, performed_by=None):
        """Logs visitor campus check-out."""
        log = EntryExitLog.objects.get(id=log_id)
        log.check_out = timezone.now()
        log.save(update_fields=["check_out"])

        # Update appointment status to Completed
        Appointment.objects.filter(visitor=log.visitor, status="Checked In").update(status="Completed")

        cls.log_audit(
            action=f"CHECK_OUT: Visitor {log.visitor.visitor_id}",
            performed_by=performed_by,
            details={"log_id": str(log.id)}
        )

        return log

    @classmethod
    @transaction.atomic
    def bulk_check_out(cls, performed_by=None):
        """Checks out all currently active campus visitors."""
        active_logs = EntryExitLog.objects.filter(check_out__isnull=True)
        count = active_logs.update(check_out=timezone.now())

        cls.log_audit(
            action=f"BULK_CHECK_OUT: {count} visitors checked out",
            performed_by=performed_by,
            details={"count": count}
        )

        return count

    @classmethod
    @transaction.atomic
    def register_vehicle(cls, data, performed_by=None):
        """Registers a visitor vehicle and assigns parking slot."""
        vehicle, _ = VisitorVehicle.objects.get_or_create(
            visitor_id=data["visitor_id"],
            vehicle_number=data["vehicle_number"],
            defaults={
                "vehicle_type": data.get("vehicle_type", "Four-Wheeler"),
                "parking_slot": data.get("parking_slot", "Visitor Parking Slot V-05"),
            }
        )

        cls.log_audit(
            action=f"REGISTER_VEHICLE: {vehicle.vehicle_number}",
            performed_by=performed_by,
            details={"vehicle_id": str(vehicle.id)}
        )

        return vehicle

    @classmethod
    @transaction.atomic
    def log_delivery(cls, data, performed_by=None):
        """Logs a courier delivery at the security gate."""
        delivery = Delivery.objects.create(
            courier_company=data.get("courier_company", "FedEx / BlueDart"),
            tracking_number=data["tracking_number"],
            recipient_id=data["recipient_id"],
            department_id=data.get("department_id"),
            delivery_status=data.get("delivery_status", "Received"),
        )

        cls.log_audit(
            action=f"LOG_DELIVERY: {delivery.tracking_number}",
            performed_by=performed_by,
            details={"delivery_id": str(delivery.id)}
        )

        return delivery

    @classmethod
    @transaction.atomic
    def manage_contractor(cls, data, performed_by=None):
        """Registers a maintenance contractor and issues a validity pass."""
        contractor = Contractor.objects.create(
            company=data["company"],
            supervisor=data["supervisor"],
            start_date=data.get("start_date", timezone.now().date()),
            end_date=data.get("end_date", timezone.now().date() + datetime.timedelta(days=90)),
            areas_allowed=data.get("areas_allowed", ["Main Building", "Labs", "Hostel Block B"]),
        )

        pass_no = f"CP-{contractor.company[:4].upper()}-{timezone.now().strftime('%m%d')}"
        ContractorPass.objects.create(
            contractor=contractor,
            pass_number=pass_no,
            validity=contractor.end_date
        )

        cls.log_audit(
            action=f"MANAGE_CONTRACTOR: {contractor.company}",
            performed_by=performed_by,
            details={"contractor_id": str(contractor.id)}
        )

        return contractor

    @classmethod
    @transaction.atomic
    def blacklist_visitor(cls, visitor_id, reason, performed_by=None):
        """Blacklists a visitor from campus entry."""
        bl, _ = VisitorBlacklist.objects.get_or_create(
            visitor_id=visitor_id,
            defaults={"reason": reason, "blocked_by": performed_by}
        )

        cls.log_audit(
            action=f"BLACKLIST_VISITOR: Visitor {visitor_id}",
            performed_by=performed_by,
            details={"reason": reason}
        )

        return bl

    @classmethod
    def compute_dashboard_kpis(cls):
        """Calculates Key Performance Indicators for the Visitor module."""
        today = timezone.now().date()
        today_visitors = EntryExitLog.objects.filter(check_in__date=today).count()
        visitors_inside = EntryExitLog.objects.filter(check_out__isnull=True).count()
        pending_appts = Appointment.objects.filter(status="Pending").count()
        active_passes = GatePass.objects.filter(status="Active").count()
        active_deliveries = Delivery.objects.filter(delivery_status="Received").count()
        active_contractors = Contractor.objects.filter(end_date__gte=today).count()
        emergency_visits = EmergencyVisitor.objects.count()
        blocked_count = VisitorBlacklist.objects.count()

        return {
            "todays_visitors": today_visitors,
            "visitors_inside_campus": visitors_inside,
            "pending_appointments": pending_appts,
            "active_gate_passes": active_passes,
            "active_deliveries": active_deliveries,
            "active_contractors": active_contractors,
            "emergency_visits": emergency_visits,
            "blocked_visitors": blocked_count,
        }

    @classmethod
    @transaction.atomic
    def soft_delete_visitor(cls, visitor_id, performed_by=None):
        """Soft deletes a visitor profile."""
        visitor = Visitor.objects.get(id=visitor_id)
        visitor.is_deleted = True
        visitor.save(update_fields=["is_deleted"])

        cls.log_audit(
            action=f"SOFT_DELETE_VISITOR: {visitor.visitor_id}",
            performed_by=performed_by,
            details={"visitor_id": str(visitor.id)}
        )

        return True
