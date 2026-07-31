import axios from 'axios';

export interface ScholarshipType {
  id: string;
  name: string;
  code: string;
  provider: 'government' | 'private' | 'merit' | 'sports' | 'minority' | 'need_based' | 'fee_waiver';
  provider_display: string;
  description?: string;
  min_cgpa_requirement: number;
  max_family_income?: number;
  is_active: boolean;
}

export interface Scholarship {
  id: string;
  student: string;
  scholarship_type: string;
  scholarship_type_name: string;
  academic_session: string;
  academic_session_name: string;
  amount: number;
  percentage: number;
  start_date: string;
  end_date: string;
  status: 'active' | 'suspended' | 'expired' | 'revoked';
  status_display: string;
}

export interface ScholarshipApplication {
  id: string;
  student: string;
  scholarship_type: string;
  scholarship_type_name: string;
  scholarship_type_code: string;
  academic_session: string;
  academic_session_name: string;
  requested_amount: number;
  family_annual_income?: number;
  current_cgpa: number;
  documents?: Record<string, any>;
  statement_of_purpose?: string;
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected';
  status_display: string;
  rejection_reason?: string;
  approved_by_email?: string;
  approved_at?: string;
  created_at: string;
}

export interface ScholarshipRenewal {
  id: string;
  scholarship: string;
  scholarship_name: string;
  academic_session: string;
  academic_session_name: string;
  status: 'requested' | 'approved' | 'rejected';
  status_display: string;
  remarks?: string;
  processed_at?: string;
  created_at: string;
}

const API_URL = '/api/scholarships';

export const scholarshipService = {
  getTypes: async (): Promise<ScholarshipType[]> => {
    const res = await axios.get(`${API_URL}/types/`);
    return res.data.results || res.data;
  },

  createType: async (payload: Partial<ScholarshipType>): Promise<ScholarshipType> => {
    const res = await axios.post(`${API_URL}/types/`, payload);
    return res.data;
  },

  getApplications: async (): Promise<ScholarshipApplication[]> => {
    const res = await axios.get(`${API_URL}/applications/`);
    return res.data.results || res.data;
  },

  apply: async (payload: {
    student_id: string;
    scholarship_type_id: string;
    academic_session_id: string;
    requested_amount: number;
    family_annual_income?: number;
    current_cgpa?: number;
    statement_of_purpose?: string;
  }): Promise<ScholarshipApplication> => {
    const res = await axios.post(`${API_URL}/apply/`, payload);
    return res.data;
  },

  approve: async (application_id: string, approved_amount?: number, percentage?: number): Promise<Scholarship> => {
    const res = await axios.post(`${API_URL}/approve/`, { application_id, approved_amount, percentage });
    return res.data;
  },

  reject: async (application_id: string, reason: string): Promise<ScholarshipApplication> => {
    const res = await axios.post(`${API_URL}/reject/`, { application_id, reason });
    return res.data;
  },

  getScholarships: async (): Promise<Scholarship[]> => {
    const res = await axios.get(`${API_URL}/scholarships/`);
    return res.data.results || res.data;
  },

  getStudentScholarships: async (student_id: string): Promise<Scholarship[]> => {
    const res = await axios.get(`${API_URL}/student/${student_id}/`);
    return res.data;
  },

  getRenewals: async (): Promise<ScholarshipRenewal[]> => {
    const res = await axios.get(`${API_URL}/renewals/`);
    return res.data.results || res.data;
  },

  renew: async (scholarship_id: string, new_academic_session_id: string, remarks?: string): Promise<ScholarshipRenewal> => {
    const res = await axios.post(`${API_URL}/renew/`, { scholarship_id, new_academic_session_id, remarks });
    return res.data;
  },
};

export default scholarshipService;
