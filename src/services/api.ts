const API_BASE_URL = 'http://localhost:3001/api';

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
}

export const apiService = new ApiService(); 