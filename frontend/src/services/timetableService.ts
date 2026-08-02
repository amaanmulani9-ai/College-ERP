import { api } from "./authService";

export interface BuildingItem {
  id: string;
  name: string;
  code: string;
  address: string;
  is_active: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

export interface ClassroomItem {
  id: string;
  building: string;
  building_name: string;
  building_code: string;
  room_number: string;
  capacity: number;
  floor: number;
  room_type: string;
  room_type_display: string;
  is_active: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

export interface TimeSlotItem {
  id: string;
  day: string;
  start_time: string;
  end_time: string;
  period_number: number;
  break_after: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface TimetableEntryItem {
  id: string;
  academic_session: string;
  academic_session_detail?: any;
  program: string;
  program_detail?: any;
  semester: string;
  semester_detail?: any;
  subject: string;
  subject_detail?: any;
  faculty: string;
  faculty_detail?: any;
  classroom: string;
  classroom_detail?: any;
  time_slot: string;
  time_slot_detail?: any;
  batch: string;
  effective_from: string;
  effective_to?: string;
  status: string;
  status_display: string;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

export interface ConflictCheckPayload {
  time_slot: string;
  classroom: string;
  faculty: string;
  program: string;
  semester: string;
  batch?: string;
  exclude_id?: string;
}

export interface ConflictCheckResult {
  has_conflicts: boolean;
  conflicts: Array<{ type: string; message: string; conflicting_entry_id?: string }>;
}

export const timetableService = {
  // Buildings
  listBuildings: (params?: Record<string, string>) =>
    api.get<{ results: BuildingItem[]; count: number }>("/timetable/buildings/", { params }),

  createBuilding: (data: Record<string, unknown>) =>
    api.post<BuildingItem>("/timetable/buildings/", data),

  deleteBuilding: (id: string) =>
    api.delete(`/timetable/buildings/${id}/`),

  // Classrooms
  listClassrooms: (params?: Record<string, string>) =>
    api.get<{ results: ClassroomItem[]; count: number }>("/timetable/classrooms/", { params }),

  createClassroom: (data: Record<string, unknown>) =>
    api.post<ClassroomItem>("/timetable/classrooms/", data),

  deleteClassroom: (id: string) =>
    api.delete(`/timetable/classrooms/${id}/`),

  // TimeSlots
  listTimeSlots: (params?: Record<string, string>) =>
    api.get<{ results: TimeSlotItem[]; count: number }>("/timetable/timeslots/", { params }),

  createTimeSlot: (data: Record<string, unknown>) =>
    api.post<TimeSlotItem>("/timetable/timeslots/", data),

  deleteTimeSlot: (id: string) =>
    api.delete(`/timetable/timeslots/${id}/`),

  // Timetable Entries
  listEntries: (params?: Record<string, string>) =>
    api.get<{ results: TimetableEntryItem[]; count: number }>("/timetable/entries/", { params }),

  createEntry: (data: Record<string, unknown>) =>
    api.post<TimetableEntryItem>("/timetable/entries/", data),

  updateEntry: (id: string, data: Record<string, unknown>) =>
    api.patch<TimetableEntryItem>(`/timetable/entries/${id}/`, data),

  deleteEntry: (id: string) =>
    api.delete(`/timetable/entries/${id}/`),

  // Conflict Engine
  checkConflicts: (payload: ConflictCheckPayload) =>
    api.post<ConflictCheckResult>("/timetable/entries/check-conflicts/", payload),

  // Schedules
  getFacultySchedule: (facultyId: string) =>
    api.get<TimetableEntryItem[]>(`/timetable/entries/faculty/${facultyId}/`),

  getStudentSchedule: (params: { program?: string; semester?: string; batch?: string }) =>
    api.get<TimetableEntryItem[]>("/timetable/entries/student/", { params }),

  getRoomSchedule: (classroomId: string) =>
    api.get<TimetableEntryItem[]>(`/timetable/entries/room/${classroomId}/`),

  getWeeklySchedule: (sessionId?: string) =>
    api.get<TimetableEntryItem[]>("/timetable/entries/weekly/", { params: { session: sessionId } }),
};
