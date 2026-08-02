import React, { useEffect, useState } from 'react';
import scholarshipService, { ScholarshipType } from '../services/scholarshipService';

export const ScholarshipTypesPage: React.FC = () => {
  const [types, setTypes] = useState<ScholarshipType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newType, setNewType] = useState({
    name: '',
    code: '',
    provider: 'merit' as const,
    min_cgpa_requirement: 0.0,
    max_family_income: '',
    description: '',
    is_active: true,
  });
  const [msg, setMsg] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const data = await scholarshipService.getTypes();
        setTypes(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = await scholarshipService.createType({
        ...newType,
        max_family_income: newType.max_family_income ? parseFloat(newType.max_family_income) : undefined,
      });
      setTypes((prev) => [...prev, created]);
      setShowForm(false);
      setNewType({
        name: '',
        code: '',
        provider: 'merit',
        min_cgpa_requirement: 0.0,
        max_family_income: '',
        description: '',
        is_active: true,
      });
      setMsg('Scholarship program created successfully!');
      setTimeout(() => setMsg(''), 3000);
    } catch (err: any) {
      setMsg(err?.response?.data?.detail || 'Failed to create scholarship program.');
    }
  };

  const providers = ['government', 'private', 'merit', 'sports', 'minority', 'need_based', 'fee_waiver'];

  return (
    <div style={{ padding: '32px', background: '#0f172a', minHeight: '100vh', color: '#f8fafc' }}>
      <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, margin: 0 }}>📋 Scholarship Programs Catalog</h1>
          <p style={{ color: '#94a3b8', marginTop: '8px' }}>
            Manage scholarship categories, provider rules, CGPA minimums, and income caps
          </p>
        </div>
        <button
          id="btn-new-type"
          onClick={() => setShowForm(true)}
          style={{
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            color: '#fff',
            border: 'none',
            borderRadius: '10px',
            padding: '12px 20px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          + Add Program
        </button>
      </div>

      {msg && (
        <div style={{
          background: msg.includes('success') ? '#10b98122' : '#ef444422',
          border: `1px solid ${msg.includes('success') ? '#10b981' : '#ef4444'}`,
          borderRadius: '10px',
          padding: '12px 16px',
          marginBottom: '20px',
          color: msg.includes('success') ? '#10b981' : '#ef4444',
        }}>
          {msg}
        </div>
      )}

      {showForm && (
        <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '16px', padding: '24px', marginBottom: '24px' }}>
          <h3 style={{ margin: '0 0 16px', color: '#f8fafc' }}>Create New Scholarship Program</h3>
          <form onSubmit={handleCreate} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.75rem', marginBottom: '4px' }}>Name*</label>
              <input
                id="type-name"
                value={newType.name}
                onChange={(e) => setNewType({ ...newType, name: e.target.value })}
                required
                placeholder="e.g. National Merit Award"
                style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '10px', color: '#f8fafc', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.75rem', marginBottom: '4px' }}>Code*</label>
              <input
                id="type-code"
                value={newType.code}
                onChange={(e) => setNewType({ ...newType, code: e.target.value.toUpperCase() })}
                required
                placeholder="e.g. MERIT-2026"
                style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '10px', color: '#f8fafc', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.75rem', marginBottom: '4px' }}>Provider Category*</label>
              <select
                id="type-provider"
                value={newType.provider}
                onChange={(e) => setNewType({ ...newType, provider: e.target.value as any })}
                style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '10px', color: '#f8fafc' }}
              >
                {providers.map((p) => (
                  <option key={p} value={p}>{p.replace('_', ' ').toUpperCase()}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.75rem', marginBottom: '4px' }}>Min CGPA Requirement</label>
              <input
                id="type-min-cgpa"
                type="number"
                step="0.1"
                min="0"
                max="10"
                value={newType.min_cgpa_requirement}
                onChange={(e) => setNewType({ ...newType, min_cgpa_requirement: parseFloat(e.target.value) || 0 })}
                style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '10px', color: '#f8fafc', boxSizing: 'border-box' }}
              />
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.75rem', marginBottom: '4px' }}>Max Annual Family Income Cap (₹)</label>
              <input
                id="type-income-cap"
                type="number"
                value={newType.max_family_income}
                onChange={(e) => setNewType({ ...newType, max_family_income: e.target.value })}
                placeholder="Optional family income ceiling"
                style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '10px', color: '#f8fafc', boxSizing: 'border-box' }}
              />
            </div>
            <div style={{ gridColumn: 'span 2', display: 'flex', gap: '12px' }}>
              <button
                type="submit"
                id="btn-save-type"
                style={{ background: 'linear-gradient(135deg, #10b981, #059669)', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 20px', fontWeight: 600, cursor: 'pointer' }}
              >
                Create Program
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                style={{ background: '#334155', color: '#94a3b8', border: 'none', borderRadius: '8px', padding: '10px 16px', cursor: 'pointer' }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Grid of Programs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        {types.map((t) => (
          <div key={t.id} style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '16px', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <h3 style={{ margin: 0, fontSize: '1.125rem', color: '#f8fafc' }}>{t.name}</h3>
              <span style={{ background: '#6366f122', color: '#6366f1', padding: '4px 10px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600 }}>
                {t.provider_display}
              </span>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '0.875rem', margin: '0 0 16px' }}>Code: <code style={{ color: '#f8fafc' }}>{t.code}</code></p>
            <div style={{ display: 'flex', gap: '16px', fontSize: '0.8rem', borderTop: '1px solid #334155', paddingTop: '12px' }}>
              <span style={{ color: '#cbd5e1' }}>Min CGPA: <strong style={{ color: '#10b981' }}>{t.min_cgpa_requirement}</strong></span>
              <span style={{ color: '#cbd5e1' }}>Income Cap: <strong style={{ color: '#f59e0b' }}>{t.max_family_income ? `₹${t.max_family_income}` : 'None'}</strong></span>
            </div>
          </div>
        ))}
        {types.length === 0 && !loading && <p style={{ color: '#64748b' }}>No scholarship programs created yet.</p>}
      </div>
    </div>
  );
};

export default ScholarshipTypesPage;
