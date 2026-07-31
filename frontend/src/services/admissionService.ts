import { api } from "./authService";

export interface AdmissionApplicationItem {
  id: string;
  application_number: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  email: string;
  mobile: string;
  date_of_birth: string | null;
  gender: string;
  nationality: string;
  category: string;
  academic_session: string;
  academic_session_detail?: any;
  program: string;
  program_detail?: any;
  department: string;
  department_detail?: any;
  previous_qualification: string;
  percentage_cgpa: number | null;
  application_source: string;
  status: string;
  status_display: string;
  reviewer: string | null;
  reviewer_name: string;
  guardian_name: string;
  guardian_email: string;
  guardian_phone: string;
  guardian_relationship: string;
  enrolled_student: string | null;
  enrolled_student_detail?: any;
  remarks: string;
  status_history: StatusHistoryItem[];
  documents: AdmissionDocumentItem[];
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

export interface StatusHistoryItem {
  id: string;
  previous_status: string;
  new_status: string;
  changed_by: string | null;
  changed_by_name: string;
  remarks: string;
  timestamp: string;
}

export interface AdmissionDocumentItem {
  id: string;
  application: string;
  document_type: string;
  document_type_display: string;
  file: string;
  original_filename: string;
  review_status: string;
  review_status_display: string;
  reviewed_by: string | null;
  reviewed_by_name: string;
  review_remarks: string;
  uploaded_at: string;
  reviewed_at: string | null;
}

export interface SeatMatrixItem {
  id: string;
  program: string;
  program_name: string;
  program_code: string;
  academic_session: string;
  session_name: string;
  category: string;
  total_seats: number;
  occupied_seats: number;
  available_seats: number;
}

export interface AdmissionsDashboardStats {
  total_applications: number;
  status_breakdown: Array<{ status: string; count: number }>;
  program_breakdown: Array<{ program__name: string; count: number }>;
  pending_documents: number;
  total_seats: number;
  occupied_seats: number;
  available_seats: number;
}

export const admissionService = {
  // -----------------------------------------------------------------------
  // Applications CRUD
  // -----------------------------------------------------------------------
  listApplications: (params?: Record<string, string>) =>
    api.get<{ results: AdmissionApplicationItem[]; count: number }>("/admissions/applications/", { params }),

  getApplication: (id: string) =>
    api.get<AdmissionApplicationItem>(`/admissions/applications/${id}/`),

  createApplication: (data: Record<string, unknown>) =>
    api.post<AdmissionApplicationItem>("/admissions/applications/", data),

  updateApplication: (id: string, data: Record<string, unknown>) =>
    api.patch<AdmissionApplicationItem>(`/admissions/applications/${id}/`, data),

  deleteApplication: (id: string) =>
    api.delete(`/admissions/applications/${id}/`),

  // -----------------------------------------------------------------------
  // Application Actions & Workflow
  // -----------------------------------------------------------------------
  submitApplication: (id: string) =>
    api.post<AdmissionApplicationItem>(`/admissions/applications/${id}/submit/`),

  approveApplication: (id: string, remarks?: string) =>
    api.post<AdmissionApplicationItem>(`/admissions/applications/${id}/approve/`, { remarks }),

  rejectApplication: (id: string, remarks?: string) =>
    api.post<AdmissionApplicationItem>(`/admissions/applications/${id}/reject/`, { remarks }),

  transitionApplication: (id: string, status: string, remarks?: string) =>
    api.post<AdmissionApplicationItem>(`/admissions/applications/${id}/transition/`, { status, remarks }),

  enrollApplication: (id: string) =>
    api.post<{ detail: string; student_id: string; student_pk: string; application: AdmissionApplicationItem }>(
      `/admissions/applications/${id}/enroll/`
    ),

  restoreApplication: (id: string) =>
    api.post<AdmissionApplicationItem>(`/admissions/applications/${id}/restore/`),

  getAuditLog: (id: string) =>
    api.get<unknown[]>(`/admissions/applications/${id}/audit-log/`),

  // -----------------------------------------------------------------------
  // Bulk Actions
  // -----------------------------------------------------------------------
  bulkApprove: (ids: string[], remarks?: string) =>
    api.post<{ detail: string; errors: any[] }>("/admissions/applications/bulk-approve/", { ids, remarks }),

  bulkReject: (ids: string[], remarks?: string) =>
    api.post<{ detail: string; errors: any[] }>("/admissions/applications/bulk-reject/", { ids, remarks }),

  assignReviewer: (ids: string[], reviewer_id: string) =>
    api.post<{ detail: string }>("/admissions/applications/assign-reviewer/", { ids, reviewer_id }),

  // -----------------------------------------------------------------------
  // Document Management
  // -----------------------------------------------------------------------
  listDocuments: (params?: Record<string, string>) =>
    api.get<{ results: AdmissionDocumentItem[]; count: number }>("/admissions/documents/", { params }),

  uploadDocument: (formData: FormData) =>
    api.post<AdmissionDocumentItem>("/admissions/documents/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  reviewDocument: (documentId: string, status: string, remarks?: string) =>
    api.post<AdmissionDocumentItem>(`/admissions/documents/${documentId}/review/`, { status, remarks }),

  // -----------------------------------------------------------------------
  // Seat Matrix CRUD
  // -----------------------------------------------------------------------
  listSeatMatrices: (params?: Record<string, string>) =>
    api.get<{ results: SeatMatrixItem[]; count: number }>("/admissions/seat-matrix/", { params }),

  createSeatMatrix: (data: Record<string, unknown>) =>
    api.post<SeatMatrixItem>("/admissions/seat-matrix/", data),

  updateSeatMatrix: (id: string, data: Record<string, unknown>) =>
    api.patch<SeatMatrixItem>(`/admissions/seat-matrix/${id}/`, data),

  deleteSeatMatrix: (id: string) =>
    api.delete(`/admissions/seat-matrix/${id}/`),

  // -----------------------------------------------------------------------
  // Dashboard & Statistics
  // -----------------------------------------------------------------------
  getDashboardStats: () =>
    api.get<AdmissionsDashboardStats>("/admissions/dashboard/"),
};
