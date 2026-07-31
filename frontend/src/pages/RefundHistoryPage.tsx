import React, { useEffect, useState } from 'react';
import paymentService, { Refund } from '../services/paymentService';

const statusColors: Record<string, string> = {
  success: '#10b981',
  processing: '#f59e0b',
  requested: '#3b82f6',
  failed: '#ef4444',
};

export const RefundHistoryPage: React.FC = () => {
  const [refunds, setRefunds] = useState<Refund[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await paymentService.getRefunds();
        setRefunds(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const totalRefunded = refunds
    .filter((r) => r.status === 'success')
    .reduce((sum, r) => sum + Number(r.amount), 0);

  const fmt = (n: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

  return (
    <div style={{ padding: '32px', background: '#0f172a', minHeight: '100vh', color: '#f8fafc' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, margin: 0 }}>↩️ Refund History</h1>
        <p style={{ color: '#94a3b8', marginTop: '8px' }}>
          Complete record of gateway refunds, initiated by staff, reasons, and settlement statuses
        </p>
      </div>

      {/* Summary KPI */}
      <div style={{ background: '#1e293b', borderRadius: '16px', border: '1px solid #334155', padding: '20px 24px', marginBottom: '24px', display: 'flex', gap: '32px' }}>
        <div>
          <div style={{ color: '#94a3b8', fontSize: '0.75rem' }}>Total Refund Amount</div>
          <div style={{ color: '#8b5cf6', fontSize: '1.5rem', fontWeight: 700 }}>{fmt(totalRefunded)}</div>
        </div>
        <div>
          <div style={{ color: '#94a3b8', fontSize: '0.75rem' }}>Total Refund Requests</div>
          <div style={{ color: '#f8fafc', fontSize: '1.5rem', fontWeight: 700 }}>{refunds.length}</div>
        </div>
      </div>

      {/* Table */}
      <div style={{ background: '#1e293b', borderRadius: '16px', border: '1px solid #334155', overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #334155' }}>
          <h2 style={{ margin: 0, fontSize: '1.125rem', color: '#f8fafc' }}>Refund Records</h2>
        </div>
        {loading ? (
          <div style={{ padding: '48px', textAlign: 'center', color: '#94a3b8' }}>Loading refunds...</div>
        ) : refunds.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center', color: '#94a3b8' }}>No refund records found.</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#0f172a' }}>
                  {['Refund ID', 'Transaction', 'Amount', 'Reason', 'Initiated By', 'Status', 'Date'].map((h) => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {refunds.map((r) => (
                  <tr key={r.id} style={{ borderTop: '1px solid #334155' }}>
                    <td style={{ padding: '14px 16px', color: '#8b5cf6', fontWeight: 600, fontFamily: 'monospace' }}>
                      {r.refund_id || r.id.substring(0, 8)}
                    </td>
                    <td style={{ padding: '14px 16px', color: '#cbd5e1', fontFamily: 'monospace', fontSize: '0.875rem' }}>
                      {r.transaction}
                    </td>
                    <td style={{ padding: '14px 16px', color: '#f8fafc', fontWeight: 700 }}>{fmt(r.amount)}</td>
                    <td style={{ padding: '14px 16px', color: '#94a3b8', fontSize: '0.875rem' }}>{r.reason}</td>
                    <td style={{ padding: '14px 16px', color: '#cbd5e1', fontSize: '0.875rem' }}>{r.initiated_by_email || 'System'}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <span
                        style={{
                          background: `${statusColors[r.status] || '#6b7280'}22`,
                          color: statusColors[r.status] || '#6b7280',
                          padding: '4px 10px',
                          borderRadius: '999px',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          textTransform: 'capitalize',
                        }}
                      >
                        {r.status_display}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', color: '#94a3b8', fontSize: '0.875rem' }}>
                      {new Date(r.created_at).toLocaleDateString()}
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

export default RefundHistoryPage;
