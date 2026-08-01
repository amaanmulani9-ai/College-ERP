import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Context Providers
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";

// Layouts
import { AuthLayout } from "./layouts/AuthLayout";
import { DashboardLayout } from "./layouts/DashboardLayout";
import { PublicLayout } from "./layouts/PublicLayout";

// Auth Guards
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { RoleRoute } from "./components/auth/RoleRoute";

// Loading Fallback
import { PageLoader } from "./components/public/PageLoader";
import { SessionTimeoutModal } from "./components/auth/SessionTimeoutModal";

// ─── Auth Pages ────────────────────────────────────────────────────────────
import { LoginPage } from "./pages/auth/LoginPage";
import { RegisterPage } from "./pages/auth/RegisterPage";
import { ForgotPasswordPage } from "./pages/auth/ForgotPasswordPage";
import { VerifyEmailPage } from "./pages/auth/VerifyEmailPage";
import { AccessDeniedPage } from "./pages/auth/AccessDeniedPage";
import { SessionExpiredPage } from "./pages/auth/SessionExpiredPage";
import { SecuritySettingsPage } from "./pages/auth/SecuritySettingsPage";
import { ChangePasswordPage } from "./pages/auth/ChangePasswordPage";
import { ActiveSessionsPage } from "./pages/auth/ActiveSessionsPage";

// ─── Role Dashboards ───────────────────────────────────────────────────────
import { SuperAdminDashboardPage } from "./pages/dashboard/SuperAdminDashboardPage";
import { PrincipalDashboardPage } from "./pages/dashboard/PrincipalDashboardPage";
import { HODDashboardPage } from "./pages/dashboard/HODDashboardPage";
import { TeacherDashboardPage } from "./pages/dashboard/TeacherDashboardPage";
import { StudentDashboardPage } from "./pages/dashboard/StudentDashboardPage";
import { ParentDashboardPage } from "./pages/dashboard/ParentDashboardPage";
import { AccountantDashboardPage } from "./pages/dashboard/AccountantDashboardPage";
import { LibrarianDashboardPage } from "./pages/dashboard/LibrarianDashboardPage";
import { HostelWardenDashboardPage } from "./pages/dashboard/HostelWardenDashboardPage";

// ─── Profile & Preferences Pages ──────────────────────────────────────────
import { ProfilePage } from "./pages/ProfilePage";
import { MyProfilePage } from "./pages/MyProfilePage";
import { EditProfilePage } from "./pages/EditProfilePage";
import { UserPreferencesPage } from "./pages/UserPreferencesPage";
import { ActivityTimelinePage } from "./pages/ActivityTimelinePage";

// ─── RBAC Pages ───────────────────────────────────────────────────────────
import { RolesPage } from "./pages/RolesPage";
import { RoleDetailsPage } from "./pages/RoleDetailsPage";
import { PermissionsPage } from "./pages/PermissionsPage";
import { PermissionMatrixPage } from "./pages/PermissionMatrixPage";
import { AssignRolesPage } from "./pages/AssignRolesPage";

// ─── Academic Pages ────────────────────────────────────────────────────────
import { FacultyManagementPage } from "./pages/FacultyManagementPage";
import { DepartmentManagementPage } from "./pages/DepartmentManagementPage";
import { ProgramManagementPage } from "./pages/ProgramManagementPage";
import { AcademicSessionsPage } from "./pages/AcademicSessionsPage";
import { SemesterManagementPage } from "./pages/SemesterManagementPage";
import { SubjectManagementPage } from "./pages/SubjectManagementPage";
import { SubjectOfferingsPage } from "./pages/SubjectOfferingsPage";

// ─── Student Management Pages ─────────────────────────────────────────────
import { StudentListPage } from "./pages/StudentListPage";
import { StudentDetailsPage } from "./pages/StudentDetailsPage";
import { CreateStudentPage } from "./pages/CreateStudentPage";
import { StudentStatisticsPage } from "./pages/StudentStatisticsPage";
import { BulkImportExportPage } from "./pages/BulkImportExportPage";

// ─── Staff & Employee Management Pages ───────────────────────────────────
import { EmployeeListPage } from "./pages/EmployeeListPage";
import { EmployeeDetailsPage } from "./pages/EmployeeDetailsPage";
import { CreateEmployeePage } from "./pages/CreateEmployeePage";
import { DesignationManagementPage } from "./pages/DesignationManagementPage";
import { EmployeeStatisticsPage } from "./pages/EmployeeStatisticsPage";

// ─── Parent & Guardian Management ─────────────────────────────────────────
import { ParentListPage } from "./pages/ParentListPage";
import { ParentDetailsPage } from "./pages/ParentDetailsPage";

// ─── Admissions Management ────────────────────────────────────────────────
import { AdmissionsDashboardPage } from "./pages/AdmissionsDashboardPage";
import { ApplicationListPage } from "./pages/ApplicationListPage";
import { ApplicationDetailsPage } from "./pages/ApplicationDetailsPage";
import { CreateApplicationPage } from "./pages/CreateApplicationPage";
import { DocumentVerificationPage } from "./pages/DocumentVerificationPage";
import { SeatMatrixPage } from "./pages/SeatMatrixPage";

// ─── Timetable Management ─────────────────────────────────────────────────
import { TimetableDashboardPage } from "./pages/TimetableDashboardPage";
import { WeeklyTimetablePage } from "./pages/WeeklyTimetablePage";
import { ConflictViewerPage } from "./pages/ConflictViewerPage";

// ─── Attendance Management ────────────────────────────────────────────────
import { AttendanceDashboardPage } from "./pages/AttendanceDashboardPage";
import { TakeAttendancePage } from "./pages/TakeAttendancePage";
import { AttendanceReportsPage } from "./pages/AttendanceReportsPage";

// ─── Examination Management ───────────────────────────────────────────────
import { ExamDashboardPage } from "./pages/ExamDashboardPage";
import { ExamSchedulePage } from "./pages/ExamSchedulePage";
import { HallTicketPage } from "./pages/HallTicketPage";

// ─── Result Management ────────────────────────────────────────────────────
import { ResultDashboardPage } from "./pages/ResultDashboardPage";
import { MarksEntryPage } from "./pages/MarksEntryPage";
import { PublishResultPage } from "./pages/PublishResultPage";
import { StudentResultPage } from "./pages/StudentResultPage";

// ─── Certificate Management ───────────────────────────────────────────────
import { CertificateDashboardPage } from "./pages/CertificateDashboardPage";
import { GenerateCertificatePage } from "./pages/GenerateCertificatePage";
import { StudentCertificatesPage } from "./pages/StudentCertificatesPage";
import { VerificationPage } from "./pages/VerificationPage";

// ─── Fee Management ───────────────────────────────────────────────────────
import FeeDashboardPage from "./pages/FeeDashboardPage";
import FeeStructurePage from "./pages/FeeStructurePage";
import CollectFeePage from "./pages/CollectFeePage";
import OutstandingReportPage from "./pages/OutstandingReportPage";

// ─── Payment Gateway ──────────────────────────────────────────────────────
import PaymentDashboardPage from "./pages/PaymentDashboardPage";
import PayFeesPage from "./pages/PayFeesPage";
import PaymentHistoryPage from "./pages/PaymentHistoryPage";
import TransactionDetailsPage from "./pages/TransactionDetailsPage";
import RefundHistoryPage from "./pages/RefundHistoryPage";

// ─── Scholarship Management ───────────────────────────────────────────────
import { ScholarshipDashboardPage } from "./pages/ScholarshipDashboardPage";
import { ScholarshipTypesPage } from "./pages/ScholarshipTypesPage";
import { StudentScholarshipsPage } from "./pages/StudentScholarshipsPage";
import { ScholarshipApplicationsPage } from "./pages/ScholarshipApplicationsPage";
import { ScholarshipRenewalsPage } from "./pages/ScholarshipRenewalsPage";
import { EligibilityCheckerPage } from "./pages/EligibilityCheckerPage";

// ─── Library Management ───────────────────────────────────────────────────
import { LibraryDashboardPage } from "./pages/LibraryDashboardPage";
import { BooksPage } from "./pages/BooksPage";
import { BookCategoriesPage } from "./pages/BookCategoriesPage";
import { AuthorsPublishersPage } from "./pages/AuthorsPublishersPage";
import { IssueBookPage } from "./pages/IssueBookPage";
import { ReturnBookPage } from "./pages/ReturnBookPage";
import { ReservationsPage } from "./pages/ReservationsPage";
import { FineReportPage } from "./pages/FineReportPage";

// ─── Hostel Management ────────────────────────────────────────────────────
import { HostelDashboardPage } from "./pages/HostelDashboardPage";
import { HostelsPage } from "./pages/HostelsPage";
import { BlocksRoomsPage } from "./pages/BlocksRoomsPage";
import { StudentAllocationPage } from "./pages/StudentAllocationPage";
import { VisitorRegisterPage } from "./pages/VisitorRegisterPage";
import { HostelMaintenancePage } from "./pages/HostelMaintenancePage";
import { VacancyReportPage } from "./pages/VacancyReportPage";

// ─── Transport Management ──────────────────────────────────────────────────
import { TransportDashboardPage } from "./pages/transport/TransportDashboardPage";
import { VehicleListPage } from "./pages/transport/VehicleListPage";
import { RouteListPage } from "./pages/transport/RouteListPage";
import { DriverListPage } from "./pages/transport/DriverListPage";
import { StudentAllocationPage as StudentTransportAllocationPage } from "./pages/transport/StudentAllocationPage";
import { TransportPassesPage } from "./pages/transport/TransportPassesPage";
import { MaintenanceLogPage } from "./pages/transport/MaintenanceLogPage";
import { FuelLogsPage } from "./pages/transport/FuelLogsPage";
import { TransportAttendancePage } from "./pages/transport/TransportAttendancePage";
import { IncidentReportsPage } from "./pages/transport/IncidentReportsPage";

// ─── Payroll Management ────────────────────────────────────────────────────
import { PayrollDashboardPage } from "./pages/payroll/PayrollDashboardPage";
import { SalaryStructurePage } from "./pages/payroll/SalaryStructurePage";
import { SalaryComponentPage } from "./pages/payroll/SalaryComponentPage";
import { EmployeeSalaryPage } from "./pages/payroll/EmployeeSalaryPage";
import { PayrollCyclePage } from "./pages/payroll/PayrollCyclePage";
import { PayrollRunPage } from "./pages/payroll/PayrollRunPage";
import { PayslipPage } from "./pages/payroll/PayslipPage";
import { AllowancePage } from "./pages/payroll/AllowancePage";
import { DeductionPage } from "./pages/payroll/DeductionPage";
import { BonusPage } from "./pages/payroll/BonusPage";
import { OvertimePage } from "./pages/payroll/OvertimePage";
import { LoanPage } from "./pages/payroll/LoanPage";
import { TaxSlabPage } from "./pages/payroll/TaxSlabPage";
import { ReportsPage as PayrollReportsPage } from "./pages/payroll/ReportsPage";

// ─── HR Management ─────────────────────────────────────────────────────────
import { HRDashboardPage } from "./pages/hr/HRDashboardPage";
import { DepartmentPage as HRDepartmentPage } from "./pages/hr/DepartmentPage";
import { DesignationPage as HRDesignationPage } from "./pages/hr/DesignationPage";
import { LeaveRequestPage } from "./pages/hr/LeaveRequestPage";
import { RecruitmentPage } from "./pages/hr/RecruitmentPage";
import { OnboardingPage } from "./pages/hr/OnboardingPage";
import { PerformancePage } from "./pages/hr/PerformancePage";
import { TrainingPage } from "./pages/hr/TrainingPage";
import { PromotionTransferPage } from "./pages/hr/PromotionTransferPage";
import { ResignationExitPage } from "./pages/hr/ResignationExitPage";
import { DisciplinaryPage } from "./pages/hr/DisciplinaryPage";
import { AnnouncementsPage } from "./pages/hr/AnnouncementsPage";
import { ReportsPage as HRReportsPage } from "./pages/hr/ReportsPage";

// ─── Lazy Loaded Public Pages ─────────────────────────────────────────────
const HomePage = lazy(() => import("./pages/public/HomePage").then(m => ({ default: m.HomePage })));
const AboutPage = lazy(() => import("./pages/public/AboutPage").then(m => ({ default: m.AboutPage })));
const FeaturesPage = lazy(() => import("./pages/public/FeaturesPage").then(m => ({ default: m.FeaturesPage })));
const ModulesPage = lazy(() => import("./pages/public/ModulesPage").then(m => ({ default: m.ModulesPage })));
const PricingPage = lazy(() => import("./pages/public/PricingPage").then(m => ({ default: m.PricingPage })));
const ContactPage = lazy(() => import("./pages/public/ContactPage").then(m => ({ default: m.ContactPage })));
const PrivacyPage = lazy(() => import("./pages/public/PrivacyPage").then(m => ({ default: m.PrivacyPage })));
const TermsPage = lazy(() => import("./pages/public/TermsPage").then(m => ({ default: m.TermsPage })));
const HelpPage = lazy(() => import("./pages/public/HelpPage").then(m => ({ default: m.HelpPage })));
const CareersPage = lazy(() => import("./pages/public/CareersPage").then(m => ({ default: m.CareersPage })));
const BlogPage = lazy(() => import("./pages/public/BlogPage").then(m => ({ default: m.BlogPage })));
const DemoPage = lazy(() => import("./pages/public/DemoPage").then(m => ({ default: m.DemoPage })));
const StatusPage = lazy(() => import("./pages/public/StatusPage").then(m => ({ default: m.StatusPage })));
const NotFoundPage = lazy(() => import("./pages/public/NotFoundPage").then(m => ({ default: m.NotFoundPage })));
const ServerErrorPage = lazy(() => import("./pages/public/ServerErrorPage").then(m => ({ default: m.ServerErrorPage })));
const OfflinePage = lazy(() => import("./pages/public/OfflinePage").then(m => ({ default: m.OfflinePage })));

// ─── React Query Client ───────────────────────────────────────────────────
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// ─── Root App Component ───────────────────────────────────────────────────
export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <SessionTimeoutModal />
          <BrowserRouter>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                {/* Public Marketing Suite Routes */}
                <Route element={<PublicLayout />}>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/features" element={<FeaturesPage />} />
                  <Route path="/modules" element={<ModulesPage />} />
                  <Route path="/pricing" element={<PricingPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/privacy" element={<PrivacyPage />} />
                  <Route path="/terms" element={<TermsPage />} />
                  <Route path="/help" element={<HelpPage />} />
                  <Route path="/careers" element={<CareersPage />} />
                  <Route path="/blog" element={<BlogPage />} />
                  <Route path="/demo" element={<DemoPage />} />
                  <Route path="/status" element={<StatusPage />} />
                  <Route path="/500" element={<ServerErrorPage />} />
                  <Route path="/offline" element={<OfflinePage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Route>

                {/* Authentication Routes */}
                <Route element={<AuthLayout />}>
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                  <Route path="/verify-email" element={<VerifyEmailPage />} />
                  <Route path="/access-denied" element={<AccessDeniedPage />} />
                  <Route path="/session-expired" element={<SessionExpiredPage />} />
                </Route>

                {/* Protected ERP Dashboard Routes */}
                <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>

                  {/* Role Dashboards */}
                  <Route path="/dashboard" element={<SuperAdminDashboardPage />} />
                  <Route path="/dashboard/super-admin" element={<SuperAdminDashboardPage />} />
                  <Route path="/dashboard/principal" element={<PrincipalDashboardPage />} />
                  <Route path="/dashboard/hod" element={<HODDashboardPage />} />
                  <Route path="/dashboard/teacher" element={<TeacherDashboardPage />} />
                  <Route path="/dashboard/student" element={<StudentDashboardPage />} />
                  <Route path="/dashboard/parent" element={<ParentDashboardPage />} />
                  <Route path="/dashboard/accountant" element={<AccountantDashboardPage />} />
                  <Route path="/dashboard/library" element={<LibrarianDashboardPage />} />
                  <Route path="/dashboard/hostel" element={<HostelWardenDashboardPage />} />

                  {/* Auth & Reset */}
                  <Route path="/reset-password" element={<SecuritySettingsPage />} />

                  {/* Profile Management */}
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/profile/me" element={<MyProfilePage />} />
                  <Route path="/profile/edit" element={<EditProfilePage />} />
                  <Route path="/profile/security" element={<SecuritySettingsPage />} />
                  <Route path="/change-password" element={<ChangePasswordPage />} />
                  <Route path="/sessions" element={<ActiveSessionsPage />} />
                  <Route path="/profile/preferences" element={<UserPreferencesPage />} />
                  <Route path="/profile/timeline" element={<ActivityTimelinePage />} />

                  {/* RBAC Routes */}
                  <Route path="/rbac/roles" element={<RolesPage />} />
                  <Route path="/rbac/roles/:id" element={<RoleDetailsPage />} />
                  <Route path="/rbac/permissions" element={<PermissionsPage />} />
                  <Route path="/rbac/matrix" element={<PermissionMatrixPage />} />
                  <Route path="/rbac/assign-roles" element={<AssignRolesPage />} />

                  {/* Student Management */}
                  <Route path="/students" element={<StudentListPage />} />
                  <Route path="/students/create" element={<CreateStudentPage />} />
                  <Route path="/students/:id" element={<StudentDetailsPage />} />
                  <Route path="/students/statistics" element={<StudentStatisticsPage />} />
                  <Route path="/students/import-export" element={<BulkImportExportPage />} />

                  {/* Staff & Employee Management */}
                  <Route path="/staff" element={<EmployeeListPage />} />
                  <Route path="/staff/create" element={<CreateEmployeePage />} />
                  <Route path="/staff/:id" element={<EmployeeDetailsPage />} />
                  <Route path="/staff/designations" element={<DesignationManagementPage />} />
                  <Route path="/staff/statistics" element={<EmployeeStatisticsPage />} />

                  {/* Parent & Guardian Management */}
                  <Route path="/parents" element={<ParentListPage />} />
                  <Route path="/parents/:id" element={<ParentDetailsPage />} />

                  {/* Academic Structure */}
                  <Route path="/academics/faculties" element={<FacultyManagementPage />} />
                  <Route path="/academics/departments" element={<DepartmentManagementPage />} />
                  <Route path="/academics/programs" element={<ProgramManagementPage />} />
                  <Route path="/academics/sessions" element={<AcademicSessionsPage />} />
                  <Route path="/academics/semesters" element={<SemesterManagementPage />} />
                  <Route path="/academics/subjects" element={<SubjectManagementPage />} />
                  <Route path="/academics/offerings" element={<SubjectOfferingsPage />} />

                  {/* Admissions Management */}
                  <Route path="/admissions" element={<AdmissionsDashboardPage />} />
                  <Route path="/admissions/applications" element={<ApplicationListPage />} />
                  <Route path="/admissions/applications/:id" element={<ApplicationDetailsPage />} />
                  <Route path="/admissions/create" element={<CreateApplicationPage />} />
                  <Route path="/admissions/documents" element={<DocumentVerificationPage />} />
                  <Route path="/admissions/seat-matrix" element={<SeatMatrixPage />} />

                  {/* Timetable Management */}
                  <Route path="/timetable" element={<TimetableDashboardPage />} />
                  <Route path="/timetable/weekly" element={<WeeklyTimetablePage />} />
                  <Route path="/timetable/conflict-checker" element={<ConflictViewerPage />} />

                  {/* Attendance Management */}
                  <Route path="/attendance" element={<AttendanceDashboardPage />} />
                  <Route path="/attendance/take" element={<TakeAttendancePage />} />
                  <Route path="/attendance/reports" element={<AttendanceReportsPage />} />

                  {/* Examination Management */}
                  <Route path="/examinations" element={<ExamDashboardPage />} />
                  <Route path="/examinations/schedules" element={<ExamSchedulePage />} />
                  <Route path="/examinations/hall-tickets" element={<HallTicketPage />} />

                  {/* Result Management */}
                  <Route path="/results" element={<ResultDashboardPage />} />
                  <Route path="/results/entry" element={<MarksEntryPage />} />
                  <Route path="/results/publish" element={<PublishResultPage />} />
                  <Route path="/results/student" element={<StudentResultPage />} />

                  {/* Certificate & Transcript */}
                  <Route path="/certificates" element={<CertificateDashboardPage />} />
                  <Route path="/certificates/generate" element={<GenerateCertificatePage />} />
                  <Route path="/certificates/student-certs" element={<StudentCertificatesPage />} />
                  <Route path="/certificates/verify" element={<VerificationPage />} />

                  {/* Fee Management */}
                  <Route path="/fees" element={<FeeDashboardPage />} />
                  <Route path="/fees/structure" element={<FeeStructurePage />} />
                  <Route path="/fees/collect" element={<CollectFeePage />} />
                  <Route path="/fees/outstanding" element={<OutstandingReportPage />} />

                  {/* Payment Gateway */}
                  <Route path="/payments" element={<PaymentDashboardPage />} />
                  <Route path="/payments/pay" element={<PayFeesPage />} />
                  <Route path="/payments/history" element={<PaymentHistoryPage />} />
                  <Route path="/payments/details" element={<TransactionDetailsPage />} />
                  <Route path="/payments/refunds" element={<RefundHistoryPage />} />

                  {/* Scholarship Management */}
                  <Route path="/scholarships" element={<ScholarshipDashboardPage />} />
                  <Route path="/scholarships/types" element={<ScholarshipTypesPage />} />
                  <Route path="/scholarships/student" element={<StudentScholarshipsPage />} />
                  <Route path="/scholarships/applications" element={<ScholarshipApplicationsPage />} />
                  <Route path="/scholarships/renewals" element={<ScholarshipRenewalsPage />} />
                  <Route path="/scholarships/eligibility" element={<EligibilityCheckerPage />} />

                  {/* Library Management */}
                  <Route path="/library" element={<LibraryDashboardPage />} />
                  <Route path="/library/books" element={<BooksPage />} />
                  <Route path="/library/categories" element={<BookCategoriesPage />} />
                  <Route path="/library/authors-publishers" element={<AuthorsPublishersPage />} />
                  <Route path="/library/issue" element={<IssueBookPage />} />
                  <Route path="/library/return" element={<ReturnBookPage />} />
                  <Route path="/library/reservations" element={<ReservationsPage />} />
                  <Route path="/library/fines" element={<FineReportPage />} />

                  {/* Hostel Management */}
                  <Route path="/hostel" element={<HostelDashboardPage />} />
                  <Route path="/hostel/buildings" element={<HostelsPage />} />
                  <Route path="/hostel/blocks-rooms" element={<BlocksRoomsPage />} />
                  <Route path="/hostel/allocations" element={<StudentAllocationPage />} />
                  <Route path="/hostel/visitors" element={<VisitorRegisterPage />} />
                  <Route path="/hostel/maintenance" element={<HostelMaintenancePage />} />
                  <Route path="/hostel/vacancy" element={<VacancyReportPage />} />

                  {/* Transport Management */}
                  <Route path="/transport" element={<TransportDashboardPage />} />
                  <Route path="/transport/dashboard" element={<TransportDashboardPage />} />
                  <Route path="/transport/vehicles" element={<VehicleListPage />} />
                  <Route path="/transport/routes" element={<RouteListPage />} />
                  <Route path="/transport/drivers" element={<DriverListPage />} />
                  <Route path="/transport/allocations" element={<StudentTransportAllocationPage />} />
                  <Route path="/transport/passes" element={<TransportPassesPage />} />
                  <Route path="/transport/maintenance" element={<MaintenanceLogPage />} />
                  <Route path="/transport/fuel" element={<FuelLogsPage />} />
                  <Route path="/transport/attendance" element={<TransportAttendancePage />} />
                  <Route path="/transport/incidents" element={<IncidentReportsPage />} />

                  {/* Payroll Management */}
                  <Route path="/payroll" element={<PayrollDashboardPage />} />
                  <Route path="/payroll/dashboard" element={<PayrollDashboardPage />} />
                  <Route path="/payroll/structures" element={<SalaryStructurePage />} />
                  <Route path="/payroll/components" element={<SalaryComponentPage />} />
                  <Route path="/payroll/employee-salary" element={<EmployeeSalaryPage />} />
                  <Route path="/payroll/cycles" element={<PayrollCyclePage />} />
                  <Route path="/payroll/runs" element={<PayrollRunPage />} />
                  <Route path="/payroll/payslips" element={<PayslipPage />} />
                  <Route path="/payroll/allowances" element={<AllowancePage />} />
                  <Route path="/payroll/deductions" element={<DeductionPage />} />
                  <Route path="/payroll/bonuses" element={<BonusPage />} />
                  <Route path="/payroll/overtime" element={<OvertimePage />} />
                  <Route path="/payroll/loans" element={<LoanPage />} />
                  <Route path="/payroll/tax-slabs" element={<TaxSlabPage />} />
                  <Route path="/payroll/reports" element={<PayrollReportsPage />} />

                  {/* HR Management */}
                  <Route path="/hr" element={<HRDashboardPage />} />
                  <Route path="/hr/dashboard" element={<HRDashboardPage />} />
                  <Route path="/hr/departments" element={<HRDepartmentPage />} />
                  <Route path="/hr/designations" element={<HRDesignationPage />} />
                  <Route path="/hr/leaves" element={<LeaveRequestPage />} />
                  <Route path="/hr/recruitment" element={<RecruitmentPage />} />
                  <Route path="/hr/onboarding" element={<OnboardingPage />} />
                  <Route path="/hr/performance" element={<PerformancePage />} />
                  <Route path="/hr/training" element={<TrainingPage />} />
                  <Route path="/hr/promotions-transfers" element={<PromotionTransferPage />} />
                  <Route path="/hr/resignations-exits" element={<ResignationExitPage />} />
                  <Route path="/hr/disciplinary" element={<DisciplinaryPage />} />
                  <Route path="/hr/announcements" element={<AnnouncementsPage />} />
                  <Route path="/hr/reports" element={<HRReportsPage />} />

                  {/* Reports */}
                  <Route path="/reports/naac-nirf" element={<SuperAdminDashboardPage />} />

                </Route>
              </Routes>
            </Suspense>
          </BrowserRouter>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;
