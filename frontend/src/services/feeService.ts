import axios from './api';

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

const feeService = {
  // Categories
  getCategories: () => axios.get<{ results: FeeCategory[] }>('/fees/categories/').then(r => r.data),
  createCategory: (data: Partial<FeeCategory>) => axios.post<FeeCategory>('/fees/categories/', data).then(r => r.data),

  // Structures
  getStructures: (params?: Record<string, string>) =>
    axios.get<{ results: FeeStructure[] }>('/fees/structures/', { params }).then(r => r.data),
  createStructure: (data: Partial<FeeStructure>) => axios.post<FeeStructure>('/fees/structures/', data).then(r => r.data),

  // Student Fees
  getStudentFees: (params?: Record<string, string>) =>
    axios.get<{ results: StudentFee[] }>('/fees/student-fees/', { params }).then(r => r.data),
  assignFee: (payload: AssignFeePayload) =>
    axios.post<StudentFee>('/fees/assign/', payload).then(r => r.data),
  getStudentSummary: (studentId: string) =>
    axios.get<any>(`/fees/student/${studentId}/`).then(r => r.data),
  getOutstandingReport: () =>
    axios.get<StudentFee[]>('/fees/outstanding/').then(r => r.data),

  // Installments
  getInstallments: (studentFeeId?: string) =>
    axios.get<{ results: FeeInstallment[] }>('/fees/installments/', {
      params: studentFeeId ? { student_fee: studentFeeId } : {}
    }).then(r => r.data),

  // Receipts
  getReceipts: (params?: Record<string, string>) =>
    axios.get<{ results: FeeReceipt[] }>('/fees/receipts/', { params }).then(r => r.data),
  collectFee: (payload: CollectFeePayload) =>
    axios.post<FeeReceipt>('/fees/pay/', payload).then(r => r.data),
  getReceipt: (receiptId: string) =>
    axios.get<FeeReceipt>(`/fees/receipt/${receiptId}/`).then(r => r.data),
};

export default feeService;
