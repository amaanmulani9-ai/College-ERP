import React, { useEffect, useState } from 'react';
import paymentService, { PaymentTransaction } from '../services/paymentService';

const statusColors: Record<string, string> = {
  success: '#10b981',
  initiated: '#f59e0b',
  failed: '#ef4444',
  refunded: '#8b5cf6',
  partial_refund: '#ec4899',
};

export const PaymentHistoryPage: React.FC = () => {
  const [studentId, setStudentId] = useState('');
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const fetchHistory = async (idToUse?: string) => {
    const target = idToUse || studentId;
    if (!target.trim()) return;
    setLoading(true);
    try {
      const data = await paymentService.getPaymentHistory(target.trim());
      setTransactions(data);
      setSearched(true);
    } catch (err) {
      console.error(err);
      setTransactions([]);
      setSearched(true);
    } finally {
      setLoading(false);
    }
  };

  const fmt = (n: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

  return (
    <div style={{ padding: '32px', background: '#0f172a', minHeight: '100vh', color: '#f8fafc' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, margin: 0 }}>📜 Payment History</h1>
        <p style={{ color: '#94a3b8', marginTop: '8px' }}>
          View transaction logs, status, and fee receipts for any student
        </p>
      </div>

      {/* Filter / Search Bar */}
      <div style={{ background: '#1e293b', borderRadius: '16px', border: '1px solid #334155', padding: '24px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '12px' }}>
          <input
            id="history-student-search"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            placeholder="Enter Student ID or UUID to search history..."
            style={{
              flex: 1,
              background: '#0f172a',
              border: '1px solid #334155',
              borderRadius: '10px',
              padding: '12px 16px',
              color: '#f8fafc',
            }}
            onKeyDown={(e) => e.key === 'Enter' && fetchHistory()}
          />
          <button
            id="btn-search-history"
            onClick={() => fetchHistory()}
            disabled={loading}
            style={{
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              color: '#fff',
              border: 'none',
              borderRadius: '10px',
              padding: '12px 24px',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            {loading ? 'Searching...' : 'Fetch History'}
          </button>
        </div>
      </div>

      {/* Transaction List */}
      <div style={{ background: '#1e293b', borderRadius: '16px', border: '1px solid #334155', overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #334155' }}>
          <h2 style={{ margin: 0, fontSize: '1.125rem', color: '#f8fafc' }}>
            {searched ? `Transaction History for Student: ${studentId}` : 'Search student to view history'}
          </h2>
        </div>

        {loading ? (
          <div style={{ padding: '48px', textAlign: 'center', color: '#94a3b8' }}>Loading history...</div>
        ) : !searched ? (
          <div style={{ padding: '48px', textAlign: 'center', color: '#64748b' }}>Enter student ID above and click Fetch History.</div>
        ) : transactions.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center', color: '#94a3b8' }}>No payment records found for this student.</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#0f172a' }}>
                  {['Txn ID', 'Order ID', 'Gateway', 'Amount', 'Status', 'Receipt', 'Paid At'].map((h) => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {transactions.map((t) => (
                  <tr key={t.id} style={{ borderTop: '1px solid #334155' }}>
                    <td style={{ padding: '14px 16px', color: '#f8fafc', fontWeight: 600, fontFamily: 'monospace' }}>
                      {t.transaction_id}
                    </td>
                    <td style={{ padding: '14px 16px', color: '#94a3b8', fontFamily: 'monospace', fontSize: '0.875rem' }}>
                      {t.gateway_order_id}
                    </td>
                    <td style={{ padding: '14px 16px', color: '#cbd5e1' }}>{t.gateway_name}</td>
                    <td style={{ padding: '14px 16px', color: '#10b981', fontWeight: 700 }}>{fmt(t.amount)}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <span
                        style={{
                          background: `${statusColors[t.status] || '#6b7280'}22`,
                          color: statusColors[t.status] || '#6b7280',
                          padding: '4px 10px',
                          borderRadius: '999px',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          textTransform: 'capitalize',
                        }}
                      >
                        {t.status_display}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', color: '#3b82f6', fontWeight: 500, fontSize: '0.875rem' }}>
                      {t.receipt_number || '—'}
                    </td>
                    <td style={{ padding: '14px 16px', color: '#94a3b8', fontSize: '0.875rem' }}>
                      {t.paid_at ? new Date(t.paid_at).toLocaleString() : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentHistoryPage;
