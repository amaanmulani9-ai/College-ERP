import { api } from "./authService";

export interface StudentItem {
  id: string;
  student_id: string;
  enrollment_number: string;
  roll_number: string;
  profile?: any;
  program: string;
  program_name: string;
  program_code: string;
  department: string;
  department_name: string;
  current_semester: string;
  semester_name: string;
  academic_session: string;
  session_name: string;
  admission_date: string;
  expected_graduation_date: string | null;
  status: string;
  category: string;
  blood_group: string;
  nationality: string;
  father_name: string;
  father_phone: string;
  mother_name: string;
  guardian_name: string;
  guardian_phone: string;
  emergency_contact: string;
  status_history?: any[];
}

export const studentService = {
  async getStudents(params?: Record<string, any>) {
    const res = await api.get("/students/", { params });
    return res.data;
  },

  async getStudent(id: string) {
    const res = await api.get(`/students/${id}/`);
    return res.data;
  },

  async createStudent(data: Record<string, any>) {
    const res = await api.post("/students/", data);
    return res.data;
  },

  async updateStudent(id: string, data: Record<string, any>) {
    const res = await api.patch(`/students/${id}/`, data);
    return res.data;
  },

  async suspendStudent(id: string, reason?: string) {
    const res = await api.post(`/students/${id}/suspend/`, { reason });
    return res.data;
  },

  async reinstateStudent(id: string) {
    const res = await api.post(`/students/${id}/reinstate/`);
    return res.data;
  },

  async graduateStudent(id: string) {
    const res = await api.post(`/students/${id}/graduate/`);
    return res.data;
  },

  async withdrawStudent(id: string, reason?: string) {
    const res = await api.post(`/students/${id}/withdraw/`, { reason });
    return res.data;
  },

  async deleteStudent(id: string) {
    const res = await api.delete(`/students/${id}/`);
    return res.data;
  },

  async getDashboardSummary() {
    const res = await api.get("/students/dashboard-summary/");
    return res.data;
  },

  async bulkImport(formData: FormData) {
    const res = await api.post("/students/bulk-import/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },

  async bulkExport() {
    const res = await api.get("/students/bulk-export/");
    return res.data;
  },
};
