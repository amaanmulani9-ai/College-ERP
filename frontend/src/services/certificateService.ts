import { api } from "./authService";

export interface CertificateTypeItem {
  id: string;
  name: string;
  code: string;
  template: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CertificateItem {
  id: string;
  student: string;
  student_detail?: any;
  certificate_type: string;
  certificate_type_detail?: any;
  certificate_number: string;
  academic_session?: string;
  academic_session_detail?: any;
  status: string;
  status_display: string;
  generated_at: string;
  generated_by?: string;
  metadata: Record<string, any>;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

export interface TranscriptItem {
  id: string;
  student: string;
  student_detail?: any;
  program: string;
  program_detail?: any;
  total_credits: number;
  earned_credits: number;
  sgpa: number;
  cgpa: number;
  status: string;
  status_display: string;
  generated_at: string;
  generated_by?: string;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

export interface VerificationResult {
  valid: boolean;
  certificate_number?: string;
  type?: string;
  student_name?: string;
  student_id?: string;
  program?: string;
  status?: string;
  issued_date?: string;
  message?: string;
}

export const certificateService = {
  // Certificate Types
  listTypes: (params?: Record<string, string>) =>
    api.get<{ results: CertificateTypeItem[]; count: number }>("/certificates/types/", { params }),

  createType: (data: Record<string, unknown>) =>
    api.post<CertificateTypeItem>("/certificates/types/", data),

  // Certificates
  listCertificates: (params?: Record<string, string>) =>
    api.get<{ results: CertificateItem[]; count: number }>("/certificates/issued/", { params }),

  generateCertificate: (studentId: string, certTypeId: string) =>
    api.post<CertificateItem>("/certificates/generate/", { student_id: studentId, certificate_type_id: certTypeId }),

  getStudentCertificates: (studentId: string) =>
    api.get<CertificateItem[]>(`/certificates/student/${studentId}/`),

  verifyCertificate: (certNumber: string) =>
    api.get<VerificationResult>(`/certificates/verify/${certNumber}/`),

  downloadPDF: (certId: string) =>
    api.get<any>(`/certificates/download/${certId}/`),

  // Transcripts
  listTranscripts: (params?: Record<string, string>) =>
    api.get<{ results: TranscriptItem[]; count: number }>("/certificates/transcripts/", { params }),

  generateTranscript: (studentId: string) =>
    api.post<TranscriptItem>("/certificates/transcript/generate/", { student_id: studentId }),
};
