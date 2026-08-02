import uuid
from datetime import date, timedelta
from django.db.models import Sum, Count, Q
from apps.transport.models import (
    Vehicle,
    Route,
    Stop,
    Driver,
    VehicleAssignment,
    StudentTransportAllocation,
    TransportPass,
    VehicleMaintenance,
    FuelLog,
    TransportAttendance,
    TransportIncident,
    TransportAuditLog,
)


class TransportService:
    @staticmethod
    def log_audit_event(action: str, performed_by=None, details=None):
        return TransportAuditLog.objects.create(
            action=action,
            performed_by=performed_by,
            details=details or {},
        )

    @staticmethod
    def create_vehicle(data: dict, performed_by=None) -> Vehicle:
        code = data.get("vehicle_code") or f"BUS-{uuid.uuid4().hex[:6].upper()}"
        vehicle = Vehicle.objects.create(
            vehicle_code=code,
            registration_number=data["registration_number"],
            vehicle_name=data["vehicle_name"],
            vehicle_type=data.get("vehicle_type", "bus"),
            capacity=data.get("capacity", 40),
            manufacturer=data.get("manufacturer", ""),
            model=data.get("model", ""),
            insurance_expiry=data.get("insurance_expiry"),
            fitness_expiry=data.get("fitness_expiry"),
            permit_expiry=data.get("permit_expiry"),
            gps_enabled=data.get("gps_enabled", True),
            status=data.get("status", "active"),
        )
        TransportService.log_audit_event("create_vehicle", performed_by, {"vehicle_code": code})
        return vehicle

    @staticmethod
    def allocate_student(data: dict, performed_by=None) -> StudentTransportAllocation:
        pass_num = data.get("pass_number") or f"TP-{uuid.uuid4().hex[:8].upper()}"
        allocation = StudentTransportAllocation.objects.create(
            student_id=data["student_id"],
            vehicle_id=data["vehicle_id"],
            route_id=data["route_id"],
            boarding_stop_id=data["boarding_stop_id"],
            dropping_stop_id=data["dropping_stop_id"],
            fee_plan=data.get("fee_plan", "Annual"),
            pass_number=pass_num,
            is_active=True,
        )
        TransportService.issue_pass(allocation.id, expiry_days=365, performed_by=performed_by)
        TransportService.log_audit_event("allocate_student", performed_by, {"allocation_id": str(allocation.id)})
        return allocation

    @staticmethod
    def assign_route(data: dict, performed_by=None) -> VehicleAssignment:
        assignment = VehicleAssignment.objects.create(
            driver_id=data["driver_id"],
            vehicle_id=data["vehicle_id"],
            route_id=data["route_id"],
            academic_session_id=data["academic_session_id"],
            is_active=True,
        )
        TransportService.log_audit_event("assign_route", performed_by, {"assignment_id": str(assignment.id)})
        return assignment

    @staticmethod
    def issue_pass(allocation_id: str, expiry_days: int = 365, performed_by=None) -> TransportPass:
        expiry = date.today() + timedelta(days=expiry_days)
        allocation = StudentTransportAllocation.objects.get(id=allocation_id)
        qr_data = f"PASS:{allocation.pass_number}|STUDENT:{allocation.student_id}|EXPIRE:{expiry}"
        
        pass_card, _ = TransportPass.objects.update_or_create(
            allocation=allocation,
            defaults={
                "qr_code_data": qr_data,
                "expiry_date": expiry,
                "status": "valid",
            },
        )
        return pass_card

    @staticmethod
    def record_maintenance(data: dict, performed_by=None) -> VehicleMaintenance:
        log = VehicleMaintenance.objects.create(
            vehicle_id=data["vehicle_id"],
            service_date=data.get("service_date", date.today()),
            odometer_reading=data.get("odometer_reading", 0),
            cost=data.get("cost", 0.00),
            vendor=data.get("vendor", "Authorized Service Center"),
            next_service_date=data.get("next_service_date"),
            remarks=data.get("remarks", ""),
        )
        TransportService.log_audit_event("record_maintenance", performed_by, {"vehicle_id": data["vehicle_id"]})
        return log

    @staticmethod
    def record_fuel_entry(data: dict, performed_by=None) -> FuelLog:
        fuel = FuelLog.objects.create(
            vehicle_id=data["vehicle_id"],
            fuel_date=data.get("fuel_date", date.today()),
            litres=data["litres"],
            cost=data["cost"],
            mileage_kml=data.get("mileage_kml", 0.00),
            vendor=data.get("vendor", ""),
        )
        TransportService.log_audit_event("record_fuel", performed_by, {"vehicle_id": data["vehicle_id"]})
        return fuel

    @staticmethod
    def mark_attendance(data: dict, performed_by=None) -> TransportAttendance:
        att, _ = TransportAttendance.objects.update_or_create(
            allocation_id=data["allocation_id"],
            date=data.get("date", date.today()),
            trip_type=data.get("trip_type", "morning"),
            defaults={
                "status": data.get("status", "boarded"),
                "marked_by": performed_by,
            },
        )
        return att

    @staticmethod
    def log_incident(data: dict, performed_by=None) -> TransportIncident:
        incident = TransportIncident.objects.create(
            vehicle_id=data["vehicle_id"],
            driver_id=data.get("driver_id"),
            date=data.get("date"),
            category=data.get("category", "General"),
            description=data["description"],
            severity=data.get("severity", "medium"),
            resolved=data.get("resolved", False),
        )
        TransportService.log_audit_event("log_incident", performed_by, {"incident_id": str(incident.id)})
        return incident

    @staticmethod
    def soft_delete_vehicle(vehicle_id: str, performed_by=None):
        Vehicle.objects.filter(id=vehicle_id).update(is_deleted=True, status="retired")
        TransportService.log_audit_event("soft_delete_vehicle", performed_by, {"vehicle_id": vehicle_id})

    @staticmethod
    def get_transport_dashboard_kpis() -> dict:
        total_vehicles = Vehicle.objects.count()
        active_vehicles = Vehicle.objects.filter(status="active").count()
        maintenance_vehicles = Vehicle.objects.filter(status="maintenance").count()
        total_drivers = Driver.objects.filter(status="active").count()
        total_routes = Route.objects.filter(is_active=True).count()
        total_allocated_students = StudentTransportAllocation.objects.filter(is_active=True).count()
        
        fuel_cost_total = FuelLog.objects.aggregate(total=Sum("cost"))["total"] or 0.00
        maintenance_cost_total = VehicleMaintenance.objects.aggregate(total=Sum("cost"))["total"] or 0.00
        total_incidents = TransportIncident.objects.filter(resolved=False).count()

        today = date.today()
        upcoming_expiry_date = today + timedelta(days=30)
        license_expiring_soon = Driver.objects.filter(license_expiry__lte=upcoming_expiry_date, status="active").count()
        insurance_expiring_soon = Vehicle.objects.filter(insurance_expiry__lte=upcoming_expiry_date, status="active").count()

        return {
            "total_vehicles": total_vehicles,
            "active_vehicles": active_vehicles,
            "maintenance_vehicles": maintenance_vehicles,
            "total_drivers": total_drivers,
            "total_routes": total_routes,
            "total_allocated_students": total_allocated_students,
            "fuel_cost_total": float(fuel_cost_total),
            "maintenance_cost_total": float(maintenance_cost_total),
            "open_incidents": total_incidents,
            "license_expiring_soon": license_expiring_soon,
            "insurance_expiring_soon": insurance_expiring_soon,
        }
