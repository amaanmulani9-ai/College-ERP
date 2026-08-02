from rest_framework import serializers

from .models import (
    Bed,
    Block,
    Floor,
    Hostel,
    HostelAllocation,
    HostelAuditLog,
    MaintenanceRequest,
    Room,
    Visitor,
    Warden,
)


class HostelSerializer(serializers.ModelSerializer):
    gender_type_display = serializers.CharField(source="get_gender_type_display", read_only=True)

    class Meta:
        model = Hostel
        fields = [
            "id",
            "name",
            "code",
            "gender_type",
            "gender_type_display",
            "address",
            "is_active",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]


class BlockSerializer(serializers.ModelSerializer):
    hostel_name = serializers.CharField(source="hostel.name", read_only=True)

    class Meta:
        model = Block
        fields = ["id", "hostel", "hostel_name", "name", "code", "created_at", "updated_at"]
        read_only_fields = ["id", "created_at", "updated_at"]


class FloorSerializer(serializers.ModelSerializer):
    block_name = serializers.CharField(source="block.name", read_only=True)

    class Meta:
        model = Floor
        fields = ["id", "block", "block_name", "floor_number", "created_at", "updated_at"]
        read_only_fields = ["id", "created_at", "updated_at"]


class RoomSerializer(serializers.ModelSerializer):
    room_type_display = serializers.CharField(source="get_room_type_display", read_only=True)
    status_display = serializers.CharField(source="get_status_display", read_only=True)
    floor_number = serializers.IntegerField(source="floor.floor_number", read_only=True)
    block_name = serializers.CharField(source="floor.block.name", read_only=True)
    hostel_name = serializers.CharField(source="floor.block.hostel.name", read_only=True)

    class Meta:
        model = Room
        fields = [
            "id",
            "floor",
            "floor_number",
            "block_name",
            "hostel_name",
            "room_number",
            "room_type",
            "room_type_display",
            "capacity",
            "occupied_beds",
            "status",
            "status_display",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "occupied_beds", "created_at", "updated_at"]


class BedSerializer(serializers.ModelSerializer):
    status_display = serializers.CharField(source="get_status_display", read_only=True)
    room_number = serializers.CharField(source="room.room_number", read_only=True)

    class Meta:
        model = Bed
        fields = ["id", "room", "room_number", "bed_number", "status", "status_display", "created_at", "updated_at"]
        read_only_fields = ["id", "created_at", "updated_at"]


class WardenSerializer(serializers.ModelSerializer):
    hostel_name = serializers.CharField(source="hostel.name", read_only=True)
    employee_name = serializers.CharField(source="employee.profile.user.get_full_name", read_only=True)

    class Meta:
        model = Warden
        fields = [
            "id",
            "employee",
            "employee_name",
            "hostel",
            "hostel_name",
            "contact_number",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]


class HostelAllocationSerializer(serializers.ModelSerializer):
    status_display = serializers.CharField(source="get_status_display", read_only=True)
    student_id_str = serializers.CharField(source="student.student_id", read_only=True)
    student_name = serializers.CharField(source="student.profile.user.get_full_name", read_only=True)
    bed_number = serializers.CharField(source="bed.bed_number", read_only=True)
    room_number = serializers.CharField(source="bed.room.room_number", read_only=True)

    class Meta:
        model = HostelAllocation
        fields = [
            "id",
            "student",
            "student_id_str",
            "student_name",
            "bed",
            "bed_number",
            "room_number",
            "academic_session",
            "check_in_date",
            "check_out_date",
            "status",
            "status_display",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]


class VisitorSerializer(serializers.ModelSerializer):
    student_id_str = serializers.CharField(source="student.student_id", read_only=True)

    class Meta:
        model = Visitor
        fields = [
            "id",
            "student",
            "student_id_str",
            "visitor_name",
            "relation",
            "mobile",
            "visit_date",
            "check_in_time",
            "check_out_time",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]


class MaintenanceRequestSerializer(serializers.ModelSerializer):
    status_display = serializers.CharField(source="get_status_display", read_only=True)
    room_number = serializers.CharField(source="room.room_number", read_only=True)

    class Meta:
        model = MaintenanceRequest
        fields = [
            "id",
            "room",
            "room_number",
            "title",
            "description",
            "status",
            "status_display",
            "assigned_to",
            "completed_date",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]


class HostelAuditLogSerializer(serializers.ModelSerializer):
    actor_email = serializers.CharField(source="actor.email", read_only=True, default="")

    class Meta:
        model = HostelAuditLog
        fields = ["id", "hostel", "allocation", "actor", "actor_email", "event_type", "description", "timestamp"]
        read_only_fields = fields


# ---------------------------------------------------------------------------
# Action Request Serializers
# ---------------------------------------------------------------------------


class AllocateBedRequestSerializer(serializers.Serializer):
    student_id = serializers.UUIDField()
    bed_id = serializers.UUIDField()
    academic_session_id = serializers.UUIDField()
    fee_amount = serializers.DecimalField(max_digits=10, decimal_places=2, required=False, allow_null=True)


class TransferRoomRequestSerializer(serializers.Serializer):
    allocation_id = serializers.UUIDField()
    new_bed_id = serializers.UUIDField()


class CheckInRequestSerializer(serializers.Serializer):
    allocation_id = serializers.UUIDField()
    check_in_date = serializers.DateField(required=False, allow_null=True)


class CheckOutRequestSerializer(serializers.Serializer):
    allocation_id = serializers.UUIDField()
    check_out_date = serializers.DateField(required=False, allow_null=True)
