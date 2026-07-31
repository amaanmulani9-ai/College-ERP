import React, { useEffect, useState } from 'react';
import hostelService, { Hostel } from '../services/hostelService';

export const HostelsPage: React.FC = () => {
  const [hostels, setHostels] = useState<Hostel[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    gender_type: 'boys' as 'boys' | 'girls' | 'coed',
    address: '',
  });

  const fetchHostels = async () => {
    try {
      const data = await hostelService.getHostels();
      setHostels(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHostels();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await hostelService.createHostel(formData);
      setShowModal(false);
      setFormData({ name: '', code: '', gender_type: 'boys', address: '' });
      fetchHostels();
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Failed to create hostel building');
    }
  };

  return (
    <div style={{ padding: '32px', background: '#0f172a', minHeight: '100vh', color: '#f8fafc' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, margin: 0 }}>🏢 Hostel Buildings</h1>
          <p style={{ color: '#94a3b8', marginTop: '4px' }}>Campus residential buildings & gender assignments</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: '#fff', padding: '10px 20px', borderRadius: '10px', border: 'none', fontWeight: 600, cursor: 'pointer' }}
        >
          + Add Hostel Building
        </button>
      </div>

      {loading ? (
        <div style={{ color: '#94a3b8', textAlign: 'center', padding: '48px' }}>Loading hostel buildings...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {hostels.map((h) => (
            <div key={h.id} style={{ background: '#1e293b', borderRadius: '16px', padding: '24px', border: '1px solid #334155' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.75rem', color: '#818cf8', background: '#334155', padding: '2px 8px', borderRadius: '4px', fontFamily: 'monospace' }}>{h.code}</span>
                <span
                  style={{
                    fontSize: '0.75rem',
                    background: h.gender_type === 'boys' ? '#3b82f622' : h.gender_type === 'girls' ? '#ec489922' : '#10b98122',
                    color: h.gender_type === 'boys' ? '#3b82f6' : h.gender_type === 'girls' ? '#ec4899' : '#10b981',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontWeight: 600,
                  }}
                >
                  {h.gender_type_display}
                </span>
              </div>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '1.25rem' }}>{h.name}</h3>
              <p style={{ color: '#94a3b8', fontSize: '0.875rem', margin: 0 }}>{h.address || 'Campus Premise'}</p>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#1e293b', padding: '32px', borderRadius: '16px', width: '420px', border: '1px solid #334155' }}>
            <h2 style={{ margin: '0 0 20px 0', color: '#f8fafc' }}>Add Hostel Building</h2>
            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '16px' }}>
              <input placeholder="Hostel Name" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} style={inputStyle} />
              <input placeholder="Code (e.g. GBH-01)" required value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value })} style={inputStyle} />
              <select value={formData.gender_type} onChange={(e: any) => setFormData({ ...formData, gender_type: e.target.value })} style={inputStyle}>
                <option value="boys">Boys Hostel</option>
                <option value="girls">Girls Hostel</option>
                <option value="coed">Co-Ed Hostel</option>
              </select>
              <textarea placeholder="Address / Location" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} style={{ ...inputStyle, minHeight: '80px' }} />
              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="submit" style={{ flex: 1, background: '#6366f1', color: '#fff', padding: '10px', borderRadius: '8px', border: 'none', fontWeight: 600 }}>Save</button>
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

export default HostelsPage;
