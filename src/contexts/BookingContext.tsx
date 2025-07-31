import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Doctor } from '../services/api';

interface BookingContextType {
  selectedDoctor: Doctor | null;
  selectedSlot: { date: string; time: string } | null;
  setSelectedDoctor: (doctor: Doctor | null) => void;
  setSelectedSlot: (slot: { date: string; time: string } | null) => void;
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

  const clearBooking = () => {
    setSelectedDoctor(null);
    setSelectedSlot(null);
  };

  return (
    <BookingContext.Provider
      value={{
        selectedDoctor,
        selectedSlot,
        setSelectedDoctor,
        setSelectedSlot,
        clearBooking,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}; 