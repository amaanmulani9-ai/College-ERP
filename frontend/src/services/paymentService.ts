import axios from 'axios';

export interface PaymentGateway {
  id: string;
  name: string;
  provider: 'razorpay' | 'stripe' | 'phonepe' | 'upi' | 'manual';
  provider_display: string;
  is_active: boolean;
}

export interface PaymentOrder {
  id: string;
  student: string;
  student_fee: string;
  gateway: string;
  gateway_name: string;
  order_id: string;
  amount: number;
  currency: string;
  status: 'created' | 'attempted' | 'paid' | 'expired' | 'cancelled';
  status_display: string;
  created_at: string;
}

export interface PaymentTransaction {
  id: string;
  student: string;
  order: string;
  fee_receipt?: string;
  gateway: string;
  gateway_name: string;
  transaction_id: string;
  gateway_order_id: string;
  gateway_payment_id: string;
  amount: number;
  currency: string;
  status: 'initiated' | 'success' | 'failed' | 'refunded' | 'partial_refund';
  status_display: string;
  failure_reason?: string;
  paid_at?: string;
  receipt_number?: string;
  created_at: string;
}

export interface Refund {
  id: string;
  transaction: string;
  refund_id: string;
  amount: number;
  reason: string;
  status: 'requested' | 'processing' | 'success' | 'failed';
  status_display: string;
  initiated_by_email?: string;
  processed_at?: string;
  created_at: string;
}

const API_URL = '/api/payments';

export const paymentService = {
  getGateways: async (): Promise<PaymentGateway[]> => {
    const response = await axios.get(`${API_URL}/gateways/`);
    return response.data.results || response.data;
  },

  createOrder: async (payload: {
    student_id: string;
    student_fee_id: string;
    gateway_id: string;
    amount: number;
    currency?: string;
  }): Promise<PaymentOrder> => {
    const response = await axios.post(`${API_URL}/orders/create-order/`, payload);
    return response.data;
  },

  verifyPayment: async (payload: {
    order_id: string;
    gateway_payment_id: string;
    gateway_signature: string;
  }): Promise<PaymentTransaction> => {
    const response = await axios.post(`${API_URL}/transactions/verify/`, payload);
    return response.data;
  },

  getPaymentHistory: async (student_id: string): Promise<PaymentTransaction[]> => {
    const response = await axios.get(`${API_URL}/transactions/history/`, {
      params: { student_id },
    });
    return response.data;
  },

  getTransactions: async (): Promise<PaymentTransaction[]> => {
    const response = await axios.get(`${API_URL}/transactions/`);
    return response.data.results || response.data;
  },

  getTransactionDetails: async (id: string): Promise<PaymentTransaction> => {
    const response = await axios.get(`${API_URL}/transactions/${id}/`);
    return response.data;
  },

  createRefund: async (payload: {
    transaction_id: string;
    amount: number;
    reason: string;
  }): Promise<Refund> => {
    const response = await axios.post(`${API_URL}/refunds/create/`, payload);
    return response.data;
  },

  getRefunds: async (): Promise<Refund[]> => {
    const response = await axios.get(`${API_URL}/refunds/`);
    return response.data.results || response.data;
  },
};

export default paymentService;
