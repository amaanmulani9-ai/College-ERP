import React, { useEffect, useState } from 'react';
import hostelService from '../services/hostelService';

export const VacancyReportPage: React.FC = () => {
  const [vacant, setVacant] = useState<any[]>([]);
  const [occupied, setOccupied] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [v, o] = await Promise.all([hostelService.getVacantRooms(), hostelService.getOccupiedRooms()]);
        setVacant(v);
        setOccupied(o);
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
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, margin: 0 }}>📊 Hostel Vacancy & Occupancy Report</h1>
        <p style={{ color: '#94a3b8', marginTop: '4px' }}>Real-time breakdown of available vs occupied rooms across campus hostels</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
        {/* Vacant Rooms */}
        <div style={{ background: '#1e293b', border: '1px solid #10b98133', borderRadius: '16px', padding: '24px' }}>
          <h2 style={{ margin: '0 0 16px 0', fontSize: '1.25rem', color: '#10b981' }}>Vacant Rooms ({vacant.length})</h2>
          {loading ? (
            <div style={{ color: '#94a3b8' }}>Loading...</div>
          ) : (
            <div style={{ display: 'grid', gap: '12px' }}>
              {vacant.map((r) => (
                <div key={r.id} style={{ background: '#0f172a', padding: '16px', borderRadius: '12px', border: '1px solid #334155' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 600 }}>Room {r.room_number}</span>
                    <span style={{ color: '#10b981', fontSize: '0.875rem' }}>{r.capacity - r.occupied_beds} Beds Available</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                    {r.floor__block__hostel__name} - {r.floor__block__name} (Floor {r.floor__floor_number})
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Occupied Rooms */}
        <div style={{ background: '#1e293b', border: '1px solid #3b82f633', borderRadius: '16px', padding: '24px' }}>
          <h2 style={{ margin: '0 0 16px 0', fontSize: '1.25rem', color: '#3b82f6' }}>Occupied Rooms ({occupied.length})</h2>
          {loading ? (
            <div style={{ color: '#94a3b8' }}>Loading...</div>
          ) : (
            <div style={{ display: 'grid', gap: '12px' }}>
              {occupied.map((r) => (
                <div key={r.id} style={{ background: '#0f172a', padding: '16px', borderRadius: '12px', border: '1px solid #334155' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 600 }}>Room {r.room_number}</span>
                    <span style={{ color: '#3b82f6', fontSize: '0.875rem' }}>{r.occupied_beds} / {r.capacity} Occupied</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                    {r.floor__block__hostel__name} - {r.floor__block__name} (Floor {r.floor__floor_number})
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VacancyReportPage;
