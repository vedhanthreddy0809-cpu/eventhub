import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../api/axios';

const CATS = ['Technology', 'Music', 'Business', 'Design', 'Entertainment', 'Health', 'Sports', 'Education'];

export default function OrganizerEventForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [form, setForm] = useState({ title: '', description: '', date: '', time: '', venue: '', category: 'Technology', price: 0, totalSeats: 100, status: 'upcoming' });
  const [msg, setMsg] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => { if (isEdit) API.get('/events/' + id).then(r => setForm(r.data)); }, [id]);

  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  const submit = async (e) => {
    if (e) e.preventDefault();
    setMsg('');
    if (!form.title || !form.date || !form.venue) return setMsg('Please fill all required fields.');
    setSaving(true);
    try {
      if (isEdit) await API.put('/events/' + id, form);
      else await API.post('/events', form);
      navigate('/organizer');
    } catch (ex) {
      setMsg(ex.response && ex.response.data ? ex.response.data.message : 'Error saving event');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container-narrow fade-in" style={{ padding: 0 }}>
      <button onClick={() => navigate('/organizer')} className="back-btn" style={{ marginBottom: 18 }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
        Back to dashboard
      </button>

      <div className="section-title">
        <div>
          <h2>{isEdit ? 'Edit event' : 'Create a new event'}</h2>
          <p className="muted" style={{ fontSize: 14, marginTop: 4 }}>{isEdit ? 'Update event details and save.' : 'Fill out the basics and publish in seconds.'}</p>
        </div>
      </div>

      <form onSubmit={submit} className="card card-pad">
        {msg && (
          <div className="alert alert-error" style={{ marginBottom: 16 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" /></svg>
            {msg}
          </div>
        )}

        <div className="stack" style={{ gap: 16 }}>
          <div>
            <label className="label">Event title *</label>
            <input placeholder="e.g. Annual Tech Conference 2026" value={form.title} onChange={set('title')} />
          </div>

          <div>
            <label className="label">Description</label>
            <textarea rows={4} style={{ resize: 'vertical' }} placeholder="Tell attendees what to expect…" value={form.description} onChange={set('description')} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div>
              <label className="label">Date *</label>
              <input type="date" value={form.date} onChange={set('date')} />
            </div>
            <div>
              <label className="label">Time</label>
              <input type="time" value={form.time} onChange={set('time')} />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label className="label">Venue *</label>
              <input placeholder="Where is it happening?" value={form.venue} onChange={set('venue')} />
            </div>
            <div>
              <label className="label">Category</label>
              <select value={form.category} onChange={set('category')}>
                {CATS.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Status</label>
              <select value={form.status} onChange={set('status')}>
                <option value="upcoming">Upcoming</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div>
              <label className="label">Price (₹) — 0 for free</label>
              <input type="number" min="0" value={form.price} onChange={set('price')} />
            </div>
            <div>
              <label className="label">Total seats</label>
              <input type="number" min="1" value={form.totalSeats} onChange={set('totalSeats')} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
            <button type="button" onClick={() => navigate('/organizer')} className="btn btn-ghost" style={{ flex: 1 }}>Cancel</button>
            <button type="submit" disabled={saving} className="btn btn-primary" style={{ flex: 2 }}>
              {saving ? 'Saving…' : (isEdit ? 'Update event' : 'Publish event')}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
