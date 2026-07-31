import React, { useEffect, useState } from 'react';
import libraryService, { BookIssue } from '../services/libraryService';

export const FineReportPage: React.FC = () => {
  const [fines, setFines] = useState<BookIssue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const list = await libraryService.getFinesReport();
        setFines(list);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const totalFineAmount = fines.reduce((sum, f) => sum + Number(f.fine_amount), 0);
  const fmt = (n: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

  return (
    <div style={{ padding: '32px', background: '#0f172a', minHeight: '100vh', color: '#f8fafc' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, margin: 0 }}>💰 Library Fine Collection Report</h1>
        <p style={{ color: '#94a3b8', marginTop: '4px' }}>Overview of overdue fines, lost book replacements, and damage penalties</p>
      </div>

      <div style={{ background: 'linear-gradient(135deg, #1e293b, #0f172a)', border: '1px solid #f59e0b33', borderRadius: '16px', padding: '24px', width: 'fit-content', marginBottom: '32px' }}>
        <div style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Total Fines Assessed</div>
        <div style={{ fontSize: '2.25rem', fontWeight: 700, color: '#f59e0b', marginTop: '4px' }}>{fmt(totalFineAmount)}</div>
      </div>

      {loading ? (
        <div style={{ color: '#94a3b8', textAlign: 'center', padding: '48px' }}>Loading fine records...</div>
      ) : fines.length === 0 ? (
        <div style={{ color: '#94a3b8', textAlign: 'center', padding: '48px', background: '#1e293b', borderRadius: '16px', border: '1px solid #334155' }}>
          No library fines currently assessed.
        </div>
      ) : (
        <div style={{ background: '#1e293b', borderRadius: '16px', border: '1px solid #334155', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#0f172a' }}>
                {['Book Title', 'Borrower', 'Issue Date', 'Due Date', 'Return Date', 'Fine Amount', 'Status'].map((h) => (
                  <th key={h} style={{ padding: '14px 20px', textAlign: 'left', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {fines.map((f) => (
                <tr key={f.id} style={{ borderTop: '1px solid #334155' }}>
                  <td style={{ padding: '16px 20px', fontWeight: 600, color: '#f8fafc' }}>{f.book_title}</td>
                  <td style={{ padding: '16px 20px', color: '#818cf8', fontFamily: 'monospace' }}>{f.student_id_str || f.staff_employee_id || 'N/A'}</td>
                  <td style={{ padding: '16px 20px', color: '#cbd5e1' }}>{f.issue_date}</td>
                  <td style={{ padding: '16px 20px', color: '#f59e0b' }}>{f.due_date}</td>
                  <td style={{ padding: '16px 20px', color: '#cbd5e1' }}>{f.return_date || 'Not Returned'}</td>
                  <td style={{ padding: '16px 20px', color: '#ef4444', fontWeight: 700 }}>{fmt(f.fine_amount)}</td>
                  <td style={{ padding: '16px 20px', textTransform: 'capitalize', color: '#cbd5e1' }}>{f.status_display}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default FineReportPage;
