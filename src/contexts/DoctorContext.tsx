import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { DoctorUser, DoctorAppointment, Patient, DoctorStats } from '../services/api';

interface DoctorContextType {
  doctor: DoctorUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  appointments: DoctorAppointment[];
  patients: Patient[];
  stats: DoctorStats | null;
  login: (doctor: DoctorUser, token: string) => void;
  logout: () => void;
  updateProfile: (updates: Partial<DoctorUser>) => void;
  setAppointments: React.Dispatch<React.SetStateAction<DoctorAppointment[]>>;
  updateAppointment: (appointmentId: string, updates: Partial<DoctorAppointment>) => void;
  setPatients: React.Dispatch<React.SetStateAction<Patient[]>>;
  setStats: (stats: DoctorStats) => void;
}

const DoctorContext = createContext<DoctorContextType | undefined>(undefined);

export const useDoctorAuth = () => {
  const context = useContext(DoctorContext);
  if (context === undefined) {
    throw new Error('useDoctorAuth must be used within a DoctorProvider');
  }
  return context;
};

interface DoctorProviderProps {
  children: ReactNode;
}

export const DoctorProvider: React.FC<DoctorProviderProps> = ({ children }) => {
  const [doctor, setDoctor] = useState<DoctorUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [appointments, setAppointments] = useState<DoctorAppointment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [stats, setStats] = useState<DoctorStats | null>(null);

  // Load doctor data from localStorage on mount
  useEffect(() => {
    const savedDoctor = localStorage.getItem('doctor');
    const savedToken = localStorage.getItem('doctorToken');
    
    if (savedDoctor && savedToken) {
      try {
        setDoctor(JSON.parse(savedDoctor));
      } catch (error) {
        console.error('Error loading doctor data:', error);
        localStorage.removeItem('doctor');
        localStorage.removeItem('doctorToken');
      }
    }
    setIsLoading(false);
  }, []);

  // Save doctor data to localStorage whenever it changes
  useEffect(() => {
    if (doctor) {
      localStorage.setItem('doctor', JSON.stringify(doctor));
    }
  }, [doctor]);

  const login = (doctorData: DoctorUser, token: string) => {
    setDoctor(doctorData);
    localStorage.setItem('doctor', JSON.stringify(doctorData));
    localStorage.setItem('doctorToken', token);
  };

  const logout = () => {
    setDoctor(null);
    setAppointments([]);
    setPatients([]);
    setStats(null);
    localStorage.removeItem('doctor');
    localStorage.removeItem('doctorToken');
  };

  const updateProfile = (updates: Partial<DoctorUser>) => {
    if (doctor) {
      const updatedDoctor = { ...doctor, ...updates };
      setDoctor(updatedDoctor);
    }
  };

  const updateAppointment = (appointmentId: string, updates: Partial<DoctorAppointment>) => {
    setAppointments(prev => 
      prev.map(appointment => 
        appointment.id === appointmentId 
          ? { ...appointment, ...updates }
          : appointment
      )
    );
  };

  const isAuthenticated = !!doctor;

  return (
    <DoctorContext.Provider
      value={{
        doctor,
        isAuthenticated,
        isLoading,
        appointments,
        patients,
        stats,
        login,
        logout,
        updateProfile,
        setAppointments,
        updateAppointment,
        setPatients,
        setStats,
      }}
    >
      {children}
    </DoctorContext.Provider>
  );
};