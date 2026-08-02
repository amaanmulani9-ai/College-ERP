import React, { useEffect, useState } from 'react';
import libraryService, { Book, Reservation } from '../services/libraryService';

export const ReservationsPage: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    book_id: '',
    student_id: '',
    staff_id: '',
  });

  const fetchData = async () => {
    try {
      const [r, b] = await Promise.all([libraryService.getReservations(), libraryService.getBooks()]);
      setReservations(r);
      setBooks(b);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleReserve = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await libraryService.reserveBook(formData);
      setShowModal(false);
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Failed to create reservation');
    }
  };

  return (
    <div style={{ padding: '32px', background: '#0f172a', minHeight: '100vh', color: '#f8fafc' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, margin: 0 }}>🔖 Book Reservations Queue</h1>
          <p style={{ color: '#94a3b8', marginTop: '4px' }}>Track book hold requests and priority queues</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          style={{
            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
            color: '#fff',
            padding: '10px 20px',
            borderRadius: '10px',
            border: 'none',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          + Reserve a Book
        </button>
      </div>

      {loading ? (
        <div style={{ color: '#94a3b8', textAlign: 'center', padding: '48px' }}>Loading reservations...</div>
      ) : (
        <div style={{ background: '#1e293b', borderRadius: '16px', border: '1px solid #334155', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#0f172a' }}>
                {['Book Title', 'Reserved Date', 'Status'].map((h) => (
                  <th key={h} style={{ padding: '14px 20px', textAlign: 'left', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {reservations.map((r) => (
                <tr key={r.id} style={{ borderTop: '1px solid #334155' }}>
                  <td style={{ padding: '16px 20px', fontWeight: 600, color: '#f8fafc' }}>{r.book_title}</td>
                  <td style={{ padding: '16px 20px', color: '#cbd5e1' }}>{r.reserved_date}</td>
                  <td style={{ padding: '16px 20px' }}>
                    <span
                      style={{
                        background: r.status === 'pending' ? '#f59e0b22' : r.status === 'fulfilled' ? '#10b98122' : '#ef444422',
                        color: r.status === 'pending' ? '#f59e0b' : r.status === 'fulfilled' ? '#10b981' : '#ef4444',
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#1e293b', padding: '32px', borderRadius: '16px', width: '450px', border: '1px solid #334155' }}>
            <h2 style={{ margin: '0 0 20px 0', color: '#f8fafc' }}>Reserve Book Copy</h2>
            <form onSubmit={handleReserve} style={{ display: 'grid', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', color: '#cbd5e1', marginBottom: '6px' }}>Select Book</label>
                <select required value={formData.book_id} onChange={(e) => setFormData({ ...formData, book_id: e.target.value })} style={inputStyle}>
                  <option value="">-- Choose Book --</option>
                  {books.map((b) => (
                    <option key={b.id} value={b.id}>{b.title}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', color: '#cbd5e1', marginBottom: '6px' }}>Student UUID (Optional)</label>
                <input placeholder="Student UUID" value={formData.student_id} onChange={(e) => setFormData({ ...formData, student_id: e.target.value })} style={inputStyle} />
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                <button type="submit" style={{ flex: 1, background: '#f59e0b', color: '#fff', padding: '10px', borderRadius: '8px', border: 'none', fontWeight: 600 }}>Reserve</button>
                <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, background: '#334155', color: '#fff', padding: '10px', borderRadius: '8px', border: 'none' }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
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

export default ReservationsPage;
