import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import DoctorSelection from './components/DoctorSelection';
import TimeSlotPicker from './components/TimeSlotPicker';
import BookingConfirmation from './components/BookingConfirmation';
import Profile from './components/Profile';
import DoctorDashboard from './components/doctor/DoctorDashboard';
import DoctorProfile from './components/doctor/DoctorProfile';
import DoctorAppointments from './components/doctor/DoctorAppointments';
import DoctorPatients from './components/doctor/DoctorPatients';
import DoctorAvailability from './components/doctor/DoctorAvailability';
import { Doctor } from './services/api';
import { BookingProvider, useBooking } from './contexts/BookingContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DoctorProvider } from './contexts/DoctorContext';

// Layout component with navigation
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, doctor, userType, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Don't show navigation for auth pages or doctor pages (they have their own navigation)
  if (location.pathname === '/login' || 
      location.pathname === '/signup' || 
      location.pathname.startsWith('/doctor/')) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Navigation Header - Only for patient routes */}
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

            {user && userType === 'patient' && (
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

      {/* Breadcrumb - Only for patient routes */}
      {location.pathname !== '/dashboard' && userType === 'patient' && (
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
      <main className={userType === 'patient' ? "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" : ""}>
        {children}
      </main>
    </div>
  );
};

// Protected Route components
const PatientProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, userType, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-gray-600 font-medium">Loading...</span>
        </div>
      </div>
    );
  }
  
  return (user && userType === 'patient') ? <>{children}</> : <Navigate to="/login" replace />;
};

const DoctorProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { doctor, userType, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-gray-600 font-medium">Loading...</span>
        </div>
      </div>
    );
  }
  
  return (doctor && userType === 'doctor') ? <>{children}</> : <Navigate to="/login" replace />;
};

// Route components with proper navigation
const DashboardRoute: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  return (
    <Dashboard 
      user={user!}
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
    // Simulate successful booking
    alert('Appointment booked successfully!');
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
  const { user } = useAuth();
  
  return (
    <Profile 
      user={user!}
      onBack={() => navigate('/dashboard')}
    />
  );
};

// Main App component
function App() {
  return (
    <AuthProvider>
      <DoctorProvider>
        <BookingProvider>
          <Router>
            <Layout>
              <Routes>
                {/* Public routes */}
                <Route 
                  path="/login" 
                  element={<Login />} 
                />
                <Route 
                  path="/signup" 
                  element={<Signup />} 
                />

                {/* Patient Protected routes */}
                <Route path="/dashboard" element={
                  <PatientProtectedRoute>
                    <DashboardRoute />
                  </PatientProtectedRoute>
                } />
                
                <Route path="/doctors" element={
                  <PatientProtectedRoute>
                    <DoctorsRoute />
                  </PatientProtectedRoute>
                } />
                
                <Route path="/appointment-booking" element={
                  <PatientProtectedRoute>
                    <AppointmentBookingRoute />
                  </PatientProtectedRoute>
                } />
                
                <Route path="/booking-confirmation" element={
                  <PatientProtectedRoute>
                    <BookingConfirmationRoute />
                  </PatientProtectedRoute>
                } />
                
                <Route path="/profile" element={
                  <PatientProtectedRoute>
                    <ProfileRoute />
                  </PatientProtectedRoute>
                } />

                {/* Doctor Protected routes */}
                <Route path="/doctor/dashboard" element={
                  <DoctorProtectedRoute>
                    <DoctorDashboard />
                  </DoctorProtectedRoute>
                } />

                {/* Doctor Profile */}
                <Route path="/doctor/profile" element={
                  <DoctorProtectedRoute>
                    <DoctorProfile />
                  </DoctorProtectedRoute>
                } />

                <Route path="/doctor/appointments" element={
                  <DoctorProtectedRoute>
                    <DoctorAppointments />
                  </DoctorProtectedRoute>
                } />

                <Route path="/doctor/patients" element={
                  <DoctorProtectedRoute>
                    <DoctorPatients />
                  </DoctorProtectedRoute>
                } />

                <Route path="/doctor/availability" element={
                  <DoctorProtectedRoute>
                    <DoctorAvailability />
                  </DoctorProtectedRoute>
                } />

                {/* Default redirects */}
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="*" element={<Navigate to="/login" replace />} />
              </Routes>
            </Layout>
          </Router>
        </BookingProvider>
      </DoctorProvider>
    </AuthProvider>
  );
}

export default App;