import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'attendee' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    if (e) e.preventDefault();
    setError(''); setLoading(true);
    try {
      const data = await register(form.name, form.email, form.password, form.role);
      navigate(data.role === 'organizer' ? '/organizer' : '/');
    } catch (ex) {
      setError(ex.response && ex.response.data ? ex.response.data.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const roleCard = (value, title, desc) => {
    const selected = form.role === value;
    return (
      <div onClick={() => setForm(p => ({ ...p, role: value }))} className={'role-card' + (selected ? ' role-card-active' : '')}>
        <p className="t">{title}</p>
        <p className="d">{desc}</p>
      </div>
    );
  };

  return (
    <div className="auth-shell">
      <form onSubmit={submit} className="card auth-card fade-in">
        <h2>Create your account</h2>
        <p className="auth-sub">Join EventHub in under a minute.</p>

        {error && (
          <div className="alert alert-error" style={{ marginBottom: 14 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" /></svg>
            {error}
          </div>
        )}

        <div className="stack">
          <div>
            <label className="label">Full name</label>
            <input placeholder="Jane Doe" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
          </div>
          <div>
            <label className="label">Email</label>
            <input type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
          </div>
          <div>
            <label className="label">Password</label>
            <input type="password" placeholder="At least 8 characters" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} />
          </div>
          <div>
            <label className="label">I want to</label>
            <div className="role-grid">
              {roleCard('attendee', 'Attend events', 'Browse & book seats')}
              {roleCard('organizer', 'Host events', 'Publish & manage')}
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary btn-block" style={{ marginTop: 6 }}>
            {loading ? 'Creating…' : 'Create account'}
          </button>
        </div>

        <p style={{ textAlign: 'center', fontSize: 13, marginTop: 22, color: 'var(--text-dim)' }}>
          Already a member? <Link to="/login" className="link">Sign in</Link>
        </p>
      </form>
    </div>
  );
}
