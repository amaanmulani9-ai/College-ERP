import React, { useEffect, useState } from 'react';
import feeService, { StudentFee } from '../services/feeService';

const OutstandingReportPage: React.FC = () => {
  const [fees, setFees] = useState<StudentFee[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    (async () => {
      try {
        const data = await feeService.getOutstandingReport();
        setFees(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = fees.filter((f) => {
    const matchStatus = statusFilter === 'all' || f.status === statusFilter;
    const matchSearch =
      !search ||
      f.student?.toLowerCase().includes(search.toLowerCase()) ||
      f.student_detail?.student_id?.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const totalDue = filtered.reduce((s, f) => s + f.due_amount, 0);
  const totalPaid = filtered.reduce((s, f) => s + f.paid_amount, 0);

  const fmt = (n: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

  const statusColors: Record<string, string> = {
    pending: '#f59e0b',
    partial: '#3b82f6',
    paid: '#10b981',
    overdue: '#ef4444',
    waived: '#8b5cf6',
  };

  return (
    <div style={{ padding: '32px', background: '#0f172a', minHeight: '100vh', color: '#f8fafc' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#f8fafc', margin: 0 }}>
          📊 Outstanding Report
        </h1>
        <p style={{ color: '#94a3b8', marginTop: '8px' }}>
          View all pending dues, partial payments, and overdue accounts
        </p>
      </div>

      {/* Summary bar */}
      <div style={{
        background: '#1e293b',
        border: '1px solid #334155',
        borderRadius: '16px',
        padding: '20px 24px',
        marginBottom: '24px',
        display: 'flex',
        gap: '32px',
        flexWrap: 'wrap',
      }}>
        <div>
          <div style={{ color: '#94a3b8', fontSize: '0.75rem', marginBottom: '4px' }}>Total Outstanding</div>
          <div style={{ color: '#ef4444', fontSize: '1.5rem', fontWeight: 700 }}>{fmt(totalDue)}</div>
        </div>
        <div>
          <div style={{ color: '#94a3b8', fontSize: '0.75rem', marginBottom: '4px' }}>Total Collected (filtered)</div>
          <div style={{ color: '#10b981', fontSize: '1.5rem', fontWeight: 700 }}>{fmt(totalPaid)}</div>
        </div>
        <div>
          <div style={{ color: '#94a3b8', fontSize: '0.75rem', marginBottom: '4px' }}>Records Shown</div>
          <div style={{ color: '#f8fafc', fontSize: '1.5rem', fontWeight: 700 }}>{filtered.length}</div>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <input
          id="outstanding-search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by student..."
          style={{
            flex: '1',
            minWidth: '200px',
            background: '#1e293b',
            border: '1px solid #334155',
            borderRadius: '10px',
            padding: '10px 16px',
            color: '#f8fafc',
          }}
        />
        <select
          id="outstanding-status-filter"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{
            background: '#1e293b',
            border: '1px solid #334155',
            borderRadius: '10px',
            padding: '10px 16px',
            color: '#f8fafc',
          }}
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="partial">Partial</option>
          <option value="overdue">Overdue</option>
          <option value="waived">Waived</option>
        </select>
        <button
          id="btn-export-outstanding"
          onClick={() => {
            const rows = filtered.map((f) => [
              f.student_detail?.student_id || f.student,
              f.fee_structure_detail?.category_detail?.name || '',
              f.total_amount,
              f.paid_amount,
              f.due_amount,
              f.status,
            ]);
            const csv = ['Student,Category,Total,Paid,Due,Status', ...rows.map((r) => r.join(','))].join('\n');
            const a = document.createElement('a');
            a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
            a.download = `outstanding_fees_${new Date().toISOString().slice(0, 10)}.csv`;
            a.click();
          }}
          style={{
            background: '#334155',
            color: '#94a3b8',
            border: '1px solid #475569',
            borderRadius: '10px',
            padding: '10px 16px',
            cursor: 'pointer',
          }}
        >
          ⬇ Export CSV
        </button>
      </div>

      {/* Table */}
      <div style={{ background: '#1e293b', borderRadius: '16px', border: '1px solid #334155', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '48px', textAlign: 'center', color: '#94a3b8' }}>Loading...</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center', color: '#94a3b8' }}>No records found.</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#0f172a' }}>
                  {['Student ID', 'Category', 'Total', 'Waiver', 'Scholarship', 'Paid', 'Due', 'Status'].map((h) => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((f) => (
                  <tr key={f.id} style={{ borderTop: '1px solid #334155' }}>
                    <td style={{ padding: '13px 16px', color: '#f8fafc', fontSize: '0.875rem', fontWeight: 500 }}>
                      {f.student_detail?.student_id || f.student.slice(0, 8)}
                    </td>
                    <td style={{ padding: '13px 16px', color: '#cbd5e1', fontSize: '0.875rem' }}>
                      {f.fee_structure_detail?.category_detail?.name || '—'}
                    </td>
                    <td style={{ padding: '13px 16px', color: '#f8fafc', fontSize: '0.875rem' }}>{fmt(f.total_amount)}</td>
                    <td style={{ padding: '13px 16px', color: '#8b5cf6', fontSize: '0.875rem' }}>{fmt(f.waiver_amount)}</td>
                    <td style={{ padding: '13px 16px', color: '#3b82f6', fontSize: '0.875rem' }}>{fmt(f.scholarship_amount)}</td>
                    <td style={{ padding: '13px 16px', color: '#10b981', fontSize: '0.875rem' }}>{fmt(f.paid_amount)}</td>
                    <td style={{ padding: '13px 16px', fontSize: '0.875rem', fontWeight: 700, color: f.due_amount > 0 ? '#ef4444' : '#10b981' }}>
                      {fmt(f.due_amount)}
                    </td>
                    <td style={{ padding: '13px 16px' }}>
                      <span style={{
                        background: `${statusColors[f.status] || '#6b7280'}22`,
                        color: statusColors[f.status] || '#6b7280',
                        padding: '4px 10px',
                        borderRadius: '999px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        textTransform: 'capitalize',
                      }}>
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

export default OutstandingReportPage;
