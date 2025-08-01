import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, DoctorUser } from '../services/api';

export type UserType = 'patient' | 'doctor';

interface AuthContextType {
  user: User | null;
  doctor: DoctorUser | null;
  userType: UserType | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginAsPatient: (user: User, token: string) => void;
  loginAsDoctor: (doctor: DoctorUser, token: string) => void;
  logout: () => void;
  updatePatientProfile: (updates: Partial<User>) => void;
  updateDoctorProfile: (updates: Partial<DoctorUser>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [doctor, setDoctor] = useState<DoctorUser | null>(null);
  const [userType, setUserType] = useState<UserType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load authentication data from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedDoctor = localStorage.getItem('doctor');
    const savedUserType = localStorage.getItem('userType') as UserType;
    
    if (savedUser && savedUserType === 'patient') {
      try {
        setUser(JSON.parse(savedUser));
        setUserType('patient');
      } catch (error) {
        console.error('Error loading user data:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('userType');
      }
    } else if (savedDoctor && savedUserType === 'doctor') {
      try {
        setDoctor(JSON.parse(savedDoctor));
        setUserType('doctor');
      } catch (error) {
        console.error('Error loading doctor data:', error);
        localStorage.removeItem('doctor');
        localStorage.removeItem('userType');
      }
    }
    setIsLoading(false);
  }, []);

  const loginAsPatient = (userData: User, token: string) => {
    setUser(userData);
    setDoctor(null);
    setUserType('patient');
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
    localStorage.setItem('userType', 'patient');
    localStorage.removeItem('doctor');
    localStorage.removeItem('doctorToken');
  };

  const loginAsDoctor = (doctorData: DoctorUser, token: string) => {
    setDoctor(doctorData);
    setUser(null);
    setUserType('doctor');
    localStorage.setItem('doctor', JSON.stringify(doctorData));
    localStorage.setItem('doctorToken', token);
    localStorage.setItem('userType', 'doctor');
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const logout = () => {
    setUser(null);
    setDoctor(null);
    setUserType(null);
    localStorage.removeItem('user');
    localStorage.removeItem('doctor');
    localStorage.removeItem('token');
    localStorage.removeItem('doctorToken');
    localStorage.removeItem('userType');
  };

  const updatePatientProfile = (updates: Partial<User>) => {
    if (user && userType === 'patient') {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const updateDoctorProfile = (updates: Partial<DoctorUser>) => {
    if (doctor && userType === 'doctor') {
      const updatedDoctor = { ...doctor, ...updates };
      setDoctor(updatedDoctor);
      localStorage.setItem('doctor', JSON.stringify(updatedDoctor));
    }
  };

  const isAuthenticated = !!(user || doctor);

  return (
    <AuthContext.Provider
      value={{
        user,
        doctor,
        userType,
        isAuthenticated,
        isLoading,
        loginAsPatient,
        loginAsDoctor,
        logout,
        updatePatientProfile,
        updateDoctorProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};