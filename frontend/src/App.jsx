import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import UserHome from './pages/UserHome';
import EventDetail from './pages/EventDetail';
import MyBookings from './pages/MyBookings';
import OrganizerDashboard from './pages/OrganizerDashboard';
import OrganizerEventForm from './pages/OrganizerEventForm';

const Protected = ({ children, organizerOnly = false }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (organizerOnly && user.role !== 'organizer') return <Navigate to="/" />;
  return children;
};

function Shell() {
  const { pathname } = useLocation();
  const isAuth = pathname === '/login' || pathname === '/register';
  return (
    <>
      <Navbar />
      <main className={isAuth ? '' : 'container fade-in'}>
        <Routes>
          <Route path="/" element={<UserHome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/events/:id" element={<EventDetail />} />
          <Route path="/my-bookings" element={<Protected><MyBookings /></Protected>} />
          <Route path="/organizer" element={<Protected organizerOnly><OrganizerDashboard /></Protected>} />
          <Route path="/organizer/events/new" element={<Protected organizerOnly><OrganizerEventForm /></Protected>} />
          <Route path="/organizer/events/edit/:id" element={<Protected organizerOnly><OrganizerEventForm /></Protected>} />
        </Routes>
      </main>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Shell />
      </Router>
    </AuthProvider>
  );
}
