import React, { useEffect, useState } from 'react';
import scholarshipService, { Scholarship } from '../services/scholarshipService';

export const StudentScholarshipsPage: React.FC = () => {
  const [studentId, setStudentId] = useState('');
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const fetchScholarships = async () => {
    if (!studentId.trim()) return;
    setLoading(true);
    try {
      const data = await scholarshipService.getStudentScholarships(studentId.trim());
      setScholarships(data);
      setSearched(true);
    } catch {
      setScholarships([]);
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
        <h1 style={{ fontSize: '2rem', fontWeight: 700, margin: 0 }}>🏅 Student Scholarships</h1>
        <p style={{ color: '#94a3b8', marginTop: '8px' }}>
          Search student ID to view active & historical granted scholarships and fee discounts
        </p>
      </div>

      {/* Search */}
      <div style={{ background: '#1e293b', borderRadius: '16px', border: '1px solid #334155', padding: '24px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '12px' }}>
          <input
            id="student-id-scholarship-search"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            placeholder="Enter Student UUID or ID..."
            style={{
              flex: 1,
              background: '#0f172a',
              border: '1px solid #334155',
              borderRadius: '10px',
              padding: '12px 16px',
              color: '#f8fafc',
            }}
            onKeyDown={(e) => e.key === 'Enter' && fetchScholarships()}
          />
          <button
            id="btn-fetch-student-sch"
            onClick={fetchScholarships}
            disabled={loading}
            style={{
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              color: '#fff',
              border: 'none',
              borderRadius: '10px',
              padding: '12px 24px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {loading ? 'Searching...' : 'Lookup Scholarships'}
          </button>
        </div>
      </div>

      {/* Table */}
      <div style={{ background: '#1e293b', borderRadius: '16px', border: '1px solid #334155', overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #334155' }}>
          <h2 style={{ margin: 0, fontSize: '1.125rem', color: '#f8fafc' }}>
            {searched ? `Scholarships Granted to Student: ${studentId}` : 'Search student ID above'}
          </h2>
        </div>

        {loading ? (
          <div style={{ padding: '48px', textAlign: 'center', color: '#94a3b8' }}>Loading student scholarships...</div>
        ) : !searched ? (
          <div style={{ padding: '48px', textAlign: 'center', color: '#64748b' }}>Enter student ID and click Lookup.</div>
        ) : scholarships.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center', color: '#94a3b8' }}>No active or past scholarships found.</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#0f172a' }}>
                  {['Program Name', 'Code', 'Provider', 'Session', 'Amount / Discount', 'Status'].map((h) => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {scholarships.map((s: any) => (
                  <tr key={s.id} style={{ borderTop: '1px solid #334155' }}>
                    <td style={{ padding: '14px 16px', color: '#f8fafc', fontWeight: 600 }}>{s.scholarship_type__name}</td>
                    <td style={{ padding: '14px 16px', color: '#6366f1', fontFamily: 'monospace' }}>{s.scholarship_type__code}</td>
                    <td style={{ padding: '14px 16px', color: '#cbd5e1', textTransform: 'capitalize' }}>{s.scholarship_type__provider}</td>
                    <td style={{ padding: '14px 16px', color: '#94a3b8' }}>{s.academic_session__name}</td>
                    <td style={{ padding: '14px 16px', color: '#10b981', fontWeight: 700 }}>
                      {s.amount > 0 ? fmt(s.amount) : `${s.percentage}% Fee Waiver`}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span
                        style={{
                          background: s.status === 'active' ? '#10b98122' : '#6b728022',
                          color: s.status === 'active' ? '#10b981' : '#6b7280',
                          padding: '4px 10px',
                          borderRadius: '999px',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          textTransform: 'capitalize',
                        }}
                      >
                        {s.status}
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

export default StudentScholarshipsPage;
