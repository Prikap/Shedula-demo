import React, { useState } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import DoctorSelection from './components/DoctorSelection';
import TimeSlotPicker from './components/TimeSlotPicker';
import BookingConfirmation from './components/BookingConfirmation';
import Profile from './components/Profile';

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  experience: string;
  rating: number;
  image: string;
  availability: string[];
}

export interface Appointment {
  id: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  type: string;
}

export interface User {
  name: string;
  email: string;
}

function App() {
  const [currentView, setCurrentView] = useState<'login' | 'dashboard' | 'doctors' | 'booking' | 'confirmation' | 'profile'>('login');
  const [user, setUser] = useState<User | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<{ date: string; time: string } | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: '1',
      doctorName: 'Dr. Priya Sharma',
      specialty: 'Cardiologist',
      date: '2025-01-25',
      time: '10:00 AM',
      status: 'upcoming',
      type: 'Consultation'
    },
    {
      id: '2',
      doctorName: 'Dr. Rajesh Kumar',
      specialty: 'Dermatologist',
      date: '2025-01-20',
      time: '2:00 PM',
      status: 'completed',
      type: 'Check-up'
    }
  ]);

  const handleLogin = (userData: User) => {
    setUser(userData);
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
    if (selectedDoctor && selectedSlot) {
      const newAppointment: Appointment = {
        id: Date.now().toString(),
        doctorName: selectedDoctor.name,
        specialty: selectedDoctor.specialty,
        date: selectedSlot.date,
        time: selectedSlot.time,
        status: 'upcoming',
        type: 'Consultation'
      };
      setAppointments([newAppointment, ...appointments]);
      setCurrentView('dashboard');
      setSelectedDoctor(null);
      setSelectedSlot(null);
    }
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
          appointments={appointments}
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
          appointments={appointments}
          onBack={navigateBack}
        />
      )}
    </div>
  );
}

export default App;