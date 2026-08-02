import { api } from "./authService";

export interface AttendanceSessionItem {
  id: string;
  timetable?: string;
  timetable_detail?: any;
  subject: string;
  subject_detail?: any;
  faculty: string;
  faculty_detail?: any;
  classroom?: string;
  classroom_detail?: any;
  date: string;
  start_time: string;
  end_time: string;
  status: string;
  status_display: string;
  qr_token: string;
  is_locked: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

export interface StudentAttendanceItem {
  id: string;
  session: string;
  session_detail?: any;
  student: string;
  student_detail?: any;
  status: string;
  status_display: string;
  check_in_time?: string;
  check_out_time?: string;
  remarks: string;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

export interface FacultyAttendanceItem {
  id: string;
  faculty: string;
  faculty_detail?: any;
  date: string;
  check_in?: string;
  check_out?: string;
  status: string;
  status_display: string;
  remarks: string;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

export const attendanceService = {
  // Sessions
  listSessions: (params?: Record<string, string>) =>
    api.get<{ results: AttendanceSessionItem[]; count: number }>("/attendance/sessions/", { params }),

  createSession: (data: Record<string, unknown>) =>
    api.post<AttendanceSessionItem>("/attendance/sessions/", data),

  markSingle: (sessionId: string, studentId: string, status: string, remarks?: string) =>
    api.post<StudentAttendanceItem>(`/attendance/sessions/${sessionId}/mark/`, { student_id: studentId, status, remarks }),

  bulkMark: (sessionId: string, records: Array<{ student_id: string; status: string; remarks?: string }>) =>
    api.post<StudentAttendanceItem[]>("/attendance/sessions/bulk/", { session_id: sessionId, records }),

  lockSession: (sessionId: string) =>
    api.post<AttendanceSessionItem>(`/attendance/sessions/${sessionId}/lock/`),

  // Student Attendance
  getStudentHistory: (studentId: string, subjectId?: string) =>
    api.get<StudentAttendanceItem[]>(`/attendance/students/student/${studentId}/`, { params: { subject: subjectId } }),

  getStudentPercentage: (studentId: string, subjectId?: string) =>
    api.get<{ total_sessions: number; present_count: number; percentage: number }>("/attendance/students/percentage/", {
      params: { student: studentId, subject: subjectId },
    }),

  // Faculty Attendance
  markFaculty: (data: { faculty_id: string; date?: string; status: string; check_in?: string; check_out?: string; remarks?: string }) =>
    api.post<FacultyAttendanceItem>("/attendance/faculty/mark/", data),

  getFacultyHistory: (facultyId: string) =>
    api.get<FacultyAttendanceItem[]>(`/attendance/faculty/faculty/${facultyId}/`),

  // Reports
  getDailyReport: (date?: string) =>
    api.get<{ date: string; total_sessions: number; total_student_records: number; present_students: number; absent_students: number; faculty_records_count: number }>(
      "/attendance/reports/daily/",
      { params: { date } }
    ),

  getMonthlyReport: (year?: number, month?: number, subjectId?: string) =>
    api.get<{ year: number; month: number; total_sessions: number; total_records: number; present_records: number; absent_records: number; excused_records: number; average_percentage: number }>(
      "/attendance/reports/monthly/",
      { params: { year, month, subject: subjectId } }
    ),
};
