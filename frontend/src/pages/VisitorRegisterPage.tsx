import React, { useEffect, useState } from 'react';
import hostelService, { Visitor } from '../services/hostelService';

export const VisitorRegisterPage: React.FC = () => {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    student_id: '',
    visitor_name: '',
    relation: '',
    mobile: '',
    visit_date: new Date().toISOString().split('T')[0],
  });

  const fetchVisitors = async () => {
    try {
      const data = await hostelService.getVisitors();
      setVisitors(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisitors();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await hostelService.createVisitor({
        student: formData.student_id,
        visitor_name: formData.visitor_name,
        relation: formData.relation,
        mobile: formData.mobile,
        visit_date: formData.visit_date,
        check_in_time: new Date().toISOString(),
      });
      setShowModal(false);
      fetchVisitors();
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Failed to register visitor');
    }
  };

  return (
    <div style={{ padding: '32px', background: '#0f172a', minHeight: '100vh', color: '#f8fafc' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, margin: 0 }}>📋 Hostel Visitor Register</h1>
          <p style={{ color: '#94a3b8', marginTop: '4px' }}>Log visitor check-in, relation, and contact details</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)', color: '#fff', padding: '10px 20px', borderRadius: '10px', border: 'none', fontWeight: 600, cursor: 'pointer' }}
        >
          + Register Visitor Entry
        </button>
      </div>

      {loading ? (
        <div style={{ color: '#94a3b8', textAlign: 'center', padding: '48px' }}>Loading visitors...</div>
      ) : (
        <div style={{ background: '#1e293b', borderRadius: '16px', border: '1px solid #334155', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#0f172a' }}>
                {['Visitor Name', 'Relation', 'Mobile', 'Student ID', 'Visit Date', 'Check-In Time'].map((h) => (
                  <th key={h} style={{ padding: '14px 20px', textAlign: 'left', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visitors.map((v) => (
                <tr key={v.id} style={{ borderTop: '1px solid #334155' }}>
                  <td style={{ padding: '16px 20px', fontWeight: 600, color: '#f8fafc' }}>{v.visitor_name}</td>
                  <td style={{ padding: '16px 20px', color: '#cbd5e1' }}>{v.relation}</td>
                  <td style={{ padding: '16px 20px', color: '#818cf8', fontFamily: 'monospace' }}>{v.mobile}</td>
                  <td style={{ padding: '16px 20px', color: '#6366f1', fontFamily: 'monospace' }}>{v.student_id_str}</td>
                  <td style={{ padding: '16px 20px', color: '#cbd5e1' }}>{v.visit_date}</td>
                  <td style={{ padding: '16px 20px', color: '#10b981' }}>{new Date(v.check_in_time).toLocaleTimeString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#1e293b', padding: '32px', borderRadius: '16px', width: '450px', border: '1px solid #334155' }}>
            <h2 style={{ margin: '0 0 20px 0', color: '#f8fafc' }}>Register Visitor</h2>
            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', color: '#cbd5e1', marginBottom: '6px' }}>Student UUID</label>
                <input required placeholder="Student UUID" value={formData.student_id} onChange={(e) => setFormData({ ...formData, student_id: e.target.value })} style={inputStyle} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', color: '#cbd5e1', marginBottom: '6px' }}>Visitor Name</label>
                <input required placeholder="Full Name" value={formData.visitor_name} onChange={(e) => setFormData({ ...formData, visitor_name: e.target.value })} style={inputStyle} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <input required placeholder="Relation (e.g. Father)" value={formData.relation} onChange={(e) => setFormData({ ...formData, relation: e.target.value })} style={inputStyle} />
                <input required placeholder="Mobile Number" value={formData.mobile} onChange={(e) => setFormData({ ...formData, mobile: e.target.value })} style={inputStyle} />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                <button type="submit" style={{ flex: 1, background: '#3b82f6', color: '#fff', padding: '10px', borderRadius: '8px', border: 'none', fontWeight: 600 }}>Save Entry</button>
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

export default VisitorRegisterPage;
