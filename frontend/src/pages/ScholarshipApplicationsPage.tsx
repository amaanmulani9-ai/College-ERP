import React, { useEffect, useState } from 'react';
import scholarshipService, { ScholarshipApplication } from '../services/scholarshipService';

const statusColors: Record<string, string> = {
  approved: '#10b981',
  submitted: '#3b82f6',
  under_review: '#f59e0b',
  rejected: '#ef4444',
  draft: '#6b7280',
};

export const ScholarshipApplicationsPage: React.FC = () => {
  const [apps, setApps] = useState<ScholarshipApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState('');

  const fetchApps = async () => {
    try {
      const data = await scholarshipService.getApplications();
      setApps(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApps();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      await scholarshipService.approve(id);
      setActionMsg('Application approved! Scholarship active & fee updated.');
      fetchApps();
      setTimeout(() => setActionMsg(''), 3000);
    } catch (err: any) {
      setActionMsg(err?.response?.data?.detail || 'Approval failed.');
    }
  };

  const handleReject = async (id: string) => {
    const reason = prompt('Enter reason for rejection:') || 'Criteria not met';
    try {
      await scholarshipService.reject(id, reason);
      setActionMsg('Application rejected.');
      fetchApps();
      setTimeout(() => setActionMsg(''), 3000);
    } catch (err: any) {
      setActionMsg(err?.response?.data?.detail || 'Rejection failed.');
    }
  };

  const fmt = (n: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

  return (
    <div style={{ padding: '32px', background: '#0f172a', minHeight: '100vh', color: '#f8fafc' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, margin: 0 }}>📥 Scholarship Applications</h1>
        <p style={{ color: '#94a3b8', marginTop: '8px' }}>
          Review submitted applications, verify CGPA & family income, and trigger automated approval/rejection
        </p>
      </div>

      {actionMsg && (
        <div style={{
          background: actionMsg.includes('approved') ? '#10b98122' : '#ef444422',
          border: `1px solid ${actionMsg.includes('approved') ? '#10b981' : '#ef4444'}`,
          borderRadius: '10px',
          padding: '12px 16px',
          marginBottom: '20px',
          color: actionMsg.includes('approved') ? '#10b981' : '#ef4444',
        }}>
          {actionMsg}
        </div>
      )}

      <div style={{ background: '#1e293b', borderRadius: '16px', border: '1px solid #334155', overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #334155' }}>
          <h2 style={{ margin: 0, fontSize: '1.125rem', color: '#f8fafc' }}>Application Roster</h2>
        </div>
        {loading ? (
          <div style={{ padding: '48px', textAlign: 'center', color: '#94a3b8' }}>Loading applications...</div>
        ) : apps.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center', color: '#94a3b8' }}>No scholarship applications submitted.</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#0f172a' }}>
                  {['Program Name', 'Session', 'Requested Amount', 'CGPA', 'Income', 'Status', 'Actions'].map((h) => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {apps.map((a) => (
                  <tr key={a.id} style={{ borderTop: '1px solid #334155' }}>
                    <td style={{ padding: '14px 16px', color: '#f8fafc', fontWeight: 600 }}>{a.scholarship_type_name}</td>
                    <td style={{ padding: '14px 16px', color: '#cbd5e1' }}>{a.academic_session_name}</td>
                    <td style={{ padding: '14px 16px', color: '#10b981', fontWeight: 700 }}>{fmt(a.requested_amount)}</td>
                    <td style={{ padding: '14px 16px', color: '#3b82f6', fontWeight: 700 }}>{a.current_cgpa}</td>
                    <td style={{ padding: '14px 16px', color: '#94a3b8', fontSize: '0.875rem' }}>
                      {a.family_annual_income ? fmt(a.family_annual_income) : 'N/A'}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span
                        style={{
                          background: `${statusColors[a.status] || '#6b7280'}22`,
                          color: statusColors[a.status] || '#6b7280',
                          padding: '4px 10px',
                          borderRadius: '999px',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          textTransform: 'capitalize',
                        }}
                      >
                        {a.status_display}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      {a.status === 'submitted' || a.status === 'under_review' ? (
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            onClick={() => handleApprove(a.id)}
                            style={{ background: '#10b98122', border: '1px solid #10b981', color: '#10b981', borderRadius: '6px', padding: '6px 12px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(a.id)}
                            style={{ background: '#ef444422', border: '1px solid #ef4444', color: '#ef4444', borderRadius: '6px', padding: '6px 12px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span style={{ color: '#64748b', fontSize: '0.75rem' }}>Completed</span>
                      )}
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

export default ScholarshipApplicationsPage;
