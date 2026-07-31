import React, { useEffect, useState } from 'react';
import hostelService, { Block, Room } from '../services/hostelService';

export const BlocksRoomsPage: React.FC = () => {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [b, r] = await Promise.all([hostelService.getBlocks(), hostelService.getRooms()]);
        setBlocks(b);
        setRooms(r);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div style={{ padding: '32px', background: '#0f172a', minHeight: '100vh', color: '#f8fafc' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, margin: 0 }}>🛏️ Blocks & Room Inventory</h1>
        <p style={{ color: '#94a3b8', marginTop: '4px' }}>Hostel wing blocks, floor levels, rooms & bed capacity status</p>
      </div>

      {loading ? (
        <div style={{ color: '#94a3b8', textAlign: 'center', padding: '48px' }}>Loading rooms...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {rooms.map((r) => (
            <div key={r.id} style={{ background: '#1e293b', borderRadius: '16px', border: '1px solid #334155', padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.75rem', color: '#818cf8', background: '#334155', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>
                  {r.hostel_name} - {r.block_name}
                </span>
                <span
                  style={{
                    fontSize: '0.75rem',
                    background: r.status === 'available' ? '#10b98122' : r.status === 'full' ? '#ef444422' : '#f59e0b22',
                    color: r.status === 'available' ? '#10b981' : r.status === 'full' ? '#ef4444' : '#f59e0b',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontWeight: 600,
                  }}
                >
                  {r.status_display}
                </span>
              </div>
              <h3 style={{ margin: '0 0 4px 0', fontSize: '1.25rem' }}>Room {r.room_number}</h3>
              <div style={{ fontSize: '0.875rem', color: '#94a3b8', marginBottom: '12px' }}>Type: {r.room_type_display} (Floor {r.floor_number})</div>
              <div style={{ borderTop: '1px solid #334155', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                <span style={{ color: '#cbd5e1' }}>Occupied Beds</span>
                <span style={{ fontWeight: 700, color: '#f8fafc' }}>
                  {r.occupied_beds} / {r.capacity}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BlocksRoomsPage;
