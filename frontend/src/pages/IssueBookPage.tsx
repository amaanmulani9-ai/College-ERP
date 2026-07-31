import React, { useEffect, useState } from 'react';
import libraryService, { Book } from '../services/libraryService';

export const IssueBookPage: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    book_id: '',
    student_id: '',
    staff_id: '',
    issue_days: 14,
    remarks: '',
  });

  useEffect(() => {
    (async () => {
      try {
        const b = await libraryService.getBooks();
        setBooks(b.filter((book) => book.available_copies > 0));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleIssue = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess('');
    setError('');
    try {
      const payload: any = {
        book_id: formData.book_id,
        issue_days: formData.issue_days,
        remarks: formData.remarks,
      };
      if (formData.student_id) payload.student_id = formData.student_id;
      if (formData.staff_id) payload.staff_id = formData.staff_id;

      const issue = await libraryService.issueBook(payload);
      setSuccess(`Book successfully issued! Issue ID: ${issue.id} | Due Date: ${issue.due_date}`);
      // Refresh available books
      const updatedBooks = await libraryService.getBooks();
      setBooks(updatedBooks.filter((book) => book.available_copies > 0));
      setFormData({ book_id: '', student_id: '', staff_id: '', issue_days: 14, remarks: '' });
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to issue book.');
    }
  };

  return (
    <div style={{ padding: '32px', background: '#0f172a', minHeight: '100vh', color: '#f8fafc' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, margin: 0 }}>📤 Issue Book (Circulation)</h1>
        <p style={{ color: '#94a3b8', marginTop: '4px' }}>Issue a copy from available holdings to a student or staff borrower</p>
      </div>

      {success && <div style={{ background: '#10b98122', border: '1px solid #10b981', color: '#10b981', padding: '16px', borderRadius: '12px', marginBottom: '24px' }}>{success}</div>}
      {error && <div style={{ background: '#ef444422', border: '1px solid #ef4444', color: '#ef4444', padding: '16px', borderRadius: '12px', marginBottom: '24px' }}>{error}</div>}

      <div style={{ background: '#1e293b', borderRadius: '16px', border: '1px solid #334155', padding: '32px', maxWidth: '600px' }}>
        <form onSubmit={handleIssue} style={{ display: 'grid', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', color: '#cbd5e1', marginBottom: '6px' }}>Select Book</label>
            <select required value={formData.book_id} onChange={(e) => setFormData({ ...formData, book_id: e.target.value })} style={inputStyle}>
              <option value="">-- Choose Available Book --</option>
              {books.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.title} (ISBN: {b.isbn}) - [{b.available_copies} available]
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', color: '#cbd5e1', marginBottom: '6px' }}>Student UUID (Optional)</label>
              <input placeholder="Student UUID" value={formData.student_id} onChange={(e) => setFormData({ ...formData, student_id: e.target.value })} style={inputStyle} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', color: '#cbd5e1', marginBottom: '6px' }}>Staff UUID (Optional)</label>
              <input placeholder="Staff UUID" value={formData.staff_id} onChange={(e) => setFormData({ ...formData, staff_id: e.target.value })} style={inputStyle} />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', color: '#cbd5e1', marginBottom: '6px' }}>Loan Period (Days)</label>
            <input type="number" min="1" max="90" value={formData.issue_days} onChange={(e) => setFormData({ ...formData, issue_days: parseInt(e.target.value) })} style={inputStyle} />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', color: '#cbd5e1', marginBottom: '6px' }}>Remarks</label>
            <input placeholder="Optional notes" value={formData.remarks} onChange={(e) => setFormData({ ...formData, remarks: e.target.value })} style={inputStyle} />
          </div>

          <button
            type="submit"
            style={{
              background: 'linear-gradient(135deg, #10b981, #059669)',
              color: '#fff',
              padding: '12px',
              borderRadius: '10px',
              border: 'none',
              fontWeight: 700,
              cursor: 'pointer',
              marginTop: '8px',
            }}
          >
            Confirm & Issue Book
          </button>
        </form>
      </div>
    </div>
  );
};

const inputStyle: React.CSSProperties = {
  background: '#0f172a',
  border: '1px solid #334155',
  color: '#f8fafc',
  padding: '10px 14px',
  borderRadius: '8px',
  width: '100%',
  boxSizing: 'border-box',
};

export default IssueBookPage;
