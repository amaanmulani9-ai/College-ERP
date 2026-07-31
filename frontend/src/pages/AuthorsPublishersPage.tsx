import React, { useEffect, useState } from 'react';
import libraryService, { Author, Publisher } from '../services/libraryService';

export const AuthorsPublishersPage: React.FC = () => {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [publishers, setPublishers] = useState<Publisher[]>([]);
  const [loading, setLoading] = useState(true);

  const [authorName, setAuthorName] = useState('');
  const [publisherName, setPublisherName] = useState('');

  const loadAll = async () => {
    try {
      const [a, p] = await Promise.all([libraryService.getAuthors(), libraryService.getPublishers()]);
      setAuthors(a);
      setPublishers(p);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const handleAddAuthor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName) return;
    try {
      await libraryService.createAuthor({ name: authorName });
      setAuthorName('');
      loadAll();
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Failed to add author');
    }
  };

  const handleAddPublisher = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!publisherName) return;
    try {
      await libraryService.createPublisher({ name: publisherName });
      setPublisherName('');
      loadAll();
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Failed to add publisher');
    }
  };

  return (
    <div style={{ padding: '32px', background: '#0f172a', minHeight: '100vh', color: '#f8fafc' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, margin: 0 }}>✍️ Authors & Publishers Directory</h1>
        <p style={{ color: '#94a3b8', marginTop: '4px' }}>Manage author biographies and publisher contacts</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
        {/* Authors Section */}
        <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '16px', padding: '24px' }}>
          <h2 style={{ margin: '0 0 16px 0', fontSize: '1.25rem' }}>Authors ({authors.length})</h2>
          <form onSubmit={handleAddAuthor} style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
            <input
              placeholder="New Author Name"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              style={{ background: '#0f172a', border: '1px solid #334155', color: '#f8fafc', padding: '10px', borderRadius: '8px', flex: 1 }}
            />
            <button type="submit" style={{ background: '#6366f1', color: '#fff', padding: '10px 16px', borderRadius: '8px', border: 'none', fontWeight: 600 }}>+ Add</button>
          </form>

          <div style={{ display: 'grid', gap: '8px' }}>
            {authors.map((a) => (
              <div key={a.id} style={{ background: '#0f172a', padding: '12px 16px', borderRadius: '8px', color: '#f8fafc', fontWeight: 600 }}>
                {a.name}
              </div>
            ))}
          </div>
        </div>

        {/* Publishers Section */}
        <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '16px', padding: '24px' }}>
          <h2 style={{ margin: '0 0 16px 0', fontSize: '1.25rem' }}>Publishers ({publishers.length})</h2>
          <form onSubmit={handleAddPublisher} style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
            <input
              placeholder="New Publisher Name"
              value={publisherName}
              onChange={(e) => setPublisherName(e.target.value)}
              style={{ background: '#0f172a', border: '1px solid #334155', color: '#f8fafc', padding: '10px', borderRadius: '8px', flex: 1 }}
            />
            <button type="submit" style={{ background: '#10b981', color: '#fff', padding: '10px 16px', borderRadius: '8px', border: 'none', fontWeight: 600 }}>+ Add</button>
          </form>

          <div style={{ display: 'grid', gap: '8px' }}>
            {publishers.map((p) => (
              <div key={p.id} style={{ background: '#0f172a', padding: '12px 16px', borderRadius: '8px', color: '#f8fafc', fontWeight: 600 }}>
                {p.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthorsPublishersPage;
