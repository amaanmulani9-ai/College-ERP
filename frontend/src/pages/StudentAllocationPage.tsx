import React, { useEffect, useState } from 'react';
import hostelService, { Bed, HostelAllocation } from '../services/hostelService';

export const StudentAllocationPage: React.FC = () => {
  const [allocations, setAllocations] = useState<HostelAllocation[]>([]);
  const [vacantBeds, setVacantBeds] = useState<Bed[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    student_id: '',
    bed_id: '',
    academic_session_id: '',
    fee_amount: 25000,
  });

  const fetchData = async () => {
    try {
      const [a, b] = await Promise.all([hostelService.getAllocations(), hostelService.getBeds()]);
      setAllocations(a);
      setVacantBeds(b.filter((bed) => bed.status === 'vacant'));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAllocate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await hostelService.allocateBed(formData);
      setShowModal(false);
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Failed to allocate bed');
    }
  };

  return (
    <div style={{ padding: '32px', background: '#0f172a', minHeight: '100vh', color: '#f8fafc' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, margin: 0 }}>🏠 Student Bed Allocation</h1>
          <p style={{ color: '#94a3b8', marginTop: '4px' }}>Assign vacant hostel beds and integrate with Fee Management</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          style={{ background: 'linear-gradient(135deg, #10b981, #059669)', color: '#fff', padding: '10px 20px', borderRadius: '10px', border: 'none', fontWeight: 600, cursor: 'pointer' }}
        >
          + Allocate New Bed
        </button>
      </div>

      {loading ? (
        <div style={{ color: '#94a3b8', textAlign: 'center', padding: '48px' }}>Loading allocations...</div>
      ) : (
        <div style={{ background: '#1e293b', borderRadius: '16px', border: '1px solid #334155', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#0f172a' }}>
                {['Student ID', 'Student Name', 'Room', 'Bed', 'Check In Date', 'Status'].map((h) => (
                  <th key={h} style={{ padding: '14px 20px', textAlign: 'left', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {allocations.map((a) => (
                <tr key={a.id} style={{ borderTop: '1px solid #334155' }}>
                  <td style={{ padding: '16px 20px', color: '#6366f1', fontFamily: 'monospace' }}>{a.student_id_str}</td>
                  <td style={{ padding: '16px 20px', fontWeight: 600, color: '#f8fafc' }}>{a.student_name}</td>
                  <td style={{ padding: '16px 20px', color: '#cbd5e1' }}>Room {a.room_number}</td>
                  <td style={{ padding: '16px 20px', color: '#cbd5e1' }}>Bed {a.bed_number}</td>
                  <td style={{ padding: '16px 20px', color: '#cbd5e1' }}>{a.check_in_date || 'Pending Check-In'}</td>
                  <td style={{ padding: '16px 20px' }}>
                    <span
                      style={{
                        background: a.status === 'checked_in' ? '#10b98122' : a.status === 'allocated' ? '#3b82f622' : '#94a3b822',
                        color: a.status === 'checked_in' ? '#10b981' : a.status === 'allocated' ? '#3b82f6' : '#94a3b8',
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#1e293b', padding: '32px', borderRadius: '16px', width: '450px', border: '1px solid #334155' }}>
            <h2 style={{ margin: '0 0 20px 0', color: '#f8fafc' }}>Allocate Hostel Bed</h2>
            <form onSubmit={handleAllocate} style={{ display: 'grid', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', color: '#cbd5e1', marginBottom: '6px' }}>Student UUID</label>
                <input required placeholder="Student UUID" value={formData.student_id} onChange={(e) => setFormData({ ...formData, student_id: e.target.value })} style={inputStyle} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', color: '#cbd5e1', marginBottom: '6px' }}>Select Vacant Bed</label>
                <select required value={formData.bed_id} onChange={(e) => setFormData({ ...formData, bed_id: e.target.value })} style={inputStyle}>
                  <option value="">-- Choose Vacant Bed --</option>
                  {vacantBeds.map((b) => (
                    <option key={b.id} value={b.id}>
                      Room {b.room_number} - Bed {b.bed_number}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', color: '#cbd5e1', marginBottom: '6px' }}>Academic Session UUID</label>
                <input required placeholder="Academic Session UUID" value={formData.academic_session_id} onChange={(e) => setFormData({ ...formData, academic_session_id: e.target.value })} style={inputStyle} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', color: '#cbd5e1', marginBottom: '6px' }}>Hostel Fee Amount (₹)</label>
                <input type="number" min="0" value={formData.fee_amount} onChange={(e) => setFormData({ ...formData, fee_amount: parseFloat(e.target.value) })} style={inputStyle} />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                <button type="submit" style={{ flex: 1, background: '#10b981', color: '#fff', padding: '10px', borderRadius: '8px', border: 'none', fontWeight: 600 }}>Allocate</button>
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

export default StudentAllocationPage;
