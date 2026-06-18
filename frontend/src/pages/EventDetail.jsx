import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

const ROWS = ['A','B','C','D','E','F','G','H'];
const PER = 8;

const statusBadge = (status) => {
  if (status === 'ongoing') return 'badge badge-success';
  if (status === 'upcoming') return 'badge badge-primary';
  return 'badge badge-muted';
};

export default function EventDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [seats, setSeats] = useState([]);
  const [selected, setSelected] = useState([]);
  const [msg, setMsg] = useState({ text: '', ok: false });

  useEffect(() => {
    API.get('/events/' + id).then(r => {
      const ev = r.data;
      setEvent(ev);
      const booked = Math.round((ev.bookedSeats / Math.max(ev.totalSeats, 1)) * ROWS.length * PER);
      let cnt = 0;
      setSeats(ROWS.flatMap(row => Array.from({ length: PER }, (_, i) => {
        const sid = row + (i + 1);
        const isBooked = cnt < booked && Math.random() > 0.5;
        if (isBooked) cnt++;
        return { id: sid, booked: isBooked };
      })));
    });
  }, [id]);

  if (!event) return <p className="muted" style={{ padding: 40, textAlign: 'center' }}>Loading event details…</p>;

  const toggle = (s) => {
    if (s.booked) return;
    setSelected(p => p.includes(s.id) ? p.filter(x => x !== s.id) : [...p, s.id]);
  };

  const book = async () => {
    if (!user) return navigate('/login');
    if (!selected.length) return setMsg({ text: 'Please select at least one seat.', ok: false });
    try {
      await API.post('/bookings', { eventId: event._id, seats: selected });
      setMsg({ text: 'Booking confirmed! Check My Bookings.', ok: true });
      setSelected([]);
    } catch (e) {
      setMsg({ text: e.response && e.response.data ? e.response.data.message : 'Booking failed', ok: false });
    }
  };

  const total = selected.length * event.price;

  return (
    <div className="fade-in">
      <button onClick={() => navigate(-1)} className="back-btn" style={{ marginBottom: 20 }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
        Back
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.1fr) minmax(0, 1fr)', gap: 32, alignItems: 'start' }}>
        <div className="card card-pad">
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
            <span className={statusBadge(event.status)}>{event.status}</span>
            <span className="badge badge-muted">{event.category}</span>
          </div>
          <h2 style={{ marginBottom: 14 }}>{event.title}</h2>

          <div className="stack" style={{ gap: 10, marginBottom: 22 }}>
            <p className="event-meta" style={{ fontSize: 14 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>
              {event.venue}
            </p>
            <p className="event-meta" style={{ fontSize: 14 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>
              {event.date} · {event.time}
            </p>
          </div>

          <p style={{ lineHeight: 1.7, color: 'var(--text-dim)', marginBottom: 22 }}>{event.description}</p>

          <div className="row" style={{ gap: 10 }}>
            {[
              ['Price', event.price === 0 ? 'Free' : '₹' + event.price],
              ['Available', event.totalSeats - event.bookedSeats],
              ['Selected', selected.length],
            ].map(item => (
              <div key={item[0]} style={{ flex: 1, padding: '14px 16px', borderRadius: 12, background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)' }}>
                <p className="label" style={{ marginBottom: 4 }}>{item[0]}</p>
                <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 20, fontWeight: 700 }}>{item[1]}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="card card-pad">
          <h3 style={{ marginBottom: 14 }}>Pick your seats</h3>
          <div className="stage">STAGE</div>

          <div className="seat-grid" style={{ gridTemplateColumns: `repeat(${PER}, 1fr)` }}>
            {seats.map(s => {
              const cls = s.booked ? 'seat seat-booked' : selected.includes(s.id) ? 'seat seat-selected' : 'seat seat-available';
              return <div key={s.id} onClick={() => toggle(s)} title={s.id} className={cls}>{s.id}</div>;
            })}
          </div>

          <div className="legend">
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><span className="legend-swatch" style={{ background: 'rgba(139, 92, 246, 0.14)', border: '1px solid rgba(139, 92, 246, 0.22)' }} />Available</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><span className="legend-swatch" style={{ background: 'var(--gradient)' }} />Selected</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><span className="legend-swatch" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)' }} />Booked</span>
          </div>

          {selected.length > 0 && (
            <div style={{ marginTop: 16, padding: 14, borderRadius: 12, background: 'var(--gradient-soft)', border: '1px solid var(--border)' }}>
              <p style={{ fontSize: 13, color: 'var(--text-dim)', marginBottom: 4 }}>Seats: <span style={{ color: 'var(--text)', fontWeight: 600 }}>{selected.join(', ')}</span></p>
              <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 18, fontWeight: 700 }}>Total: {event.price === 0 ? 'Free' : '₹' + total}</p>
            </div>
          )}

          {msg.text && (
            <div className={'alert ' + (msg.ok ? 'alert-success' : 'alert-error')} style={{ marginTop: 12 }}>
              {msg.text}
            </div>
          )}

          <button onClick={book} className="btn btn-primary btn-block" style={{ marginTop: 16 }}>
            {user ? 'Confirm booking' : 'Login to book'}
          </button>
        </div>
      </div>
    </div>
  );
}
