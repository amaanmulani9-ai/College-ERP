import React, { useEffect, useState } from 'react';
import feeService, { StudentFee } from '../services/feeService';

const statusColor: Record<string, string> = {
  pending: '#f59e0b',
  partial: '#3b82f6',
  paid: '#10b981',
  overdue: '#ef4444',
  waived: '#8b5cf6',
};

const FeeDashboardPage: React.FC = () => {
  const [outstanding, setOutstanding] = useState<StudentFee[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalDue: 0,
    totalPaid: 0,
    overdue: 0,
  });

  useEffect(() => {
    (async () => {
      try {
        const data = await feeService.getOutstandingReport();
        const fees = Array.isArray(data) ? data : [];
        setOutstanding(fees);
        setStats({
          totalStudents: new Set(fees.map((f) => f.student)).size,
          totalDue: fees.reduce((s, f) => s + f.due_amount, 0),
          totalPaid: fees.reduce((s, f) => s + f.paid_amount, 0),
          overdue: fees.filter((f) => f.status === 'overdue').length,
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const fmt = (n: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

  const statCards = [
    { label: 'Students with Dues', value: stats.totalStudents, icon: '👥', color: '#6366f1' },
    { label: 'Total Due', value: fmt(stats.totalDue), icon: '₹', color: '#f59e0b' },
    { label: 'Total Collected', value: fmt(stats.totalPaid), icon: '💰', color: '#10b981' },
    { label: 'Overdue Accounts', value: stats.overdue, icon: '⚠️', color: '#ef4444' },
  ];

  return (
    <div style={{ padding: '32px', background: '#0f172a', minHeight: '100vh', color: '#f8fafc' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#f8fafc', margin: 0 }}>
          💳 Fee Management
        </h1>
        <p style={{ color: '#94a3b8', marginTop: '8px' }}>
          Fee collection, installments & outstanding reports
        </p>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        {statCards.map((c) => (
          <div
            key={c.label}
            style={{
              background: 'linear-gradient(135deg, #1e293b, #0f172a)',
              borderRadius: '16px',
              padding: '24px',
              border: `1px solid ${c.color}33`,
              boxShadow: `0 0 20px ${c.color}22`,
            }}
          >
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>{c.icon}</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 700, color: c.color }}>{c.value}</div>
            <div style={{ color: '#94a3b8', fontSize: '0.875rem', marginTop: '4px' }}>{c.label}</div>
          </div>
        ))}
      </div>

      {/* Outstanding Table */}
      <div
        style={{
          background: '#1e293b',
          borderRadius: '16px',
          border: '1px solid #334155',
          overflow: 'hidden',
        }}
      >
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #334155' }}>
          <h2 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 600, color: '#f8fafc' }}>
            Outstanding Fees
          </h2>
        </div>

        {loading ? (
          <div style={{ padding: '48px', textAlign: 'center', color: '#94a3b8' }}>
            Loading outstanding fees...
          </div>
        ) : outstanding.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center', color: '#94a3b8' }}>
            🎉 No outstanding fees!
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#0f172a' }}>
                  {['Student', 'Fee Category', 'Total', 'Paid', 'Due', 'Status'].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: '12px 16px',
                        textAlign: 'left',
                        color: '#94a3b8',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {outstanding.map((f) => (
                  <tr
                    key={f.id}
                    style={{ borderTop: '1px solid #334155' }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLTableRowElement).style.background = '#0f172a')}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLTableRowElement).style.background = 'transparent')}
                  >
                    <td style={{ padding: '14px 16px', color: '#f8fafc', fontSize: '0.875rem' }}>
                      {f.student_detail?.student_id || f.student}
                    </td>
                    <td style={{ padding: '14px 16px', color: '#cbd5e1', fontSize: '0.875rem' }}>
                      {f.fee_structure_detail?.category_detail?.name || '—'}
                    </td>
                    <td style={{ padding: '14px 16px', color: '#f8fafc', fontSize: '0.875rem' }}>
                      {fmt(f.total_amount)}
                    </td>
                    <td style={{ padding: '14px 16px', color: '#10b981', fontSize: '0.875rem' }}>
                      {fmt(f.paid_amount)}
                    </td>
                    <td style={{ padding: '14px 16px', color: '#ef4444', fontWeight: 600, fontSize: '0.875rem' }}>
                      {fmt(f.due_amount)}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span
                        style={{
                          background: `${statusColor[f.status] || '#6b7280'}22`,
                          color: statusColor[f.status] || '#6b7280',
                          padding: '4px 10px',
                          borderRadius: '999px',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          textTransform: 'capitalize',
                        }}
                      >
                        {f.status_display}
                      </span>
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

export default FeeDashboardPage;
