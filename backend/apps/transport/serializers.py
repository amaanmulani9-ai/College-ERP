from rest_framework import serializers
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


class VehicleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vehicle
        fields = "__all__"


class StopSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stop
        fields = "__all__"


class RouteSerializer(serializers.ModelSerializer):
    stops = StopSerializer(many=True, read_only=True)

    class Meta:
        model = Route
        fields = "__all__"


class DriverSerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(source="employee.profile.user.get_full_name", read_only=True)

    class Meta:
        model = Driver
        fields = "__all__"


class VehicleAssignmentSerializer(serializers.ModelSerializer):
    driver_name = serializers.CharField(source="driver.employee.profile.user.get_full_name", read_only=True)
    vehicle_name = serializers.CharField(source="vehicle.vehicle_name", read_only=True)
    route_name = serializers.CharField(source="route.route_name", read_only=True)

    class Meta:
        model = VehicleAssignment
        fields = "__all__"


class TransportPassSerializer(serializers.ModelSerializer):
    class Meta:
        model = TransportPass
        fields = "__all__"


class StudentTransportAllocationSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source="student.first_name", read_only=True)
    vehicle_name = serializers.CharField(source="vehicle.vehicle_name", read_only=True)
    route_name = serializers.CharField(source="route.route_name", read_only=True)
    boarding_stop_name = serializers.CharField(source="boarding_stop.stop_name", read_only=True)
    dropping_stop_name = serializers.CharField(source="dropping_stop.stop_name", read_only=True)
    pass_card = TransportPassSerializer(read_only=True)

    class Meta:
        model = StudentTransportAllocation
        fields = "__all__"


class VehicleMaintenanceSerializer(serializers.ModelSerializer):
    vehicle_name = serializers.CharField(source="vehicle.vehicle_name", read_only=True)

    class Meta:
        model = VehicleMaintenance
        fields = "__all__"


class FuelLogSerializer(serializers.ModelSerializer):
    vehicle_name = serializers.CharField(source="vehicle.vehicle_name", read_only=True)

    class Meta:
        model = FuelLog
        fields = "__all__"


class TransportAttendanceSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source="allocation.student.first_name", read_only=True)
    pass_number = serializers.CharField(source="allocation.pass_number", read_only=True)

    class Meta:
        model = TransportAttendance
        fields = "__all__"


class TransportIncidentSerializer(serializers.ModelSerializer):
    vehicle_name = serializers.CharField(source="vehicle.vehicle_name", read_only=True)

    class Meta:
        model = TransportIncident
        fields = "__all__"


class TransportAuditLogSerializer(serializers.ModelSerializer):
    performed_by_name = serializers.CharField(source="performed_by.get_full_name", read_only=True)

    class Meta:
        model = TransportAuditLog
        fields = "__all__"
