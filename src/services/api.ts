const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  experience: string;
  rating: number;
  image: string;
  availability: string[];
  availableSlots: Array<{
    date: string;
    time: string;
    available: boolean;
  }>;
}

// Extended Doctor interface for doctor users
export interface DoctorUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialty: string;
  experience: string;
  rating: number;
  image: string;
  bio?: string;
  qualifications: string[];
  clinicAddress?: string;
  consultationFee: number;
  availability: DayAvailability[];
  isVerified: boolean;
  createdAt: string;
  totalPatients: number;
  totalAppointments: number;
}

export interface DayAvailability {
  day: string;
  isAvailable: boolean;
  timeSlots: TimeSlot[];
}

export interface TimeSlot {
  time: string;
  isAvailable: boolean;
}

export interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  age?: number;
  gender?: string;
  address?: string;
  medicalHistory?: string[];
  lastVisit?: string;
  totalAppointments: number;
}

export interface DoctorAppointment {
  id: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  patientEmail: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'rescheduled';
  type: string;
  notes?: string;
  symptoms?: string;
  prescription?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DoctorStats {
  totalAppointments: number;
  pendingAppointments: number;
  confirmedAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
  totalPatients: number;
  todayAppointments: number;
  monthlyRevenue: number;
  averageRating: number;
}

export interface Appointment {
  id: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  type: string;
  patientId: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface BookingRequest {
  doctorId: string;
  date: string;
  time: string;
  patientId: string;
  type?: string;
}

export interface Stats {
  totalAppointments: number;
  upcomingAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
  totalDoctors: number;
}

class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Health check
  async healthCheck(): Promise<{ status: string; message: string }> {
    return this.request('/health');
  }

  // Authentication
  async login(email: string, password: string): Promise<LoginResponse> {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async signup(userData: { name: string; email: string; password: string; phone: string }): Promise<LoginResponse> {
    return this.request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // Doctor Authentication
  async doctorLogin(email: string, password: string): Promise<{ doctor: DoctorUser; token: string }> {
    return this.request('/auth/doctor/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async doctorSignup(doctorData: {
    name: string;
    email: string;
    password: string;
    phone: string;
    specialty: string;
    experience: string;
    qualifications: string[];
    consultationFee: number;
    bio?: string;
  }): Promise<{ doctor: DoctorUser; token: string }> {
    return this.request('/auth/doctor/signup', {
      method: 'POST',
      body: JSON.stringify(doctorData),
    });
  }

  // Doctors
  async getDoctors(): Promise<Doctor[]> {
    return this.request('/doctors');
  }

  async getDoctor(id: string): Promise<Doctor> {
    return this.request(`/doctors/${id}`);
  }

  async getDoctorSlots(doctorId: string): Promise<Array<{ date: string; time: string; available: boolean }>> {
    return this.request(`/doctors/${doctorId}/slots`);
  }

  async searchDoctors(specialty?: string, name?: string): Promise<Doctor[]> {
    const params = new URLSearchParams();
    if (specialty) params.append('specialty', specialty);
    if (name) params.append('name', name);
    
    return this.request(`/doctors/search?${params.toString()}`);
  }

  // Appointments
  async bookAppointment(booking: BookingRequest): Promise<Appointment> {
    return this.request('/appointments', {
      method: 'POST',
      body: JSON.stringify(booking),
    });
  }

  async getUserAppointments(patientId: string): Promise<Appointment[]> {
    return this.request(`/appointments/${patientId}`);
  }

  async updateAppointmentStatus(appointmentId: string, status: 'upcoming' | 'completed' | 'cancelled'): Promise<Appointment> {
    return this.request(`/appointments/${appointmentId}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  async cancelAppointment(appointmentId: string): Promise<{ message: string }> {
    return this.request(`/appointments/${appointmentId}`, {
      method: 'DELETE',
    });
  }

  // Users
  async getUserProfile(userId: string): Promise<User> {
    return this.request(`/users/${userId}`);
  }

  async updateUserProfile(userId: string, userData: Partial<User>): Promise<User> {
    return this.request(`/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  // Statistics
  async getStats(): Promise<Stats> {
    return this.request('/stats');
  }

  // Doctor Management
  async getDoctorProfile(doctorId: string): Promise<DoctorUser> {
    return this.request(`/doctor/profile/${doctorId}`);
  }

  async updateDoctorProfile(doctorId: string, doctorData: Partial<DoctorUser>): Promise<DoctorUser> {
    return this.request(`/doctor/profile/${doctorId}`, {
      method: 'PUT',
      body: JSON.stringify(doctorData),
    });
  }

  async getDoctorAppointments(doctorId: string, status?: string): Promise<DoctorAppointment[]> {
    const params = status ? `?status=${status}` : '';
    return this.request(`/doctor/appointments/${doctorId}${params}`);
  }

  async updateAppointmentStatusByDoctor(
    appointmentId: string,
    status: 'confirmed' | 'completed' | 'cancelled' | 'rescheduled',
    notes?: string
  ): Promise<DoctorAppointment> {
    return this.request(`/doctor/appointments/${appointmentId}`, {
      method: 'PUT',
      body: JSON.stringify({ status, notes }),
    });
  }

  async getDoctorPatients(doctorId: string): Promise<Patient[]> {
    return this.request(`/doctor/patients/${doctorId}`);
  }

  async getPatientDetails(patientId: string, doctorId: string): Promise<Patient & { appointments: DoctorAppointment[] }> {
    return this.request(`/doctor/patients/${patientId}?doctorId=${doctorId}`);
  }

  async updateDoctorAvailability(doctorId: string, availability: DayAvailability[]): Promise<{ message: string }> {
    return this.request(`/doctor/availability/${doctorId}`, {
      method: 'PUT',
      body: JSON.stringify({ availability }),
    });
  }

  async getDoctorStats(doctorId: string): Promise<DoctorStats> {
    return this.request(`/doctor/stats/${doctorId}`);
  }

  async rescheduleAppointment(
    appointmentId: string,
    newDate: string,
    newTime: string,
    reason?: string
  ): Promise<DoctorAppointment> {
    return this.request(`/doctor/appointments/${appointmentId}/reschedule`, {
      method: 'PUT',
      body: JSON.stringify({ newDate, newTime, reason }),
    });
  }

  async addPrescription(
    appointmentId: string,
    prescription: string,
    notes?: string
  ): Promise<DoctorAppointment> {
    return this.request(`/doctor/appointments/${appointmentId}/prescription`, {
      method: 'PUT',
      body: JSON.stringify({ prescription, notes }),
    });
  }
}

export const apiService = new ApiService(); 