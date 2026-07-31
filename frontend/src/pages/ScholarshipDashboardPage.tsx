import React, { useEffect, useState } from 'react';
import scholarshipService, { Scholarship, ScholarshipApplication, ScholarshipType } from '../services/scholarshipService';

export const ScholarshipDashboardPage: React.FC = () => {
  const [types, setTypes] = useState<ScholarshipType[]>([]);
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [apps, setApps] = useState<ScholarshipApplication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [tList, sList, aList] = await Promise.all([
          scholarshipService.getTypes(),
          scholarshipService.getScholarships(),
          scholarshipService.getApplications(),
        ]);
        setTypes(tList);
        setScholarships(sList);
        setApps(aList);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const totalDisbursed = scholarships
    .filter((s) => s.status === 'active')
    .reduce((sum, s) => sum + Number(s.amount), 0);

  const pendingApps = apps.filter((a) => a.status === 'submitted' || a.status === 'under_review').length;
  const approvedApps = apps.filter((a) => a.status === 'approved').length;

  const fmt = (n: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

  return (
    <div style={{ padding: '32px', background: '#0f172a', minHeight: '100vh', color: '#f8fafc' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, margin: 0 }}>🎓 Scholarship Management Dashboard</h1>
        <p style={{ color: '#94a3b8', marginTop: '8px' }}>
          Overview of active financial aid, merit programs, applications & fee waiver integration
        </p>
      </div>

      {/* Stats KPI */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        {[
          { label: 'Active Programs', value: types.filter((t) => t.is_active).length, icon: '🏆', color: '#6366f1' },
          { label: 'Active Beneficiaries', value: scholarships.length, icon: '👥', color: '#3b82f6' },
          { label: 'Pending Applications', value: pendingApps, icon: '⏳', color: '#f59e0b' },
          { label: 'Total Aid Disbursed', value: fmt(totalDisbursed), icon: '💰', color: '#10b981' },
        ].map((c) => (
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

      {/* Recent Granted Scholarships */}
      <div style={{ background: '#1e293b', borderRadius: '16px', border: '1px solid #334155', overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #334155' }}>
          <h2 style={{ margin: 0, fontSize: '1.125rem', color: '#f8fafc' }}>Active Student Scholarships</h2>
        </div>
        {loading ? (
          <div style={{ padding: '48px', textAlign: 'center', color: '#94a3b8' }}>Loading scholarships...</div>
        ) : scholarships.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center', color: '#94a3b8' }}>No active scholarships granted yet.</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#0f172a' }}>
                  {['Scholarship Name', 'Session', 'Amount / Discount', 'Status', 'Valid Till'].map((h) => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {scholarships.slice(0, 10).map((s) => (
                  <tr key={s.id} style={{ borderTop: '1px solid #334155' }}>
                    <td style={{ padding: '14px 16px', color: '#f8fafc', fontWeight: 600 }}>{s.scholarship_type_name}</td>
                    <td style={{ padding: '14px 16px', color: '#cbd5e1' }}>{s.academic_session_name}</td>
                    <td style={{ padding: '14px 16px', color: '#10b981', fontWeight: 700 }}>
                      {s.amount > 0 ? fmt(s.amount) : `${s.percentage}% Fee Waiver`}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span
                        style={{
                          background: '#10b98122',
                          color: '#10b981',
                          padding: '4px 10px',
                          borderRadius: '999px',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          textTransform: 'capitalize',
                        }}
                      >
                        {s.status_display}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', color: '#94a3b8', fontSize: '0.875rem' }}>{s.end_date}</td>
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

export default ScholarshipDashboardPage;
