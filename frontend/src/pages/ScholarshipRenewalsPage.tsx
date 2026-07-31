import React, { useEffect, useState } from 'react';
import scholarshipService, { ScholarshipRenewal } from '../services/scholarshipService';

export const ScholarshipRenewalsPage: React.FC = () => {
  const [renewals, setRenewals] = useState<ScholarshipRenewal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await scholarshipService.getRenewals();
        setRenewals(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div style={{ padding: '32px', background: '#0f172a', minHeight: '100vh', color: '#f8fafc' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, margin: 0 }}>🔄 Scholarship Renewals</h1>
        <p style={{ color: '#94a3b8', marginTop: '8px' }}>
          Annual renewal tracking for multi-year academic scholarships across sessions
        </p>
      </div>

      <div style={{ background: '#1e293b', borderRadius: '16px', border: '1px solid #334155', overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #334155' }}>
          <h2 style={{ margin: 0, fontSize: '1.125rem', color: '#f8fafc' }}>Renewal Records</h2>
        </div>
        {loading ? (
          <div style={{ padding: '48px', textAlign: 'center', color: '#94a3b8' }}>Loading renewals...</div>
        ) : renewals.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center', color: '#94a3b8' }}>No renewal requests processed yet.</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#0f172a' }}>
                  {['Program Name', 'Renewed Session', 'Status', 'Remarks', 'Processed At'].map((h) => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {renewals.map((r) => (
                  <tr key={r.id} style={{ borderTop: '1px solid #334155' }}>
                    <td style={{ padding: '14px 16px', color: '#f8fafc', fontWeight: 600 }}>{r.scholarship_name}</td>
                    <td style={{ padding: '14px 16px', color: '#6366f1' }}>{r.academic_session_name}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <span
                        style={{
                          background: r.status === 'approved' ? '#10b98122' : '#ef444422',
                          color: r.status === 'approved' ? '#10b981' : '#ef4444',
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
                    <td style={{ padding: '14px 16px', color: '#94a3b8', fontSize: '0.875rem' }}>{r.remarks || '—'}</td>
                    <td style={{ padding: '14px 16px', color: '#94a3b8', fontSize: '0.875rem' }}>
                      {r.processed_at ? new Date(r.processed_at).toLocaleDateString() : 'N/A'}
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

export default ScholarshipRenewalsPage;
