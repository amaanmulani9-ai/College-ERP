import { api } from "./authService";

export interface DesignationItem {
  id: string;
  name: string;
  code: string;
  department: string | null;
  department_name: string;
  category: string;
  is_active: boolean;
}

export interface EmployeeItem {
  id: string;
  employee_id: string;
  employee_number: string;
  profile?: any;
  department: string;
  department_name: string;
  designation: string;
  designation_name: string;
  designation_category: string;
  employment_type: string;
  joining_date: string;
  probation_end_date: string | null;
  employment_status: string;
  reporting_manager: string | null;
  reporting_manager_name: string;
  qualification: string;
  experience_years: number;
  salary_grade: string;
  office_location: string;
  work_email: string;
  extension_number: string;
  status_history?: any[];
}

export const staffService = {
  // Designations
  async getDesignations() {
    const res = await api.get("/staff/designations/");
    return res.data;
  },
  async createDesignation(data: Partial<DesignationItem>) {
    const res = await api.post("/staff/designations/", data);
    return res.data;
  },

  // Employees
  async getEmployees(params?: Record<string, any>) {
    const res = await api.get("/staff/employees/", { params });
    return res.data;
  },

  async getEmployee(id: string) {
    const res = await api.get(`/staff/employees/${id}/`);
    return res.data;
  },

  async createEmployee(data: Record<string, any>) {
    const res = await api.post("/staff/employees/", data);
    return res.data;
  },

  async updateEmployee(id: string, data: Record<string, any>) {
    const res = await api.patch(`/staff/employees/${id}/`, data);
    return res.data;
  },

  async suspendEmployee(id: string, reason?: string) {
    const res = await api.post(`/staff/employees/${id}/suspend/`, { reason });
    return res.data;
  },

  async reinstateEmployee(id: string) {
    const res = await api.post(`/staff/employees/${id}/reinstate/`);
    return res.data;
  },

  async resignEmployee(id: string, reason?: string) {
    const res = await api.post(`/staff/employees/${id}/resign/`, { reason });
    return res.data;
  },

  async retireEmployee(id: string) {
    const res = await api.post(`/staff/employees/${id}/retire/`);
    return res.data;
  },

  async terminateEmployee(id: string, reason?: string) {
    const res = await api.post(`/staff/employees/${id}/terminate/`, { reason });
    return res.data;
  },

  async getDashboardSummary() {
    const res = await api.get("/staff/dashboard-summary/");
    return res.data;
  },
};
