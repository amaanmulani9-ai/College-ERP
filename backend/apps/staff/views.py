from django.db.models import Count
from rest_framework import generics, viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from apps.authentication.models import User
from apps.profiles.models import UserProfile
from .models import Designation, Employee, EmployeeStatusHistory
from .serializers import (
    CreateEmployeeSerializer,
    DesignationSerializer,
    EmployeeSerializer,
    EmployeeStatusHistorySerializer,
)
from .services import (
    generate_employee_code,
    reinstate_employee,
    resign_employee,
    restore_employee,
    retire_employee,
    soft_delete_employee,
    suspend_employee,
    terminate_employee,
)


class DesignationViewSet(viewsets.ModelViewSet):
    queryset = Designation.objects.all()
    serializer_class = DesignationSerializer
    permission_classes = [IsAuthenticated]
    search_fields = ["name", "code"]
    filterset_fields = ["category", "department", "is_active"]


class EmployeeViewSet(viewsets.ModelViewSet):
    queryset = Employee.objects.all().select_related("profile", "department", "designation", "reporting_manager")
    permission_classes = [IsAuthenticated]
    search_fields = ["employee_id", "employee_number", "profile__first_name", "profile__last_name", "work_email"]
    filterset_fields = ["department", "designation", "employment_type", "employment_status", "designation__category"]

    def get_serializer_class(self):
        if self.action == "create":
            return CreateEmployeeSerializer
        return EmployeeSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        data = serializer.validated_data
        first_name = data.pop("first_name")
        last_name = data.pop("last_name")
        email = data.pop("email")
        password = data.pop("password", "StaffPassword123!")

        user = User.objects.create_user(email=email, password=password, first_name=first_name, last_name=last_name)
        profile, _ = UserProfile.objects.get_or_create(user=user, defaults={"first_name": first_name, "last_name": last_name})

        code = generate_employee_code()

        employee = Employee.objects.create(
            employee_id=code,
            profile=profile,
            **data,
        )

        return Response(EmployeeSerializer(employee).data, status=status.HTTP_201_CREATED)

    def perform_destroy(self, instance):
        soft_delete_employee(instance, actor=self.request.user, request=self.request)

    @action(detail=True, methods=["post"])
    def suspend(self, request, pk=None):
        employee = self.get_object()
        reason = request.data.get("reason", "Suspended by admin decision")
        suspend_employee(employee, reason=reason, actor=request.user, request=request)
        return Response(EmployeeSerializer(employee).data, status=status.HTTP_200_OK)

    @action(detail=True, methods=["post"])
    def reinstate(self, request, pk=None):
        employee = self.get_object()
        reinstate_employee(employee, actor=request.user, request=request)
        return Response(EmployeeSerializer(employee).data, status=status.HTTP_200_OK)

    @action(detail=True, methods=["post"])
    def resign(self, request, pk=None):
        employee = self.get_object()
        reason = request.data.get("reason", "Resigned voluntarily")
        resign_employee(employee, reason=reason, actor=request.user, request=request)
        return Response(EmployeeSerializer(employee).data, status=status.HTTP_200_OK)

    @action(detail=True, methods=["post"])
    def retire(self, request, pk=None):
        employee = self.get_object()
        retire_employee(employee, actor=request.user, request=request)
        return Response(EmployeeSerializer(employee).data, status=status.HTTP_200_OK)

    @action(detail=True, methods=["post"])
    def terminate(self, request, pk=None):
        employee = self.get_object()
        reason = request.data.get("reason", "Terminated contract")
        terminate_employee(employee, reason=reason, actor=request.user, request=request)
        return Response(EmployeeSerializer(employee).data, status=status.HTTP_200_OK)

    @action(detail=True, methods=["post"])
    def restore(self, request, pk=None):
        employee = Employee.all_objects.get(pk=pk)
        restore_employee(employee, actor=request.user, request=request)
        return Response(EmployeeSerializer(employee).data, status=status.HTTP_200_OK)

    @action(detail=True, methods=["get"], url_path="status-history")
    def status_history(self, request, pk=None):
        employee = self.get_object()
        history = employee.status_history.all()
        return Response(EmployeeStatusHistorySerializer(history, many=True).data, status=status.HTTP_200_OK)


class StaffDashboardSummaryView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        total_employees = Employee.objects.count()
        active_count = Employee.objects.filter(employment_status="active").count()
        teaching_count = Employee.objects.filter(designation__category="teaching", employment_status="active").count()
        non_teaching_count = Employee.objects.filter(employment_status="active").exclude(designation__category="teaching").count()

        department_breakdown = (
            Employee.objects.filter(employment_status="active")
            .values("department__name")
            .annotate(count=Count("id"))
            .order_by("-count")
        )

        return Response(
            {
                "total_employees": total_employees,
                "active_employees": active_count,
                "teaching_staff": teaching_count,
                "non_teaching_staff": non_teaching_count,
                "department_breakdown": department_breakdown,
            },
            status=status.HTTP_200_OK,
        )


class StaffBulkImportView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        return Response({"detail": "Bulk staff import CSV parser placeholder triggered."}, status=status.HTTP_200_OK)


class StaffBulkExportView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({"detail": "Bulk staff export CSV stream placeholder generated."}, status=status.HTTP_200_OK)
