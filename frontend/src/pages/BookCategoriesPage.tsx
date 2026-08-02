import React, { useEffect, useState } from 'react';
import libraryService, { BookCategory } from '../services/libraryService';

export const BookCategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<BookCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', code: '', description: '' });

  const fetchCats = async () => {
    try {
      const data = await libraryService.getCategories();
      setCategories(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCats();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await libraryService.createCategory(formData);
      setShowModal(false);
      setFormData({ name: '', code: '', description: '' });
      fetchCats();
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Failed to create category');
    }
  };

  return (
    <div style={{ padding: '32px', background: '#0f172a', minHeight: '100vh', color: '#f8fafc' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, margin: 0 }}>🏷️ Book Categories</h1>
          <p style={{ color: '#94a3b8', marginTop: '4px' }}>Subject categories and library shelf classifications</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          style={{ background: '#6366f1', color: '#fff', padding: '10px 20px', borderRadius: '10px', border: 'none', fontWeight: 600, cursor: 'pointer' }}
        >
          + Add Category
        </button>
      </div>

      {loading ? (
        <div style={{ color: '#94a3b8', textAlign: 'center', padding: '48px' }}>Loading categories...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
          {categories.map((c) => (
            <div key={c.id} style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <h3 style={{ margin: 0, fontSize: '1.125rem' }}>{c.name}</h3>
                <span style={{ fontSize: '0.75rem', color: '#818cf8', background: '#334155', padding: '2px 8px', borderRadius: '4px', fontFamily: 'monospace' }}>{c.code}</span>
              </div>
              <p style={{ color: '#94a3b8', fontSize: '0.875rem', margin: 0 }}>{c.description || 'No description provided.'}</p>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#1e293b', padding: '32px', borderRadius: '16px', width: '400px', border: '1px solid #334155' }}>
            <h2 style={{ margin: '0 0 20px 0', color: '#f8fafc' }}>Add Category</h2>
            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '16px' }}>
              <input placeholder="Category Name" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} style={inputStyle} />
              <input placeholder="Code (e.g. CS-101)" required value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value })} style={inputStyle} />
              <textarea placeholder="Description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} style={{ ...inputStyle, minHeight: '80px' }} />
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

export default BookCategoriesPage;
