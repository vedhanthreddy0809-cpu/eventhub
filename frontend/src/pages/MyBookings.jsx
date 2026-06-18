import { useEffect, useState } from 'react';
import API from '../api/axios';

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/bookings/my')
      .then(r => setBookings(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const cancel = async (id) => {
    if (!window.confirm('Cancel this booking?')) return;
    await API.put('/bookings/' + id + '/cancel');
    setBookings(p => p.map(b => b._id === id ? { ...b, status: 'cancelled' } : b));
  };

  return (
    <div className="fade-in">
      <div className="section-title">
        <div>
          <h2>My bookings</h2>
          <p className="muted" style={{ fontSize: 14, marginTop: 4 }}>Manage your tickets and reservations.</p>
        </div>
      </div>

      {loading && <p className="muted" style={{ padding: 40, textAlign: 'center' }}>Loading…</p>}

      {!loading && bookings.length === 0 && (
        <div className="empty">
          <div className="empty-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14V6a2 2 0 00-2-2H7a2 2 0 00-2 2v8M19 14l-3 6H8l-3-6M19 14H5" /></svg>
          </div>
          <p style={{ fontSize: 15, color: 'var(--text-dim)' }}>No bookings yet.</p>
          <p style={{ fontSize: 13, marginTop: 6 }}>Browse events and grab your seat.</p>
        </div>
      )}

      <div className="stack" style={{ gap: 14 }}>
        {bookings.map(b => (
          <div key={b._id} className="card card-pad" style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 18, alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: 16, marginBottom: 8 }}>{b.event && b.event.title}</h3>
              <div className="stack" style={{ gap: 6 }}>
                <p className="event-meta">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>
                  {b.event && b.event.date}
                </p>
                <p className="event-meta">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>
                  {b.event && b.event.venue}
                </p>
                <p className="event-meta">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 9h18M3 4h18v16H3z" /></svg>
                  Seats <span style={{ color: 'var(--text)', fontWeight: 600 }}>{b.seats.join(', ')}</span>
                </p>
              </div>
            </div>

            <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10 }}>
              <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 22, fontWeight: 700 }}>{b.amount === 0 ? 'Free' : '₹' + b.amount}</p>
              <span className={'badge ' + (b.status === 'confirmed' ? 'badge-success' : 'badge-danger')}>{b.status}</span>
              {b.status === 'confirmed' && (
                <button onClick={() => cancel(b._id)} className="btn btn-danger-outline btn-sm">Cancel booking</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
