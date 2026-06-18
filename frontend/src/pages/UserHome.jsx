import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

const CATS = ['All', 'Technology', 'Music', 'Business', 'Design', 'Entertainment', 'Health'];
const STATUSES = ['All', 'upcoming', 'ongoing', 'completed'];

const CAT_GRADIENTS = {
  Technology: 'linear-gradient(135deg, #6366f1, #06b6d4)',
  Music: 'linear-gradient(135deg, #ec4899, #f97316)',
  Business: 'linear-gradient(135deg, #475569, #1e293b)',
  Design: 'linear-gradient(135deg, #f59e0b, #ec4899)',
  Entertainment: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
  Health: 'linear-gradient(135deg, #10b981, #06b6d4)',
  Sports: 'linear-gradient(135deg, #ef4444, #f59e0b)',
  Education: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
};

const statusBadge = (status) => {
  if (status === 'ongoing') return 'badge badge-success';
  if (status === 'upcoming') return 'badge badge-primary';
  if (status === 'completed') return 'badge badge-muted';
  return 'badge badge-muted';
};

export default function UserHome() {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [status, setStatus] = useState('All');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (search) params.search = search;
    if (category !== 'All') params.category = category;
    if (status !== 'All') params.status = status;
    API.get('/events', { params })
      .then(r => setEvents(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [search, category, status]);

  return (
    <div>
      <section className="hero">
        <span className="eyebrow"><span className="dot" /> Discover what's happening now</span>
        <h1>Find events that move you.</h1>
        <p className="lead">Concerts, conferences, workshops & meetups — all in one place. Book your seat in seconds.</p>

        <div className="search-wrap">
          <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></svg>
          <input placeholder="Search by event, venue, or organizer..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </section>

      <div style={{ marginBottom: 14 }}>
        <p className="label" style={{ marginBottom: 10 }}>Categories</p>
        <div className="row">
          {CATS.map(c => (
            <button key={c} onClick={() => setCategory(c)} className={'chip' + (category === c ? ' chip-active' : '')}>{c}</button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 28 }}>
        <p className="label" style={{ marginBottom: 10 }}>Status</p>
        <div className="row">
          {STATUSES.map(s => (
            <button key={s} onClick={() => setStatus(s)} className={'chip' + (status === s ? ' chip-success-active' : '')}>{s === 'All' ? 'All status' : s}</button>
          ))}
        </div>
      </div>

      {loading && <p className="muted" style={{ padding: '40px 0', textAlign: 'center' }}>Loading events…</p>}

      {!loading && events.length === 0 && (
        <div className="empty">
          <div className="empty-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></svg>
          </div>
          <p style={{ fontSize: 15, color: 'var(--text-dim)' }}>No events match your filters.</p>
          <p style={{ fontSize: 13, marginTop: 6 }}>Try clearing search or picking a different category.</p>
        </div>
      )}

      {!loading && events.length > 0 && (
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
          {events.map(ev => {
            const avail = ev.totalSeats - ev.bookedSeats;
            const pct = Math.min(100, Math.round((ev.bookedSeats / Math.max(ev.totalSeats, 1)) * 100));
            return (
              <article key={ev._id} onClick={() => navigate('/events/' + ev._id)} className="card card-hover event-card">
                <div className="event-thumb" style={{ background: CAT_GRADIENTS[ev.category] || 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                  <div className="event-thumb-label">
                    <span className={statusBadge(ev.status)}>{ev.status}</span>
                    <span className="badge badge-muted" style={{ background: 'rgba(0,0,0,0.35)', borderColor: 'rgba(255,255,255,0.15)', color: '#fff' }}>{ev.category}</span>
                  </div>
                </div>
                <div className="event-body">
                  <h3 className="event-title">{ev.title}</h3>
                  <p className="event-meta">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>
                    {ev.venue}
                  </p>
                  <p className="event-meta">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>
                    {ev.date} · {ev.time}
                  </p>
                  <div className={'progress' + (pct > 85 ? ' warn' : '')}><div style={{ width: pct + '%' }} /></div>
                  <div className="event-footer">
                    <span className="event-meta" style={{ fontSize: 12.5 }}>{avail} seats left</span>
                    <span className="price">{ev.price === 0 ? 'Free' : '₹' + ev.price}</span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
