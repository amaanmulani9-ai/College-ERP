import axios from 'axios';

export interface FeeCategory {
  id: string;
  name: string;
  code: string;
  is_active: boolean;
}

export interface FeeStructure {
  id: string;
  academic_session: string;
  program: string;
  semester: string;
  category: string;
  amount: number;
  is_active: boolean;
  category_detail?: FeeCategory;
}

export interface FeeInstallment {
  id: string;
  student_fee: string;
  installment_no: number;
  amount: number;
  due_date: string;
  fine_amount: number;
  status: 'pending' | 'paid' | 'overdue';
  status_display: string;
}

export interface StudentFee {
  id: string;
  student: string;
  student_detail?: any;
  fee_structure: string;
  fee_structure_detail?: FeeStructure;
  installments: FeeInstallment[];
  total_amount: number;
  waiver_amount: number;
  scholarship_amount: number;
  paid_amount: number;
  due_amount: number;
  status: 'pending' | 'partial' | 'paid' | 'overdue' | 'waived';
  status_display: string;
}

export interface FeeReceipt {
  id: string;
  receipt_number: string;
  student: string;
  student_detail?: any;
  student_fee: string;
  installment?: string;
  payment_date: string;
  amount: number;
  payment_mode: string;
  payment_mode_display: string;
  status: string;
  remarks: string;
}

export interface AssignFeePayload {
  student_id: string;
  fee_structure_id: string;
  waiver_amount?: number;
  scholarship_amount?: number;
  num_installments?: number;
}

export interface CollectFeePayload {
  student_fee_id: string;
  amount: number;
  payment_mode: string;
  installment_id?: string;
  remarks?: string;
}

const API_URL = '/api/fees';

export const feeService = {
  // Categories
  getCategories: () => axios.get<{ results: FeeCategory[] }>(`${API_URL}/categories/`).then((r: any) => r.data.results || r.data),
  createCategory: (data: Partial<FeeCategory>) => axios.post<FeeCategory>(`${API_URL}/categories/`, data).then((r: any) => r.data),

  // Structures
  getStructures: (params?: Record<string, string>) =>
    axios.get<{ results: FeeStructure[] }>(`${API_URL}/structures/`, { params }).then((r: any) => r.data.results || r.data),
  createStructure: (data: Partial<FeeStructure>) => axios.post<FeeStructure>(`${API_URL}/structures/`, data).then((r: any) => r.data),

  // Student Fees
  getStudentFees: (params?: Record<string, string>) =>
    axios.get<{ results: StudentFee[] }>(`${API_URL}/student-fees/`, { params }).then((r: any) => r.data.results || r.data),
  assignFee: (payload: AssignFeePayload) =>
    axios.post<StudentFee>(`${API_URL}/assign/`, payload).then((r: any) => r.data),
  getStudentSummary: (studentId: string) =>
    axios.get<any>(`${API_URL}/student/${studentId}/`).then((r: any) => r.data),
  getOutstandingReport: () =>
    axios.get<StudentFee[]>(`${API_URL}/outstanding/`).then((r: any) => r.data.results || r.data),

  // Installments
  getInstallments: (studentFeeId?: string) =>
    axios.get<{ results: FeeInstallment[] }>(`${API_URL}/installments/`, {
      params: studentFeeId ? { student_fee: studentFeeId } : {}
    }).then((r: any) => r.data.results || r.data),

  // Receipts
  getReceipts: (params?: Record<string, string>) =>
    axios.get<{ results: FeeReceipt[] }>(`${API_URL}/receipts/`, { params }).then((r: any) => r.data.results || r.data),
  collectFee: (payload: CollectFeePayload) =>
    axios.post<FeeReceipt>(`${API_URL}/pay/`, payload).then((r: any) => r.data),
  getReceipt: (receiptId: string) =>
    axios.get<FeeReceipt>(`${API_URL}/receipt/${receiptId}/`).then((r: any) => r.data),
};

export default feeService;
