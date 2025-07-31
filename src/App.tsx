import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import DoctorSelection from './components/DoctorSelection';
import TimeSlotPicker from './components/TimeSlotPicker';
import BookingConfirmation from './components/BookingConfirmation';
import Profile from './components/Profile';
import { User, Doctor } from './services/api';
import { BookingProvider, useBooking } from './contexts/BookingContext';

// Layout component with navigation
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  // Don't show navigation for auth pages
  if (location.pathname === '/login' || location.pathname === '/signup') {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Navigation Header */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div 
                onClick={() => navigate('/dashboard')}
                className="flex items-center space-x-2 cursor-pointer group"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">S</span>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Shedula
                </span>
              </div>
            </div>

            {user && (
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => navigate('/dashboard')}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === '/dashboard'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => navigate('/doctors')}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === '/doctors'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  Book Appointment
                </button>
                <div className="relative group">
                  <button className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors">
                    <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-medium">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span>{user.name}</span>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <button
                      onClick={() => navigate('/profile')}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Profile
                    </button>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Breadcrumb */}
      {location.pathname !== '/dashboard' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2">
              <li>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="text-gray-500 hover:text-gray-700 text-sm font-medium"
                >
                  Dashboard
                </button>
              </li>
              {location.pathname !== '/dashboard' && (
                <>
                  <li>
                    <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </li>
                  <li>
                    <span className="text-gray-900 text-sm font-medium capitalize">
                      {location.pathname.split('/')[1]}
                    </span>
                  </li>
                </>
              )}
            </ol>
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};

// Protected Route component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const user = localStorage.getItem('user');
  return user ? <>{children}</> : <Navigate to="/login" replace />;
};

// Route components with proper navigation
const DashboardRoute: React.FC = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  return (
    <Dashboard 
      user={user}
      onBookAppointment={() => navigate('/doctors')}
      onViewProfile={() => navigate('/profile')}
    />
  );
};

const DoctorsRoute: React.FC = () => {
  const navigate = useNavigate();
  const { setSelectedDoctor } = useBooking();
  
  const handleSelectDoctor = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    navigate('/appointment-booking');
  };
  
  return (
    <DoctorSelection 
      onSelectDoctor={handleSelectDoctor}
      onBack={() => navigate('/dashboard')}
    />
  );
};

const AppointmentBookingRoute: React.FC = () => {
  const navigate = useNavigate();
  const { selectedDoctor, setSelectedSlot } = useBooking();
  
  if (!selectedDoctor) {
    return <Navigate to="/doctors" replace />;
  }
  
  const handleSelectSlot = (slot: { date: string; time: string }) => {
    setSelectedSlot(slot);
    navigate('/booking-confirmation');
  };
  
  return (
    <TimeSlotPicker 
      doctor={selectedDoctor}
      onSelectSlot={handleSelectSlot}
      onBack={() => navigate('/doctors')}
    />
  );
};

const BookingConfirmationRoute: React.FC = () => {
  const navigate = useNavigate();
  const { selectedDoctor, selectedSlot, clearBooking } = useBooking();
  
  if (!selectedDoctor || !selectedSlot) {
    return <Navigate to="/doctors" replace />;
  }
  
  const handleConfirm = () => {
    clearBooking();
    navigate('/dashboard');
  };
  
  return (
    <BookingConfirmation 
      doctor={selectedDoctor}
      slot={selectedSlot}
      onConfirm={handleConfirm}
      onBack={() => navigate('/appointment-booking')}
    />
  );
};

const ProfileRoute: React.FC = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  return (
    <Profile 
      user={user}
      onBack={() => navigate('/dashboard')}
    />
  );
};

// Main App component
function App() {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const handleLogin = (userData: { name: string; email: string }) => {
    const newUser: User = {
      id: 'user123',
      name: userData.name,
      email: userData.email,
      phone: '+1-555-0000'
    };
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  const handleSignup = (userData: { name: string; email: string }) => {
    const newUser: User = {
      id: 'user123',
      name: userData.name,
      email: userData.email,
      phone: '+1-555-0000'
    };
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  return (
    <BookingProvider>
      <Router>
        <Layout>
          <Routes>
            {/* Public routes */}
            <Route 
              path="/login" 
              element={
                user ? <Navigate to="/dashboard" replace /> : 
                <Login onLogin={handleLogin} onSwitchToSignup={() => {}} />
              } 
            />
            <Route 
              path="/signup" 
              element={
                user ? <Navigate to="/dashboard" replace /> : 
                <Signup onSignup={handleSignup} onSwitchToLogin={() => {}} />
              } 
            />

            {/* Protected routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardRoute />
              </ProtectedRoute>
            } />
            
            <Route path="/doctors" element={
              <ProtectedRoute>
                <DoctorsRoute />
              </ProtectedRoute>
            } />
            
            <Route path="/appointment-booking" element={
              <ProtectedRoute>
                <AppointmentBookingRoute />
              </ProtectedRoute>
            } />
            
            <Route path="/booking-confirmation" element={
              <ProtectedRoute>
                <BookingConfirmationRoute />
              </ProtectedRoute>
            } />
            
            <Route path="/profile" element={
              <ProtectedRoute>
                <ProfileRoute />
              </ProtectedRoute>
            } />

            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Layout>
      </Router>
    </BookingProvider>
  );
}

export default App;