import React, { useEffect, useState } from 'react';
import libraryService, { Book, BookIssue, Reservation } from '../services/libraryService';

export const LibraryDashboardPage: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [issues, setIssues] = useState<BookIssue[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [bList, iList, rList] = await Promise.all([
          libraryService.getBooks(),
          libraryService.getIssues(),
          libraryService.getReservations(),
        ]);
        setBooks(bList);
        setIssues(iList);
        setReservations(rList);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const totalCopies = books.reduce((sum, b) => sum + b.copies, 0);
  const availableCopies = books.reduce((sum, b) => sum + b.available_copies, 0);
  const activeIssues = issues.filter((i) => i.status === 'issued').length;
  const totalFines = issues.reduce((sum, i) => sum + Number(i.fine_amount), 0);

  const fmt = (n: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

  return (
    <div style={{ padding: '32px', background: '#0f172a', minHeight: '100vh', color: '#f8fafc' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, margin: 0 }}>📚 Library Management Dashboard</h1>
        <p style={{ color: '#94a3b8', marginTop: '8px' }}>
          Overview of book catalog, active circulation, overdue items, reservations & fine collections
        </p>
      </div>

      {/* Stats KPI */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        {[
          { label: 'Total Book Titles', value: books.length, icon: '📖', color: '#6366f1' },
          { label: 'Available Copies', value: `${availableCopies} / ${totalCopies}`, icon: '✅', color: '#10b981' },
          { label: 'Active Borrowed', value: activeIssues, icon: '📤', color: '#3b82f6' },
          { label: 'Fines Collected', value: fmt(totalFines), icon: '💰', color: '#f59e0b' },
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

      {/* Active Issues Table */}
      <div style={{ background: '#1e293b', borderRadius: '16px', border: '1px solid #334155', overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #334155' }}>
          <h2 style={{ margin: 0, fontSize: '1.125rem', color: '#f8fafc' }}>Recent Circulation Logs</h2>
        </div>
        {loading ? (
          <div style={{ padding: '48px', textAlign: 'center', color: '#94a3b8' }}>Loading circulation history...</div>
        ) : issues.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center', color: '#94a3b8' }}>No active book issues found.</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#0f172a' }}>
                  {['Book Title', 'Borrower', 'Issue Date', 'Due Date', 'Fine', 'Status'].map((h) => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {issues.slice(0, 10).map((i) => (
                  <tr key={i.id} style={{ borderTop: '1px solid #334155' }}>
                    <td style={{ padding: '14px 16px', color: '#f8fafc', fontWeight: 600 }}>{i.book_title}</td>
                    <td style={{ padding: '14px 16px', color: '#6366f1', fontFamily: 'monospace' }}>
                      {i.student_id_str || i.staff_employee_id || 'System User'}
                    </td>
                    <td style={{ padding: '14px 16px', color: '#cbd5e1' }}>{i.issue_date}</td>
                    <td style={{ padding: '14px 16px', color: '#f59e0b', fontWeight: 600 }}>{i.due_date}</td>
                    <td style={{ padding: '14px 16px', color: '#ef4444', fontWeight: 700 }}>{fmt(i.fine_amount)}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <span
                        style={{
                          background: i.status === 'issued' ? '#3b82f622' : i.status === 'returned' ? '#10b98122' : '#ef444422',
                          color: i.status === 'issued' ? '#3b82f6' : i.status === 'returned' ? '#10b981' : '#ef4444',
                          padding: '4px 10px',
                          borderRadius: '999px',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          textTransform: 'capitalize',
                        }}
                      >
                        {i.status_display}
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

export default LibraryDashboardPage;
