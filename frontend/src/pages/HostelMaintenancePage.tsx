import React, { useEffect, useState } from 'react';
import hostelService, { MaintenanceRequest, Room } from '../services/hostelService';

export const HostelMaintenancePage: React.FC = () => {
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    room_id: '',
    title: '',
    description: '',
  });

  const fetchData = async () => {
    try {
      const [m, r] = await Promise.all([hostelService.getMaintenanceRequests(), hostelService.getRooms()]);
      setRequests(m);
      setRooms(r);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await hostelService.createMaintenanceRequest({
        room: formData.room_id,
        title: formData.title,
        description: formData.description,
      });
      setShowModal(false);
      setFormData({ room_id: '', title: '', description: '' });
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Failed to submit maintenance request');
    }
  };

  return (
    <div style={{ padding: '32px', background: '#0f172a', minHeight: '100vh', color: '#f8fafc' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, margin: 0 }}>🔧 Hostel Maintenance Tickets</h1>
          <p style={{ color: '#94a3b8', marginTop: '4px' }}>Log & track room maintenance issues and repair tickets</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#fff', padding: '10px 20px', borderRadius: '10px', border: 'none', fontWeight: 600, cursor: 'pointer' }}
        >
          + Log Maintenance Ticket
        </button>
      </div>

      {loading ? (
        <div style={{ color: '#94a3b8', textAlign: 'center', padding: '48px' }}>Loading maintenance requests...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {requests.map((req) => (
            <div key={req.id} style={{ background: '#1e293b', borderRadius: '16px', border: '1px solid #334155', padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.75rem', color: '#818cf8', background: '#334155', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>
                  Room {req.room_number}
                </span>
                <span
                  style={{
                    fontSize: '0.75rem',
                    background: req.status === 'completed' ? '#10b98122' : req.status === 'in_progress' ? '#3b82f622' : '#f59e0b22',
                    color: req.status === 'completed' ? '#10b981' : req.status === 'in_progress' ? '#3b82f6' : '#f59e0b',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontWeight: 600,
                  }}
                >
                  {req.status_display}
                </span>
              </div>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '1.125rem' }}>{req.title}</h3>
              <p style={{ color: '#94a3b8', fontSize: '0.875rem', margin: 0 }}>{req.description}</p>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#1e293b', padding: '32px', borderRadius: '16px', width: '450px', border: '1px solid #334155' }}>
            <h2 style={{ margin: '0 0 20px 0', color: '#f8fafc' }}>Log Maintenance Ticket</h2>
            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', color: '#cbd5e1', marginBottom: '6px' }}>Select Room</label>
                <select required value={formData.room_id} onChange={(e) => setFormData({ ...formData, room_id: e.target.value })} style={inputStyle}>
                  <option value="">-- Choose Room --</option>
                  {rooms.map((r) => (
                    <option key={r.id} value={r.id}>
                      Room {r.room_number} ({r.hostel_name})
                    </option>
                  ))}
                </select>
              </div>
              <input required placeholder="Issue Title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} style={inputStyle} />
              <textarea required placeholder="Detailed Description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} style={{ ...inputStyle, minHeight: '90px' }} />

              <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                <button type="submit" style={{ flex: 1, background: '#f59e0b', color: '#fff', padding: '10px', borderRadius: '8px', border: 'none', fontWeight: 600 }}>Submit Ticket</button>
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

export default HostelMaintenancePage;
