import React, { useEffect, useState } from 'react';
import hostelService, { Hostel, HostelAllocation, MaintenanceRequest, Room, Visitor } from '../services/hostelService';

export const HostelDashboardPage: React.FC = () => {
  const [hostels, setHostels] = useState<Hostel[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [allocations, setAllocations] = useState<HostelAllocation[]>([]);
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [maintenance, setMaintenance] = useState<MaintenanceRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [hList, rList, aList, vList, mList] = await Promise.all([
          hostelService.getHostels(),
          hostelService.getRooms(),
          hostelService.getAllocations(),
          hostelService.getVisitors(),
          hostelService.getMaintenanceRequests(),
        ]);
        setHostels(hList);
        setRooms(rList);
        setAllocations(aList);
        setVisitors(vList);
        setMaintenance(mList);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const totalCapacity = rooms.reduce((sum, r) => sum + r.capacity, 0);
  const totalOccupied = rooms.reduce((sum, r) => sum + r.occupied_beds, 0);
  const activeAllocations = allocations.filter((a) => a.status === 'allocated' || a.status === 'checked_in').length;
  const pendingMaintenance = maintenance.filter((m) => m.status === 'pending').length;

  return (
    <div style={{ padding: '32px', background: '#0f172a', minHeight: '100vh', color: '#f8fafc' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, margin: 0 }}>🏢 Hostel Management Dashboard</h1>
        <p style={{ color: '#94a3b8', marginTop: '8px' }}>
          Overview of hostel buildings, room occupancy, student bed allocations, visitor registers & maintenance tickets
        </p>
      </div>

      {/* KPI Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        {[
          { label: 'Hostel Buildings', value: hostels.length, icon: '🏢', color: '#6366f1' },
          { label: 'Bed Occupancy', value: `${totalOccupied} / ${totalCapacity}`, icon: '🛏️', color: '#10b981' },
          { label: 'Active Resident Students', value: activeAllocations, icon: '👨‍🎓', color: '#3b82f6' },
          { label: 'Pending Maintenance', value: pendingMaintenance, icon: '🔧', color: '#f59e0b' },
        ].map((c) => (
          <div
            key={c.label}
            style={{
              background: 'linear-gradient(135deg, #1e293b, #0f172a)',
              borderRadius: '16px',
              padding: '24px',
              border: `1px solid ${c.color}33`,
              boxShadow: `0 0 20px ${c.color}22`,
            }}
          >
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>{c.icon}</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 700, color: c.color }}>{c.value}</div>
            <div style={{ color: '#94a3b8', fontSize: '0.875rem', marginTop: '4px' }}>{c.label}</div>
          </div>
        ))}
      </div>

      {/* Recent Allocations Table */}
      <div style={{ background: '#1e293b', borderRadius: '16px', border: '1px solid #334155', overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #334155' }}>
          <h2 style={{ margin: 0, fontSize: '1.125rem', color: '#f8fafc' }}>Recent Hostel Allocations</h2>
        </div>
        {loading ? (
          <div style={{ padding: '48px', textAlign: 'center', color: '#94a3b8' }}>Loading allocations...</div>
        ) : allocations.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center', color: '#94a3b8' }}>No active hostel allocations recorded.</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#0f172a' }}>
                  {['Student ID', 'Student Name', 'Room / Bed', 'Check In Date', 'Status'].map((h) => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {allocations.slice(0, 10).map((a) => (
                  <tr key={a.id} style={{ borderTop: '1px solid #334155' }}>
                    <td style={{ padding: '14px 16px', color: '#6366f1', fontFamily: 'monospace' }}>{a.student_id_str}</td>
                    <td style={{ padding: '14px 16px', color: '#f8fafc', fontWeight: 600 }}>{a.student_name}</td>
                    <td style={{ padding: '14px 16px', color: '#cbd5e1' }}>Room {a.room_number} (Bed {a.bed_number})</td>
                    <td style={{ padding: '14px 16px', color: '#cbd5e1' }}>{a.check_in_date || 'Pending'}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <span
                        style={{
                          background: a.status === 'checked_in' ? '#10b98122' : a.status === 'allocated' ? '#3b82f622' : '#94a3b822',
                          color: a.status === 'checked_in' ? '#10b981' : a.status === 'allocated' ? '#3b82f6' : '#94a3b8',
                          padding: '4px 10px',
                          borderRadius: '999px',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          textTransform: 'capitalize',
                        }}
                      >
                        {a.status_display}
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

export default HostelDashboardPage;
