import { api } from "./authService";

export interface ParentItem {
  id: string;
  parent_code: string;
  profile: {
    id: string;
    first_name: string;
    last_name: string;
    display_name: string;
    profile_photo: string | null;
    user: { email: string };
    contact?: { mobile_number: string };
  };
  relationship_type: string;
  relationship_type_display: string;
  occupation: string;
  employer_name: string;
  annual_income: string | null;
  education_level: string;
  education_level_display: string;
  is_verified: boolean;
  verified_at: string | null;
  portal_access_enabled: boolean;
  notification_enabled: boolean;
  communication_preferences: CommunicationPrefs | null;
  student_links: StudentParentLink[];
  documents: ParentDocument[];
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

export interface CommunicationPrefs {
  id: string;
  email_notifications: boolean;
  sms_notifications: boolean;
  push_notifications: boolean;
  whatsapp_notifications: boolean;
  attendance_alerts: boolean;
  fee_reminders: boolean;
  exam_results: boolean;
  general_announcements: boolean;
  disciplinary_notices: boolean;
  event_invitations: boolean;
  updated_at: string;
}

export interface StudentParentLink {
  id: string;
  student: string;
  student_id_code: string;
  student_name: string;
  parent: string;
  parent_code: string;
  is_primary_contact: boolean;
  is_emergency_contact: boolean;
  can_pickup: boolean;
  notes: string;
  created_at: string;
}

export interface ParentDocument {
  id: string;
  document_type: string;
  document_type_display: string;
  document_file: string;
  document_number: string;
  description: string;
  status: string;
  status_display: string;
  uploaded_at: string;
  expires_at: string | null;
}

export interface ParentDashboardStats {
  total_parents: number;
  verified_parents: number;
  unverified_parents: number;
  portal_access_enabled: number;
  relationship_breakdown: Array<{ relationship_type: string; count: number }>;
  pending_documents: number;
}

export const parentService = {
  // -----------------------------------------------------------------------
  // CRUD
  // -----------------------------------------------------------------------
  list: (params?: Record<string, string>) =>
    api.get<{ results: ParentItem[]; count: number }>("/parents/", { params }),

  get: (id: string) => api.get<ParentItem>(`/parents/${id}/`),

  create: (data: Record<string, unknown>) => api.post<ParentItem>("/parents/", data),

  update: (id: string, data: Record<string, unknown>) =>
    api.patch<ParentItem>(`/parents/${id}/`, data),

  delete: (id: string) => api.delete(`/parents/${id}/`),

  // -----------------------------------------------------------------------
  // Lifecycle actions
  // -----------------------------------------------------------------------
  verify: (id: string) => api.post<ParentItem>(`/parents/${id}/verify/`),

  restore: (id: string) => api.post<ParentItem>(`/parents/${id}/restore/`),

  // -----------------------------------------------------------------------
  // Student links
  // -----------------------------------------------------------------------
  linkStudent: (
    parentId: string,
    data: {
      student_id: string;
      is_primary_contact?: boolean;
      is_emergency_contact?: boolean;
      can_pickup?: boolean;
      notes?: string;
    }
  ) => api.post<StudentParentLink>(`/parents/${parentId}/link-student/`, data),

  unlinkStudent: (parentId: string, studentId: string) =>
    api.delete(`/parents/${parentId}/unlink-student/`, {
      data: { student_id: studentId },
    }),

  // -----------------------------------------------------------------------
  // Activity log
  // -----------------------------------------------------------------------
  activityLog: (parentId: string) =>
    api.get<unknown[]>(`/parents/${parentId}/activity-log/`),

  // -----------------------------------------------------------------------
  // Documents
  // -----------------------------------------------------------------------
  uploadDocument: (parentId: string, formData: FormData) =>
    api.post<ParentDocument>("/parent-documents/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  reviewDocument: (documentId: string, data: { status: string; review_notes?: string }) =>
    api.post<ParentDocument>(`/parent-documents/${documentId}/review/`, data),

  // -----------------------------------------------------------------------
  // Dashboard
  // -----------------------------------------------------------------------
  dashboard: () => api.get<ParentDashboardStats>("/parents/dashboard/"),
};
