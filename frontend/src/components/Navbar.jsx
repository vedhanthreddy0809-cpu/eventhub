import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const handleLogout = () => { logout(); navigate('/login'); };

  const link = (to, label) => (
    <Link key={to} to={to} className={'nav-link' + (pathname === to ? ' nav-link-active' : '')} style={pathname === to ? { color: '#fff', background: 'rgba(139,92,246,0.14)' } : undefined}>
      {label}
    </Link>
  );

  const initials = (user && user.name) ? user.name.trim().split(/\s+/).slice(0, 2).map(s => s[0].toUpperCase()).join('') : '';

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="brand">
          <span className="brand-mark">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>
          </span>
          EventHub
        </Link>

        <div className="nav-links">
          {!user && (
            <>
              {link('/', 'Explore')}
              {link('/login', 'Login')}
              <Link to="/register" className="btn btn-primary btn-sm" style={{ marginLeft: 6 }}>Get Started</Link>
            </>
          )}
          {user && user.role === 'attendee' && (
            <>
              {link('/', 'Explore')}
              {link('/my-bookings', 'My Bookings')}
            </>
          )}
          {user && user.role === 'organizer' && (
            <>
              {link('/organizer', 'Dashboard')}
              <Link to="/organizer/events/new" className="btn btn-primary btn-sm" style={{ marginLeft: 6 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
                New Event
              </Link>
            </>
          )}
          {user && (
            <div className="nav-user">
              <div className="avatar" title={user.name}>{initials || 'U'}</div>
              <button onClick={handleLogout} className="btn btn-ghost btn-sm">Sign out</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
