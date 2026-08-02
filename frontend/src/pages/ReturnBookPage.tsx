import React, { useEffect, useState } from 'react';
import libraryService, { BookIssue } from '../services/libraryService';

export const ReturnBookPage: React.FC = () => {
  const [issues, setIssues] = useState<BookIssue[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIssue, setSelectedIssue] = useState<BookIssue | null>(null);
  const [remarks, setRemarks] = useState('');
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchActiveIssues = async () => {
    try {
      const all = await libraryService.getIssues();
      setIssues(all.filter((i) => i.status === 'issued' || i.status === 'overdue'));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveIssues();
  }, []);

  const handleReturn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIssue) return;
    setMsg(null);
    try {
      const returned = await libraryService.returnBook({
        issue_id: selectedIssue.id,
        remarks,
      });
      setMsg({
        type: 'success',
        text: `Book '${returned.book_title}' successfully returned! Fine amount assessed: ₹${returned.fine_amount}`,
      });
      setSelectedIssue(null);
      setRemarks('');
      fetchActiveIssues();
    } catch (err: any) {
      setMsg({ type: 'error', text: err.response?.data?.detail || 'Failed to process return.' });
    }
  };

  return (
    <div style={{ padding: '32px', background: '#0f172a', minHeight: '100vh', color: '#f8fafc' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, margin: 0 }}>📥 Return Book & Fine Assessment</h1>
        <p style={{ color: '#94a3b8', marginTop: '4px' }}>Process book return check-in and calculate overdue penalties automatically</p>
      </div>

      {msg && (
        <div
          style={{
            background: msg.type === 'success' ? '#10b98122' : '#ef444422',
            border: `1px solid ${msg.type === 'success' ? '#10b981' : '#ef4444'}`,
            color: msg.type === 'success' ? '#10b981' : '#ef4444',
            padding: '16px',
            borderRadius: '12px',
            marginBottom: '24px',
          }}
        >
          {msg.text}
        </div>
      )}

      {loading ? (
        <div style={{ color: '#94a3b8', padding: '48px', textAlign: 'center' }}>Loading issued books...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '24px' }}>
          {/* List of Issued Books */}
          <div style={{ background: '#1e293b', borderRadius: '16px', border: '1px solid #334155', padding: '24px' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '1.125rem' }}>Active Issued Holdings ({issues.length})</h3>
            {issues.length === 0 ? (
              <p style={{ color: '#94a3b8' }}>No active issued books pending return.</p>
            ) : (
              <div style={{ display: 'grid', gap: '12px' }}>
                {issues.map((i) => (
                  <div
                    key={i.id}
                    onClick={() => setSelectedIssue(i)}
                    style={{
                      background: selectedIssue?.id === i.id ? '#6366f122' : '#0f172a',
                      border: `1px solid ${selectedIssue?.id === i.id ? '#6366f1' : '#334155'}`,
                      borderRadius: '12px',
                      padding: '16px',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ fontWeight: 600, color: '#f8fafc' }}>{i.book_title}</span>
                      <span style={{ fontSize: '0.75rem', color: '#818cf8' }}>{i.due_date}</span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                      Borrower: <span style={{ color: '#6366f1' }}>{i.student_id_str || i.staff_employee_id || 'N/A'}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Return Action Form */}
          <div style={{ background: '#1e293b', borderRadius: '16px', border: '1px solid #334155', padding: '24px', height: 'fit-content' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '1.125rem' }}>Check-In Details</h3>
            {selectedIssue ? (
              <form onSubmit={handleReturn} style={{ display: 'grid', gap: '16px' }}>
                <div>
                  <div style={{ fontSize: '0.875rem', color: '#94a3b8' }}>Book Title</div>
                  <div style={{ fontSize: '1rem', fontWeight: 600, color: '#f8fafc' }}>{selectedIssue.book_title}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.875rem', color: '#94a3b8' }}>Due Date</div>
                  <div style={{ fontSize: '1rem', fontWeight: 600, color: '#f59e0b' }}>{selectedIssue.due_date}</div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', color: '#cbd5e1', marginBottom: '6px' }}>Condition / Remarks</label>
                  <input
                    placeholder="e.g. Returned in good condition"
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    style={{ background: '#0f172a', border: '1px solid #334155', color: '#f8fafc', padding: '10px', borderRadius: '8px', width: '100%', boxSizing: 'border-box' }}
                  />
                </div>
                <button
                  type="submit"
                  style={{
                    background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                    color: '#fff',
                    padding: '12px',
                    borderRadius: '10px',
                    border: 'none',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Process Check-In Return
                </button>
              </form>
            ) : (
              <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Select an active issue record from the list to process return check-in.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReturnBookPage;
