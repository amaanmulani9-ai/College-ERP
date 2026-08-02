from rest_framework import serializers
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


class VisitorDocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = VisitorDocument
        fields = "__all__"


class VisitorVehicleSerializer(serializers.ModelSerializer):
    class Meta:
        model = VisitorVehicle
        fields = "__all__"


class VisitorSerializer(serializers.ModelSerializer):
    documents = VisitorDocumentSerializer(many=True, read_only=True)
    vehicles = VisitorVehicleSerializer(many=True, read_only=True)

    class Meta:
        model = Visitor
        fields = [
            "id",
            "visitor_id",
            "first_name",
            "last_name",
            "mobile",
            "email",
            "photo",
            "company",
            "govt_id_type",
            "govt_id_number",
            "address",
            "documents",
            "vehicles",
            "is_deleted",
            "created_at",
            "updated_at",
        ]


class VisitPurposeSerializer(serializers.ModelSerializer):
    class Meta:
        model = VisitPurpose
        fields = "__all__"


class AppointmentSerializer(serializers.ModelSerializer):
    visitor_name = serializers.CharField(source="visitor.get_full_name", read_only=True)
    visitor_mobile = serializers.CharField(source="visitor.mobile", read_only=True)
    host_employee_id = serializers.CharField(source="host_employee.employee_id", read_only=True)
    department_name = serializers.CharField(source="department.name", read_only=True)

    class Meta:
        model = Appointment
        fields = "__all__"


class GatePassSerializer(serializers.ModelSerializer):
    visitor_name = serializers.CharField(source="visitor.get_full_name", read_only=True)

    class Meta:
        model = GatePass
        fields = "__all__"


class EntryExitLogSerializer(serializers.ModelSerializer):
    visitor_name = serializers.CharField(source="visitor.get_full_name", read_only=True)
    visitor_id_code = serializers.CharField(source="visitor.visitor_id", read_only=True)
    pass_number = serializers.CharField(source="gate_pass.pass_number", read_only=True)

    class Meta:
        model = EntryExitLog
        fields = "__all__"


class DeliverySerializer(serializers.ModelSerializer):
    recipient_email = serializers.CharField(source="recipient.email", read_only=True)
    department_name = serializers.CharField(source="department.name", read_only=True)

    class Meta:
        model = Delivery
        fields = "__all__"


class ContractorPassSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContractorPass
        fields = "__all__"


class ContractorSerializer(serializers.ModelSerializer):
    passes = ContractorPassSerializer(many=True, read_only=True)

    class Meta:
        model = Contractor
        fields = [
            "id",
            "company",
            "supervisor",
            "start_date",
            "end_date",
            "areas_allowed",
            "passes",
        ]


class EmergencyVisitorSerializer(serializers.ModelSerializer):
    visitor_name = serializers.CharField(source="visitor.get_full_name", read_only=True)

    class Meta:
        model = EmergencyVisitor
        fields = "__all__"


class RestrictedAreaAccessSerializer(serializers.ModelSerializer):
    visitor_name = serializers.CharField(source="visitor.get_full_name", read_only=True)

    class Meta:
        model = RestrictedAreaAccess
        fields = "__all__"


class VisitorBlacklistSerializer(serializers.ModelSerializer):
    visitor_name = serializers.CharField(source="visitor.get_full_name", read_only=True)

    class Meta:
        model = VisitorBlacklist
        fields = "__all__"


class VisitorFeedbackSerializer(serializers.ModelSerializer):
    visitor_name = serializers.CharField(source="visitor.get_full_name", read_only=True)

    class Meta:
        model = VisitorFeedback
        fields = "__all__"


class SecurityOfficerSerializer(serializers.ModelSerializer):
    employee_id_code = serializers.CharField(source="employee.employee_id", read_only=True)
    officer_name = serializers.SerializerMethodField()

    class Meta:
        model = SecurityOfficer
        fields = "__all__"

    def get_officer_name(self, obj):
        if obj.employee and hasattr(obj.employee, "profile"):
            return obj.employee.profile.get_full_name()
        return "Security Officer"


class VisitorNotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = VisitorNotification
        fields = "__all__"


class VisitorAuditLogSerializer(serializers.ModelSerializer):
    performed_by_email = serializers.CharField(source="performed_by.email", read_only=True)

    class Meta:
        model = VisitorAuditLog
        fields = "__all__"
