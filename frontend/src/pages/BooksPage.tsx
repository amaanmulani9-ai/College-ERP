import React, { useEffect, useState } from 'react';
import libraryService, { Author, Book, BookCategory, Publisher } from '../services/libraryService';

export const BooksPage: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<BookCategory[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [publishers, setPublishers] = useState<Publisher[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    isbn: '',
    barcode: '',
    title: '',
    author: '',
    category: '',
    publisher: '',
    edition: '1st Edition',
    language: 'English',
    copies: 1,
    shelf_number: '',
  });

  const fetchData = async () => {
    try {
      const [b, c, a, p] = await Promise.all([
        libraryService.getBooks(),
        libraryService.getCategories(),
        libraryService.getAuthors(),
        libraryService.getPublishers(),
      ]);
      setBooks(b);
      setCategories(c);
      setAuthors(a);
      setPublishers(p);
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
      await libraryService.createBook(formData);
      setShowModal(false);
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Failed to add book');
    }
  };

  return (
    <div style={{ padding: '32px', background: '#0f172a', minHeight: '100vh', color: '#f8fafc' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, margin: 0 }}>📚 Book Catalog</h1>
          <p style={{ color: '#94a3b8', marginTop: '4px' }}>Browse, search, and add library book holdings with barcodes & ISBN</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          style={{
            background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
            color: '#fff',
            padding: '10px 20px',
            borderRadius: '10px',
            border: 'none',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          + Add New Book
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', color: '#94a3b8', padding: '48px' }}>Loading books...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {books.map((b) => (
            <div
              key={b.id}
              style={{
                background: '#1e293b',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid #334155',
                position: 'relative',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.75rem', background: '#334155', padding: '2px 8px', borderRadius: '4px', color: '#818cf8', fontWeight: 600 }}>
                  {b.category_name}
                </span>
                <span
                  style={{
                    fontSize: '0.75rem',
                    background: b.available_copies > 0 ? '#10b98122' : '#ef444422',
                    color: b.available_copies > 0 ? '#10b981' : '#ef4444',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontWeight: 600,
                  }}
                >
                  {b.available_copies > 0 ? `${b.available_copies} Available` : 'Out of Stock'}
                </span>
              </div>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '1.125rem', color: '#f8fafc' }}>{b.title}</h3>
              <p style={{ color: '#94a3b8', fontSize: '0.875rem', margin: '0 0 16px 0' }}>By {b.author_name}</p>

              <div style={{ borderTop: '1px solid #334155', pt: '12px', fontSize: '0.75rem', color: '#cbd5e1', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '12px' }}>
                <div><strong>ISBN:</strong> <span style={{ fontFamily: 'monospace' }}>{b.isbn}</span></div>
                <div><strong>Barcode:</strong> <span style={{ fontFamily: 'monospace' }}>{b.barcode}</span></div>
                <div><strong>Shelf:</strong> {b.shelf_number || 'N/A'}</div>
                <div><strong>Copies:</strong> {b.available_copies} / {b.copies}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#1e293b', padding: '32px', borderRadius: '16px', width: '500px', border: '1px solid #334155' }}>
            <h2 style={{ margin: '0 0 20px 0', color: '#f8fafc' }}>Add New Book to Catalog</h2>
            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '12px' }}>
              <input placeholder="Title" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} style={inputStyle} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <input placeholder="ISBN" required value={formData.isbn} onChange={(e) => setFormData({ ...formData, isbn: e.target.value })} style={inputStyle} />
                <input placeholder="Barcode" required value={formData.barcode} onChange={(e) => setFormData({ ...formData, barcode: e.target.value })} style={inputStyle} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <select required value={formData.author} onChange={(e) => setFormData({ ...formData, author: e.target.value })} style={inputStyle}>
                  <option value="">Select Author</option>
                  {authors.map((a) => (<option key={a.id} value={a.id}>{a.name}</option>))}
                </select>
                <select required value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} style={inputStyle}>
                  <option value="">Select Category</option>
                  {categories.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <input placeholder="Shelf Number (e.g. A-101)" value={formData.shelf_number} onChange={(e) => setFormData({ ...formData, shelf_number: e.target.value })} style={inputStyle} />
                <input type="number" placeholder="Copies" min="1" value={formData.copies} onChange={(e) => setFormData({ ...formData, copies: parseInt(e.target.value) })} style={inputStyle} />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                <button type="submit" style={{ flex: 1, background: '#6366f1', color: '#fff', padding: '10px', borderRadius: '8px', border: 'none', fontWeight: 600 }}>Save Book</button>
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

export default BooksPage;
