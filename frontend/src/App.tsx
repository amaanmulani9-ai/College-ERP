import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MainLayout } from "./layouts/MainLayout";
import { DashboardPage } from "./pages/DashboardPage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { ForgotPasswordPage } from "./pages/ForgotPasswordPage";
import { ResetPasswordPage } from "./pages/ResetPasswordPage";
import { VerifyEmailPage } from "./pages/VerifyEmailPage";
import { ProfilePage } from "./pages/ProfilePage";

import { RolesPage } from "./pages/RolesPage";
import { RoleDetailsPage } from "./pages/RoleDetailsPage";
import { PermissionsPage } from "./pages/PermissionsPage";
import { PermissionMatrixPage } from "./pages/PermissionMatrixPage";
import { AssignRolesPage } from "./pages/AssignRolesPage";

import { MyProfilePage } from "./pages/MyProfilePage";
import { EditProfilePage } from "./pages/EditProfilePage";
import { UserPreferencesPage } from "./pages/UserPreferencesPage";
import { ActivityTimelinePage } from "./pages/ActivityTimelinePage";

import { FacultyManagementPage } from "./pages/FacultyManagementPage";
import { DepartmentManagementPage } from "./pages/DepartmentManagementPage";
import { ProgramManagementPage } from "./pages/ProgramManagementPage";
import { AcademicSessionsPage } from "./pages/AcademicSessionsPage";
import { SemesterManagementPage } from "./pages/SemesterManagementPage";
import { SubjectManagementPage } from "./pages/SubjectManagementPage";
import { SubjectOfferingsPage } from "./pages/SubjectOfferingsPage";

import { StudentListPage } from "./pages/StudentListPage";
import { StudentDetailsPage } from "./pages/StudentDetailsPage";
import { CreateStudentPage } from "./pages/CreateStudentPage";
import { StudentStatisticsPage } from "./pages/StudentStatisticsPage";
import { BulkImportExportPage } from "./pages/BulkImportExportPage";

import { EmployeeListPage } from "./pages/EmployeeListPage";
import { EmployeeDetailsPage } from "./pages/EmployeeDetailsPage";
import { CreateEmployeePage } from "./pages/CreateEmployeePage";
import { DesignationManagementPage } from "./pages/DesignationManagementPage";
import { EmployeeStatisticsPage } from "./pages/EmployeeStatisticsPage";

import { ParentListPage } from "./pages/ParentListPage";
import { ParentDetailsPage } from "./pages/ParentDetailsPage";

import { AdmissionsDashboardPage } from "./pages/AdmissionsDashboardPage";
import { ApplicationListPage } from "./pages/ApplicationListPage";
import { ApplicationDetailsPage } from "./pages/ApplicationDetailsPage";
import { CreateApplicationPage } from "./pages/CreateApplicationPage";
import { DocumentVerificationPage } from "./pages/DocumentVerificationPage";
import { SeatMatrixPage } from "./pages/SeatMatrixPage";

import { TimetableDashboardPage } from "./pages/TimetableDashboardPage";
import { WeeklyTimetablePage } from "./pages/WeeklyTimetablePage";
import { ConflictViewerPage } from "./pages/ConflictViewerPage";

import { AttendanceDashboardPage } from "./pages/AttendanceDashboardPage";
import { TakeAttendancePage } from "./pages/TakeAttendancePage";
import { AttendanceReportsPage } from "./pages/AttendanceReportsPage";

import { ExamDashboardPage } from "./pages/ExamDashboardPage";
import { ExamSchedulePage } from "./pages/ExamSchedulePage";
import { HallTicketPage } from "./pages/HallTicketPage";

import { ResultDashboardPage } from "./pages/ResultDashboardPage";
import { MarksEntryPage } from "./pages/MarksEntryPage";
import { PublishResultPage } from "./pages/PublishResultPage";
import { StudentResultPage } from "./pages/StudentResultPage";

import { CertificateDashboardPage } from "./pages/CertificateDashboardPage";
import { GenerateCertificatePage } from "./pages/GenerateCertificatePage";
import { StudentCertificatesPage } from "./pages/StudentCertificatesPage";
import { VerificationPage } from "./pages/VerificationPage";

import FeeDashboardPage from "./pages/FeeDashboardPage";
import FeeStructurePage from "./pages/FeeStructurePage";
import CollectFeePage from "./pages/CollectFeePage";
import OutstandingReportPage from "./pages/OutstandingReportPage";

import PaymentDashboardPage from "./pages/PaymentDashboardPage";
import PayFeesPage from "./pages/PayFeesPage";
import PaymentHistoryPage from "./pages/PaymentHistoryPage";
import TransactionDetailsPage from "./pages/TransactionDetailsPage";
import RefundHistoryPage from "./pages/RefundHistoryPage";

import { ScholarshipDashboardPage } from "./pages/ScholarshipDashboardPage";
import { ScholarshipTypesPage } from "./pages/ScholarshipTypesPage";
import { StudentScholarshipsPage } from "./pages/StudentScholarshipsPage";
import { ScholarshipApplicationsPage } from "./pages/ScholarshipApplicationsPage";
import { ScholarshipRenewalsPage } from "./pages/ScholarshipRenewalsPage";
import { EligibilityCheckerPage } from "./pages/EligibilityCheckerPage";

import { LibraryDashboardPage } from "./pages/LibraryDashboardPage";
import { BooksPage } from "./pages/BooksPage";
import { BookCategoriesPage } from "./pages/BookCategoriesPage";
import { AuthorsPublishersPage } from "./pages/AuthorsPublishersPage";
import { IssueBookPage } from "./pages/IssueBookPage";
import { ReturnBookPage } from "./pages/ReturnBookPage";
import { ReservationsPage } from "./pages/ReservationsPage";
import { FineReportPage } from "./pages/FineReportPage";

import { HostelDashboardPage } from "./pages/HostelDashboardPage";
import { HostelsPage } from "./pages/HostelsPage";
import { BlocksRoomsPage } from "./pages/BlocksRoomsPage";
import { StudentAllocationPage } from "./pages/StudentAllocationPage";
import { VisitorRegisterPage } from "./pages/VisitorRegisterPage";
import { HostelMaintenancePage } from "./pages/HostelMaintenancePage";
import { VacancyReportPage } from "./pages/VacancyReportPage";

import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthLayout } from "./layouts/AuthLayout";
import { LoginPage } from "./pages/auth/LoginPage";
import { RegisterPage } from "./pages/auth/RegisterPage";
import { ForgotPasswordPage } from "./pages/auth/ForgotPasswordPage";
import { VerifyEmailPage } from "./pages/auth/VerifyEmailPage";
import { AccessDeniedPage } from "./pages/auth/AccessDeniedPage";
import { SessionExpiredPage } from "./pages/auth/SessionExpiredPage";

import { SessionTimeoutModal } from "./components/auth/SessionTimeoutModal";
import { SecuritySettingsPage } from "./pages/auth/SecuritySettingsPage";
import { ChangePasswordPage } from "./pages/auth/ChangePasswordPage";
import { ActiveSessionsPage } from "./pages/auth/ActiveSessionsPage";

// Lazy Loaded Public Pages for Optimized Performance
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

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

import { AuthProvider } from "./context/AuthContext";

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

              {/* Authentication Routes with AuthLayout */}
              <Route element={<AuthLayout />}>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/verify-email" element={<VerifyEmailPage />} />
                <Route path="/access-denied" element={<AccessDeniedPage />} />
                <Route path="/session-expired" element={<SessionExpiredPage />} />
              </Route>

          {/* Institutional Dashboard & ERP App Routes */}
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/profile" element={<ProfilePage />} />

            {/* Profile & Security Management Routes */}
            <Route path="/profile/me" element={<MyProfilePage />} />
            <Route path="/profile/edit" element={<EditProfilePage />} />
            <Route path="/profile/security" element={<SecuritySettingsPage />} />
            <Route path="/change-password" element={<ChangePasswordPage />} />
            <Route path="/sessions" element={<ActiveSessionsPage />} />
            <Route path="/profile/preferences" element={<UserPreferencesPage />} />
            <Route path="/profile/timeline" element={<ActivityTimelinePage />} />

            {/* Student Management Routes */}
            <Route path="/students" element={<StudentListPage />} />
            <Route path="/students/create" element={<CreateStudentPage />} />
            <Route path="/students/:id" element={<StudentDetailsPage />} />
            <Route path="/students/statistics" element={<StudentStatisticsPage />} />
            <Route path="/students/import-export" element={<BulkImportExportPage />} />

            {/* Staff & Employee Management Routes */}
            <Route path="/staff" element={<EmployeeListPage />} />
            <Route path="/staff/create" element={<CreateEmployeePage />} />
            <Route path="/staff/:id" element={<EmployeeDetailsPage />} />
            <Route path="/staff/designations" element={<DesignationManagementPage />} />
            <Route path="/staff/statistics" element={<EmployeeStatisticsPage />} />

            {/* Academic Structure Routes */}
            <Route path="/academics/faculties" element={<FacultyManagementPage />} />
            <Route path="/academics/departments" element={<DepartmentManagementPage />} />
            <Route path="/academics/programs" element={<ProgramManagementPage />} />
            <Route path="/academics/sessions" element={<AcademicSessionsPage />} />
            <Route path="/academics/semesters" element={<SemesterManagementPage />} />
            <Route path="/academics/subjects" element={<SubjectManagementPage />} />
            <Route path="/academics/offerings" element={<SubjectOfferingsPage />} />

            {/* RBAC Routes */}
            <Route path="/rbac/roles" element={<RolesPage />} />
            <Route path="/rbac/roles/:id" element={<RoleDetailsPage />} />
            <Route path="/rbac/permissions" element={<PermissionsPage />} />
            <Route path="/rbac/matrix" element={<PermissionMatrixPage />} />
            <Route path="/rbac/assign-roles" element={<AssignRolesPage />} />
            {/* Parent & Guardian Management Routes */}
            <Route path="/parents" element={<ParentListPage />} />
            <Route path="/parents/:id" element={<ParentDetailsPage />} />

            {/* Admissions Management Routes */}
            <Route path="/admissions" element={<AdmissionsDashboardPage />} />
            <Route path="/admissions/applications" element={<ApplicationListPage />} />
            <Route path="/admissions/applications/:id" element={<ApplicationDetailsPage />} />
            <Route path="/admissions/create" element={<CreateApplicationPage />} />
            <Route path="/admissions/documents" element={<DocumentVerificationPage />} />
            <Route path="/admissions/seat-matrix" element={<SeatMatrixPage />} />

            {/* Timetable Management Routes */}
            <Route path="/timetable" element={<TimetableDashboardPage />} />
            <Route path="/timetable/weekly" element={<WeeklyTimetablePage />} />
            <Route path="/timetable/conflict-checker" element={<ConflictViewerPage />} />

            {/* Attendance Management Routes */}
            <Route path="/attendance" element={<AttendanceDashboardPage />} />
            <Route path="/attendance/take" element={<TakeAttendancePage />} />
            <Route path="/attendance/reports" element={<AttendanceReportsPage />} />

            {/* Examination Management Routes */}
            <Route path="/examinations" element={<ExamDashboardPage />} />
            <Route path="/examinations/schedules" element={<ExamSchedulePage />} />
            <Route path="/examinations/hall-tickets" element={<HallTicketPage />} />

            {/* Result Management Routes */}
            <Route path="/results" element={<ResultDashboardPage />} />
            <Route path="/results/entry" element={<MarksEntryPage />} />
            <Route path="/results/publish" element={<PublishResultPage />} />
            <Route path="/results/student" element={<StudentResultPage />} />

            {/* Certificate & Transcript Routes */}
            <Route path="/certificates" element={<CertificateDashboardPage />} />
            <Route path="/certificates/generate" element={<GenerateCertificatePage />} />
            <Route path="/certificates/student-certs" element={<StudentCertificatesPage />} />
            <Route path="/certificates/verify" element={<VerificationPage />} />

            {/* Fee Management Routes */}
            <Route path="/fees" element={<FeeDashboardPage />} />
            <Route path="/fees/structure" element={<FeeStructurePage />} />
            <Route path="/fees/collect" element={<CollectFeePage />} />
            <Route path="/fees/outstanding" element={<OutstandingReportPage />} />

            {/* Payment Gateway Routes */}
            <Route path="/payments" element={<PaymentDashboardPage />} />
            <Route path="/payments/pay" element={<PayFeesPage />} />
            <Route path="/payments/history" element={<PaymentHistoryPage />} />
            <Route path="/payments/details" element={<TransactionDetailsPage />} />
            <Route path="/payments/refunds" element={<RefundHistoryPage />} />

            {/* Scholarship Management Routes */}
            <Route path="/scholarships" element={<ScholarshipDashboardPage />} />
            <Route path="/scholarships/types" element={<ScholarshipTypesPage />} />
            <Route path="/scholarships/student" element={<StudentScholarshipsPage />} />
            <Route path="/scholarships/applications" element={<ScholarshipApplicationsPage />} />
            <Route path="/scholarships/renewals" element={<ScholarshipRenewalsPage />} />
            <Route path="/scholarships/eligibility" element={<EligibilityCheckerPage />} />

            {/* Library Management Routes */}
            <Route path="/library" element={<LibraryDashboardPage />} />
            <Route path="/library/books" element={<BooksPage />} />
            <Route path="/library/categories" element={<BookCategoriesPage />} />
            <Route path="/library/authors-publishers" element={<AuthorsPublishersPage />} />
            <Route path="/library/issue" element={<IssueBookPage />} />
            <Route path="/library/return" element={<ReturnBookPage />} />
            <Route path="/library/reservations" element={<ReservationsPage />} />
            <Route path="/library/fines" element={<FineReportPage />} />

            {/* Hostel Management Routes */}
            <Route path="/hostel" element={<HostelDashboardPage />} />
            <Route path="/hostel/buildings" element={<HostelsPage />} />
            <Route path="/hostel/blocks-rooms" element={<BlocksRoomsPage />} />
            <Route path="/hostel/allocations" element={<StudentAllocationPage />} />
            <Route path="/hostel/visitors" element={<VisitorRegisterPage />} />
            <Route path="/hostel/maintenance" element={<HostelMaintenancePage />} />
            <Route path="/hostel/vacancy" element={<VacancyReportPage />} />
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
