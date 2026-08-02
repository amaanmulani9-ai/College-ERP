import { api } from "./authService";

export interface ResultSchemeItem {
  id: string;
  program: string;
  program_detail?: any;
  semester: string;
  semester_detail?: any;
  subject: string;
  subject_detail?: any;
  max_internal: number;
  max_external: number;
  max_practical: number;
  max_viva: number;
  max_assignment: number;
  passing_marks: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface StudentResultItem {
  id: string;
  student: string;
  student_detail?: any;
  subject: string;
  subject_detail?: any;
  exam?: string;
  exam_detail?: any;
  internal_marks: number;
  external_marks: number;
  practical_marks: number;
  viva_marks: number;
  assignment_marks: number;
  grace_marks: number;
  total_marks: number;
  grade: string;
  grade_point: number;
  credit_point: number;
  status: string;
  status_display: string;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

export interface SemesterResultItem {
  id: string;
  student: string;
  student_detail?: any;
  semester: string;
  semester_detail?: any;
  sgpa: number;
  cgpa: number;
  credits_earned: number;
  total_credits: number;
  rank?: number;
  result_status: string;
  result_status_display: string;
  is_published: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

export interface TranscriptPreviewData {
  student_id: string;
  cgpa: number;
  semester_results: SemesterResultItem[];
  subject_results: StudentResultItem[];
}

export const resultService = {
  // Result Schemes
  listSchemes: (params?: Record<string, string>) =>
    api.get<{ results: ResultSchemeItem[]; count: number }>("/results/schemes/", { params }),

  createScheme: (data: Record<string, unknown>) =>
    api.post<ResultSchemeItem>("/results/schemes/", data),

  // Student Results & Marks Entry
  listStudentResults: (params?: Record<string, string>) =>
    api.get<{ results: StudentResultItem[]; count: number }>("/results/student-results/", { params }),

  enterMarks: (data: {
    student: string;
    subject: string;
    exam?: string;
    internal_marks?: number;
    external_marks?: number;
    practical_marks?: number;
    viva_marks?: number;
    assignment_marks?: number;
    grace_marks?: number;
  }) => api.post<StudentResultItem>("/results/student-results/", data),

  calculateSGPA: (studentId: string, semesterId: string) =>
    api.post<SemesterResultItem>("/results/calculate/", { student: studentId, semester: semesterId }),

  getStudentHistory: (studentId: string) =>
    api.get<StudentResultItem[]>(`/results/student/${studentId}/`),

  getTranscriptPreview: (studentId: string) =>
    api.get<TranscriptPreviewData>("/results/transcript-preview/", { params: { student: studentId } }),

  // Semester Results & Publishing
  listSemesterResults: (params?: Record<string, string>) =>
    api.get<{ results: SemesterResultItem[]; count: number }>("/results/semester-results/", { params }),

  publishSemester: (semesterId: string) =>
    api.post<{ published_count: number; message: string }>("/results/publish/", { semester_id: semesterId }),

  generateRanks: (semesterId: string) =>
    api.post<SemesterResultItem[]>("/results/semester-results/rank/", { semester_id: semesterId }),

  getSemesterSummary: (semesterId: string) =>
    api.get<SemesterResultItem[]>(`/results/semester/${semesterId}/`),
};
