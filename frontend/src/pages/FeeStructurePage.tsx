import React, { useEffect, useState } from 'react';
import feeService, { FeeCategory, FeeStructure } from '../services/feeService';

const FeeStructurePage: React.FC = () => {
  const [structures, setStructures] = useState<FeeStructure[]>([]);
  const [categories, setCategories] = useState<FeeCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newCat, setNewCat] = useState({ name: '', code: '', is_active: true });
  const [catMsg, setCatMsg] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const [s, c] = await Promise.all([
          feeService.getStructures(),
          feeService.getCategories(),
        ]);
        setStructures(s.results || []);
        setCategories(c.results || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = await feeService.createCategory(newCat);
      setCategories((prev) => [...prev, created]);
      setNewCat({ name: '', code: '', is_active: true });
      setShowForm(false);
      setCatMsg('Category created successfully!');
      setTimeout(() => setCatMsg(''), 3000);
    } catch (err: any) {
      setCatMsg(err?.response?.data?.detail || 'Failed to create category');
    }
  };

  const fmt = (n: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

  return (
    <div style={{ padding: '32px', background: '#0f172a', minHeight: '100vh', color: '#f8fafc' }}>
      <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#f8fafc', margin: 0 }}>
            📋 Fee Structure
          </h1>
          <p style={{ color: '#94a3b8', marginTop: '8px' }}>Manage fee categories and program-semester fee structures</p>
        </div>
        <button
          id="btn-new-category"
          onClick={() => setShowForm(true)}
          style={{
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            color: '#fff',
            border: 'none',
            borderRadius: '10px',
            padding: '12px 20px',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '0.875rem',
          }}
        >
          + New Category
        </button>
      </div>

      {catMsg && (
        <div style={{
          background: catMsg.includes('success') ? '#10b98122' : '#ef444422',
          border: `1px solid ${catMsg.includes('success') ? '#10b981' : '#ef4444'}`,
          borderRadius: '10px',
          padding: '12px 16px',
          marginBottom: '16px',
          color: catMsg.includes('success') ? '#10b981' : '#ef4444',
        }}>
          {catMsg}
        </div>
      )}

      {showForm && (
        <div style={{
          background: '#1e293b',
          border: '1px solid #334155',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '24px',
        }}>
          <h3 style={{ margin: '0 0 16px', color: '#f8fafc' }}>Create Fee Category</h3>
          <form onSubmit={handleCreateCategory} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <div>
              <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.75rem', marginBottom: '4px' }}>Name</label>
              <input
                id="cat-name"
                value={newCat.name}
                onChange={(e) => setNewCat({ ...newCat, name: e.target.value })}
                placeholder="e.g. Tuition Fee"
                required
                style={{
                  background: '#0f172a',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  padding: '10px 14px',
                  color: '#f8fafc',
                  width: '200px',
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.75rem', marginBottom: '4px' }}>Code</label>
              <input
                id="cat-code"
                value={newCat.code}
                onChange={(e) => setNewCat({ ...newCat, code: e.target.value.toUpperCase() })}
                placeholder="e.g. TUITION"
                required
                style={{
                  background: '#0f172a',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  padding: '10px 14px',
                  color: '#f8fafc',
                  width: '150px',
                }}
              />
            </div>
            <button
              type="submit"
              id="btn-create-category-submit"
              style={{
                background: 'linear-gradient(135deg, #10b981, #059669)',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                padding: '10px 20px',
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              Create
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              style={{
                background: '#334155',
                color: '#94a3b8',
                border: 'none',
                borderRadius: '8px',
                padding: '10px 16px',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
          </form>
        </div>
      )}

      {/* Categories */}
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ color: '#cbd5e1', fontSize: '1rem', marginBottom: '12px' }}>Fee Categories</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {categories.map((c) => (
            <div
              key={c.id}
              style={{
                background: '#1e293b',
                border: `1px solid ${c.is_active ? '#6366f133' : '#334155'}`,
                borderRadius: '10px',
                padding: '10px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span style={{ color: '#f8fafc', fontWeight: 600 }}>{c.name}</span>
              <code style={{ color: '#94a3b8', fontSize: '0.75rem' }}>{c.code}</code>
              <span style={{
                background: c.is_active ? '#10b98122' : '#6b728022',
                color: c.is_active ? '#10b981' : '#6b7280',
                padding: '2px 8px',
                borderRadius: '999px',
                fontSize: '0.7rem',
              }}>
                {c.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>
          ))}
          {categories.length === 0 && <p style={{ color: '#64748b' }}>No categories yet.</p>}
        </div>
      </div>

      {/* Structures Table */}
      <div style={{ background: '#1e293b', borderRadius: '16px', border: '1px solid #334155', overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #334155' }}>
          <h2 style={{ margin: 0, color: '#f8fafc', fontSize: '1.125rem' }}>Fee Structures</h2>
        </div>
        {loading ? (
          <div style={{ padding: '48px', textAlign: 'center', color: '#94a3b8' }}>Loading...</div>
        ) : structures.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center', color: '#94a3b8' }}>No fee structures configured.</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#0f172a' }}>
                  {['Category', 'Program', 'Semester', 'Session', 'Amount', 'Status'].map((h) => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {structures.map((s) => (
                  <tr key={s.id} style={{ borderTop: '1px solid #334155' }}>
                    <td style={{ padding: '14px 16px', color: '#f8fafc' }}>{s.category_detail?.name || s.category}</td>
                    <td style={{ padding: '14px 16px', color: '#cbd5e1' }}>{s.program}</td>
                    <td style={{ padding: '14px 16px', color: '#cbd5e1' }}>{s.semester}</td>
                    <td style={{ padding: '14px 16px', color: '#94a3b8' }}>{s.academic_session}</td>
                    <td style={{ padding: '14px 16px', color: '#10b981', fontWeight: 600 }}>{fmt(s.amount)}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{
                        background: s.is_active ? '#10b98122' : '#6b728022',
                        color: s.is_active ? '#10b981' : '#6b7280',
                        padding: '4px 10px',
                        borderRadius: '999px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                      }}>
                        {s.is_active ? 'Active' : 'Inactive'}
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

export default FeeStructurePage;
