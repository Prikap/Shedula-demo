import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Doctor } from '../services/api';

interface Appointment {
  id: string;
  doctor: Doctor;
  date: string;
  time: string;
  status: 'confirmed' | 'cancelled' | 'completed';
  createdAt: string;
}

interface BookingContextType {
  selectedDoctor: Doctor | null;
  selectedSlot: { date: string; time: string } | null;
  appointments: Appointment[];
  setSelectedDoctor: (doctor: Doctor | null) => void;
  setSelectedSlot: (slot: { date: string; time: string } | null) => void;
  addAppointment: (appointment: Omit<Appointment, 'id' | 'createdAt'>) => void;
  cancelAppointment: (appointmentId: string) => void;
  getUpcomingAppointments: () => Appointment[];
  getPastAppointments: () => Appointment[];
  clearBooking: () => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};

interface BookingProviderProps {
  children: ReactNode;
}

export const BookingProvider: React.FC<BookingProviderProps> = ({ children }) => {
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<{ date: string; time: string } | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  // Load appointments from localStorage on mount
  useEffect(() => {
    const savedAppointments = localStorage.getItem('appointments');
    if (savedAppointments) {
      try {
        setAppointments(JSON.parse(savedAppointments));
      } catch (error) {
        console.error('Error loading appointments:', error);
      }
    }
  }, []);

  // Save appointments to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('appointments', JSON.stringify(appointments));
  }, [appointments]);

  const addAppointment = (appointmentData: Omit<Appointment, 'id' | 'createdAt'>) => {
    const newAppointment: Appointment = {
      ...appointmentData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setAppointments(prev => [newAppointment, ...prev]);
  };

  const cancelAppointment = (appointmentId: string) => {
    setAppointments(prev => 
      prev.map(appointment => 
        appointment.id === appointmentId 
          ? { ...appointment, status: 'cancelled' as const }
          : appointment
      )
    );
  };

  const getUpcomingAppointments = () => {
    const now = new Date();
    return appointments.filter(appointment => {
      const appointmentDate = new Date(appointment.date);
      return appointmentDate > now && appointment.status === 'confirmed';
    }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const getPastAppointments = () => {
    const now = new Date();
    return appointments.filter(appointment => {
      const appointmentDate = new Date(appointment.date);
      return appointmentDate <= now || appointment.status === 'cancelled';
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const clearBooking = () => {
    setSelectedDoctor(null);
    setSelectedSlot(null);
  };

  return (
    <BookingContext.Provider
      value={{
        selectedDoctor,
        selectedSlot,
        appointments,
        setSelectedDoctor,
        setSelectedSlot,
        addAppointment,
        cancelAppointment,
        getUpcomingAppointments,
        getPastAppointments,
        clearBooking,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}; 