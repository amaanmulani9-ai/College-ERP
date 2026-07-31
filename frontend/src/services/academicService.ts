import { api } from "./authService";

export interface FacultyItem {
  id: string;
  name: string;
  code: string;
  description: string;
  departments_count: number;
  is_active: boolean;
  display_order: number;
}

export interface DepartmentItem {
  id: string;
  faculty: string;
  faculty_name: string;
  name: string;
  code: string;
  email: string;
  phone: string;
  programs_count: number;
  is_active: boolean;
}

export interface ProgramItem {
  id: string;
  department: string;
  department_name: string;
  name: string;
  code: string;
  degree_level: string;
  duration_years: number;
  total_credits: number;
  is_active: boolean;
}

export interface SessionItem {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
  is_current: boolean;
}

export interface SemesterItem {
  id: string;
  program: string;
  program_name: string;
  semester_number: number;
  name: string;
  credits: number;
  is_active: boolean;
}

export interface SubjectItem {
  id: string;
  code: string;
  name: string;
  semester: string;
  semester_name: string;
  credits: number;
  theory_hours: number;
  practical_hours: number;
  internal_marks: number;
  external_marks: number;
  passing_marks: number;
  is_elective: boolean;
  is_active: boolean;
}

export interface OfferingItem {
  id: string;
  subject: string;
  subject_code: string;
  subject_name: string;
  session: string;
  session_name: string;
  department: string;
  department_name: string;
  capacity: number;
  status: string;
}

export const academicService = {
  // Faculties
  async getFaculties() {
    const res = await api.get("/academics/faculties/");
    return res.data;
  },
  async createFaculty(data: Partial<FacultyItem>) {
    const res = await api.post("/academics/faculties/", data);
    return res.data;
  },
  async deleteFaculty(id: string) {
    const res = await api.delete(`/academics/faculties/${id}/`);
    return res.data;
  },

  // Departments
  async getDepartments() {
    const res = await api.get("/academics/departments/");
    return res.data;
  },
  async createDepartment(data: Partial<DepartmentItem>) {
    const res = await api.post("/academics/departments/", data);
    return res.data;
  },
  async deleteDepartment(id: string) {
    const res = await api.delete(`/academics/departments/${id}/`);
    return res.data;
  },

  // Programs
  async getPrograms() {
    const res = await api.get("/academics/programs/");
    return res.data;
  },
  async createProgram(data: Partial<ProgramItem>) {
    const res = await api.post("/academics/programs/", data);
    return res.data;
  },

  // Academic Sessions
  async getSessions() {
    const res = await api.get("/academics/sessions/");
    return res.data;
  },
  async createSession(data: Partial<SessionItem>) {
    const res = await api.post("/academics/sessions/", data);
    return res.data;
  },
  async setCurrentSession(id: string) {
    const res = await api.post(`/academics/sessions/${id}/set-current/`);
    return res.data;
  },

  // Semesters
  async getSemesters() {
    const res = await api.get("/academics/semesters/");
    return res.data;
  },
  async createSemester(data: Partial<SemesterItem>) {
    const res = await api.post("/academics/semesters/", data);
    return res.data;
  },

  // Subjects
  async getSubjects() {
    const res = await api.get("/academics/subjects/");
    return res.data;
  },
  async createSubject(data: Partial<SubjectItem>) {
    const res = await api.post("/academics/subjects/", data);
    return res.data;
  },

  // Offerings
  async getOfferings() {
    const res = await api.get("/academics/offerings/");
    return res.data;
  },
  async createOffering(data: Partial<OfferingItem>) {
    const res = await api.post("/academics/offerings/", data);
    return res.data;
  },
};
