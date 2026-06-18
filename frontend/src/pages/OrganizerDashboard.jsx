import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

const statusBadge = (status) => {
  if (status === 'ongoing') return 'badge badge-success';
  if (status === 'upcoming') return 'badge badge-primary';
  if (status === 'completed') return 'badge badge-muted';
  return 'badge badge-muted';
};

export default function OrganizerDashboard() {
  const [events, setEvents] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [tab, setTab] = useState('events');
  const navigate = useNavigate();

  useEffect(() => {
    API.get('/events').then(r => setEvents(r.data));
    API.get('/bookings').then(r => setBookings(r.data));
  }, []);

  const del = async (id) => {
    if (!window.confirm('Delete this event?')) return;
    await API.delete('/events/' + id);
    setEvents(p => p.filter(e => e._id !== id));
  };

  const totalSold = events.reduce((a, e) => a + e.bookedSeats, 0);
  const stats = [
    { label: 'Total events', value: events.length, cls: 'stat-1', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg> },
    { label: 'Live now', value: events.filter(e => e.status === 'ongoing').length, cls: 'stat-2', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 11-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06A1.65 1.65 0 004.6 15a1.65 1.65 0 00-1.51-1H3a2 2 0 110-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06A1.65 1.65 0 009 4.6 1.65 1.65 0 0010 3.09V3a2 2 0 114 0v.09A1.65 1.65 0 0015 4.6a1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 110 4h-.09a1.65 1.65 0 00-1.51 1z" /></svg> },
    { label: 'Bookings', value: bookings.length, cls: 'stat-3', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10V8a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H8a2 2 0 00-2 2v2H5a2 2 0 00-2 2v2c0 1 .5 2 2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6c1.5 0 2-1 2-2z" /></svg> },
    { label: 'Seats sold', value: totalSold, cls: 'stat-4', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14V6a2 2 0 00-2-2H7a2 2 0 00-2 2v8M19 14l-3 6H8l-3-6M19 14H5" /></svg> },
  ];

  return (
    <div className="fade-in">
      <div className="section-title">
        <div>
          <h2>Organizer dashboard</h2>
          <p className="muted" style={{ fontSize: 14, marginTop: 4 }}>Manage events, track bookings & seat sales.</p>
        </div>
        <button onClick={() => navigate('/organizer/events/new')} className="btn btn-primary">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
          New event
        </button>
      </div>

      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', marginBottom: 30 }}>
        {stats.map(s => (
          <div key={s.label} className={'stat ' + s.cls}>
            <div className="stat-icon">{s.icon}</div>
            <p className="stat-label">{s.label}</p>
            <p className="stat-value">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="tabs" style={{ marginBottom: 18 }}>
        {['events', 'bookings'].map(t => (
          <button key={t} onClick={() => setTab(t)} className={'tab' + (tab === t ? ' tab-active' : '')}>{t.charAt(0).toUpperCase() + t.slice(1)}</button>
        ))}
      </div>

      {tab === 'events' && (
        <div className="stack" style={{ gap: 12 }}>
          {events.map(ev => (
            <div key={ev._id} className="card card-pad" style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 18, alignItems: 'center', padding: '16px 20px' }}>
              <div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
                  <h3 style={{ fontSize: 15 }}>{ev.title}</h3>
                  <span className={statusBadge(ev.status)}>{ev.status}</span>
                </div>
                <p className="event-meta">{ev.date} · {ev.venue} · <span style={{ color: 'var(--text)', fontWeight: 600 }}>{ev.bookedSeats}/{ev.totalSeats}</span> booked</p>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <strong style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 17, minWidth: 60, textAlign: 'right' }}>{ev.price === 0 ? 'Free' : '₹' + ev.price}</strong>
                <button onClick={() => navigate('/organizer/events/edit/' + ev._id)} className="btn btn-ghost btn-sm">Edit</button>
                <button onClick={() => del(ev._id)} className="btn btn-danger-outline btn-sm">Delete</button>
              </div>
            </div>
          ))}
          {events.length === 0 && (
            <div className="empty">
              <div className="empty-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>
              </div>
              <p style={{ fontSize: 15, color: 'var(--text-dim)' }}>No events yet.</p>
              <p style={{ fontSize: 13, marginTop: 6 }}>Click "New event" to create your first one.</p>
            </div>
          )}
        </div>
      )}

      {tab === 'bookings' && (
        <div className="stack" style={{ gap: 12 }}>
          {bookings.map(b => (
            <div key={b._id} className="card card-pad" style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 18, alignItems: 'center', padding: '16px 20px' }}>
              <div>
                <h3 style={{ fontSize: 15, marginBottom: 5 }}>{b.event && b.event.title}</h3>
                <p className="event-meta">User <span style={{ color: 'var(--text)', fontWeight: 600 }}>{b.user && b.user.name}</span> · Seats <span style={{ color: 'var(--text)', fontWeight: 600 }}>{b.seats.join(', ')}</span></p>
              </div>
              <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                <strong style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 17 }}>{b.amount === 0 ? 'Free' : '₹' + b.amount}</strong>
                <span className={'badge ' + (b.status === 'confirmed' ? 'badge-success' : 'badge-danger')}>{b.status}</span>
              </div>
            </div>
          ))}
          {bookings.length === 0 && (
            <div className="empty">
              <div className="empty-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M19 14V6a2 2 0 00-2-2H7a2 2 0 00-2 2v8M19 14l-3 6H8l-3-6M19 14H5" /></svg>
              </div>
              <p style={{ fontSize: 15, color: 'var(--text-dim)' }}>No bookings yet.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
