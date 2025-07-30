import React, { useState } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import DoctorSelection from './components/DoctorSelection';
import TimeSlotPicker from './components/TimeSlotPicker';
import BookingConfirmation from './components/BookingConfirmation';
import Profile from './components/Profile';
import { User, Doctor } from './services/api';

function App() {
  const [currentView, setCurrentView] = useState<'login' | 'dashboard' | 'doctors' | 'booking' | 'confirmation' | 'profile'>('login');
  const [user, setUser] = useState<User | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<{ date: string; time: string } | null>(null);

  const handleLogin = (userData: { name: string; email: string }) => {
    // Create a user object with the required fields
    const newUser: User = {
      id: 'user123', // For demo purposes
      name: userData.name,
      email: userData.email,
      phone: '+1-555-0000'
    };
    setUser(newUser);
    setCurrentView('dashboard');
  };

  const handleDoctorSelect = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setCurrentView('booking');
  };

  const handleTimeSlotSelect = (slot: { date: string; time: string }) => {
    setSelectedSlot(slot);
    setCurrentView('confirmation');
  };

  const handleBookingConfirm = () => {
    // Reset the booking flow
    setCurrentView('dashboard');
    setSelectedDoctor(null);
    setSelectedSlot(null);
  };

  const navigateToProfile = () => {
    setCurrentView('profile');
  };

  const navigateBack = () => {
    if (currentView === 'doctors') {
      setCurrentView('dashboard');
    } else if (currentView === 'booking') {
      setCurrentView('doctors');
    } else if (currentView === 'confirmation') {
      setCurrentView('booking');
    } else if (currentView === 'profile') {
      setCurrentView('dashboard');
    }
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {currentView === 'dashboard' && (
        <Dashboard 
          user={user}
          onBookAppointment={() => setCurrentView('doctors')}
          onViewProfile={navigateToProfile}
        />
      )}
      {currentView === 'doctors' && (
        <DoctorSelection 
          onSelectDoctor={handleDoctorSelect}
          onBack={navigateBack}
        />
      )}
      {currentView === 'booking' && selectedDoctor && (
        <TimeSlotPicker 
          doctor={selectedDoctor}
          onSelectSlot={handleTimeSlotSelect}
          onBack={navigateBack}
        />
      )}
      {currentView === 'confirmation' && selectedDoctor && selectedSlot && (
        <BookingConfirmation 
          doctor={selectedDoctor}
          slot={selectedSlot}
          onConfirm={handleBookingConfirm}
          onBack={navigateBack}
        />
      )}
      {currentView === 'profile' && (
        <Profile 
          user={user}
          onBack={navigateBack}
        />
      )}
    </div>
  );
}

export default App;