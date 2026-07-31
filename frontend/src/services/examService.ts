import { api } from "./authService";

export interface ExamTypeItem {
  id: string;
  name: string;
  code: string;
  category: string;
  category_display: string;
  is_internal: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ExamItem {
  id: string;
  academic_session: string;
  academic_session_detail?: any;
  program: string;
  program_detail?: any;
  semester: string;
  semester_detail?: any;
  subject: string;
  subject_detail?: any;
  exam_type: string;
  exam_type_detail?: any;
  start_date: string;
  end_date: string;
  status: string;
  status_display: string;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

export interface ExamScheduleItem {
  id: string;
  exam: string;
  exam_detail?: any;
  date: string;
  start_time: string;
  end_time: string;
  classroom: string;
  classroom_detail?: any;
  invigilator?: string;
  invigilator_detail?: any;
  capacity: number;
  is_locked: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

export interface HallTicketItem {
  id: string;
  student: string;
  student_detail?: any;
  exam: string;
  exam_detail?: any;
  hall_ticket_number: string;
  status: string;
  status_display: string;
  generated_at: string;
  is_deleted: boolean;
}

export interface ExamAttendanceItem {
  id: string;
  student: string;
  student_detail?: any;
  exam_schedule: string;
  exam_schedule_detail?: any;
  status: string;
  status_display: string;
  check_in_time?: string;
  remarks: string;
  created_at: string;
  updated_at: string;
}

export interface InvigilatorAssignmentItem {
  id: string;
  faculty: string;
  faculty_detail?: any;
  exam_schedule: string;
  exam_schedule_detail?: any;
  duty_status: string;
  duty_status_display: string;
  remarks: string;
  created_at: string;
  updated_at: string;
}

export const examService = {
  // Exam Types
  listTypes: (params?: Record<string, string>) =>
    api.get<{ results: ExamTypeItem[]; count: number }>("/examinations/types/", { params }),

  createType: (data: Record<string, unknown>) =>
    api.post<ExamTypeItem>("/examinations/types/", data),

  // Exams
  listExams: (params?: Record<string, string>) =>
    api.get<{ results: ExamItem[]; count: number }>("/examinations/exams/", { params }),

  createExam: (data: Record<string, unknown>) =>
    api.post<ExamItem>("/examinations/exams/", data),

  generateHallTicket: (studentId: string, examId: string) =>
    api.post<HallTicketItem>("/examinations/exams/generate-hall-ticket/", { student_id: studentId, exam_id: examId }),

  getStudentSchedule: (studentId: string) =>
    api.get<ExamScheduleItem[]>(`/examinations/exams/student/${studentId}/schedule/`),

  getFacultyDuties: (facultyId: string) =>
    api.get<InvigilatorAssignmentItem[]>(`/examinations/exams/faculty/${facultyId}/duties/`),

  // Exam Schedules
  listSchedules: (params?: Record<string, string>) =>
    api.get<{ results: ExamScheduleItem[]; count: number }>("/examinations/schedules/", { params }),

  createSchedule: (data: Record<string, unknown>) =>
    api.post<ExamScheduleItem>("/examinations/schedules/", data),

  // Hall Tickets
  listHallTickets: (params?: Record<string, string>) =>
    api.get<{ results: HallTicketItem[]; count: number }>("/examinations/hall-tickets/", { params }),

  // Exam Attendance
  listAttendances: (params?: Record<string, string>) =>
    api.get<{ results: ExamAttendanceItem[]; count: number }>("/examinations/attendances/", { params }),

  markAttendance: (scheduleId: string, studentId: string, status: string, remarks?: string) =>
    api.post<ExamAttendanceItem>("/examinations/attendances/mark/", {
      exam_schedule_id: scheduleId,
      student_id: studentId,
      status,
      remarks,
    }),

  // Invigilators
  listInvigilators: (params?: Record<string, string>) =>
    api.get<{ results: InvigilatorAssignmentItem[]; count: number }>("/examinations/invigilators/", { params }),

  assignInvigilator: (scheduleId: string, facultyId: string, dutyStatus?: string, remarks?: string) =>
    api.post<InvigilatorAssignmentItem>("/examinations/invigilators/", {
      exam_schedule: scheduleId,
      faculty: facultyId,
      duty_status: dutyStatus,
      remarks,
    }),
};
