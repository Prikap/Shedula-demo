import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDoctorAuth } from '../../contexts/DoctorContext';
import { apiService, DoctorAppointment } from '../../services/api';
import { 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  ArrowLeft,
  Filter,
  Search,
  CheckCircle,
  XCircle,
  AlertCircle,
  RotateCcw,
  FileText,
  Eye,
  Edit3,
  MessageSquare
} from 'lucide-react';

type AppointmentStatus = 'all' | 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'rescheduled';

const DoctorAppointments: React.FC = () => {
  const { doctor, appointments, setAppointments } = useDoctorAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<AppointmentStatus>('all');
  const [selectedAppointment, setSelectedAppointment] = useState<DoctorAppointment | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (doctor) {
      loadAppointments();
    }
  }, [doctor]);

  const loadAppointments = async () => {
    if (!doctor) return;
    
    setIsLoading(true);
    try {
      const appointmentsData = await apiService.getDoctorAppointments(doctor.id);
      setAppointments(appointmentsData);
    } catch (err) {
      setError('Failed to load appointments');
      console.error('Error loading appointments:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (appointmentId: string, newStatus: 'confirmed' | 'completed' | 'cancelled' | 'rescheduled', notes?: string) => {
    setActionLoading(true);
    try {
      const updatedAppointment = await apiService.updateAppointmentStatusByDoctor(appointmentId, newStatus, notes);
      
      // Update local state
      setAppointments(prev => 
        prev.map(apt => apt.id === appointmentId ? updatedAppointment : apt)
      );
      
      setShowModal(false);
      setSelectedAppointment(null);
    } catch (err) {
      setError('Failed to update appointment status');
      console.error('Error updating appointment:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'confirmed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      case 'rescheduled': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <AlertCircle className="w-4 h-4" />;
      case 'confirmed': return <CheckCircle className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      case 'rescheduled': return <RotateCcw className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01 ${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.patientEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.type.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getAppointmentCounts = () => {
    return {
      all: appointments.length,
      pending: appointments.filter(apt => apt.status === 'pending').length,
      confirmed: appointments.filter(apt => apt.status === 'confirmed').length,
      completed: appointments.filter(apt => apt.status === 'completed').length,
      cancelled: appointments.filter(apt => apt.status === 'cancelled').length,
      rescheduled: appointments.filter(apt => apt.status === 'rescheduled').length,
    };
  };

  const counts = getAppointmentCounts();

  if (!doctor) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading appointments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/doctor/dashboard')}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Appointment Management
                </h1>
                <p className="text-sm text-gray-600">Manage your patient appointments</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        {/* Filters and Search */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search patients, email, or appointment type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-500" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as AppointmentStatus)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All ({counts.all})</option>
                <option value="pending">Pending ({counts.pending})</option>
                <option value="confirmed">Confirmed ({counts.confirmed})</option>
                <option value="completed">Completed ({counts.completed})</option>
                <option value="cancelled">Cancelled ({counts.cancelled})</option>
                <option value="rescheduled">Rescheduled ({counts.rescheduled})</option>
              </select>
            </div>
          </div>
        </div>

        {/* Appointments List */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading appointments...</p>
            </div>
          ) : filteredAppointments.length === 0 ? (
            <div className="p-8 text-center">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">
                {searchTerm || statusFilter !== 'all' 
                  ? 'No appointments match your search criteria' 
                  : 'No appointments scheduled yet'
                }
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredAppointments.map((appointment) => (
                <div key={appointment.id} className="p-6 hover:bg-gray-50/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {appointment.patientName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-1">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {appointment.patientName}
                          </h3>
                          <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(appointment.status)}`}>
                            {getStatusIcon(appointment.status)}
                            <span>{appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}</span>
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(appointment.date)}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{formatTime(appointment.time)}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <FileText className="w-4 h-4" />
                            <span>{appointment.type}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                          <div className="flex items-center space-x-1">
                            <Mail className="w-4 h-4" />
                            <span>{appointment.patientEmail}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Phone className="w-4 h-4" />
                            <span>{appointment.patientPhone}</span>
                          </div>
                        </div>
                        
                        {appointment.symptoms && (
                          <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                            <p className="text-sm text-blue-900">
                              <strong>Symptoms:</strong> {appointment.symptoms}
                            </p>
                          </div>
                        )}
                        
                        {appointment.notes && (
                          <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-700">
                              <strong>Notes:</strong> {appointment.notes}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setSelectedAppointment(appointment);
                          setShowModal(true);
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Manage Appointment"
                      >
                        <Edit3 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Appointment Management Modal */}
      {showModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Manage Appointment</h3>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setSelectedAppointment(null);
                  }}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <p className="text-sm text-gray-600">Patient</p>
                  <p className="font-semibold text-gray-900">{selectedAppointment.patientName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Date & Time</p>
                  <p className="font-semibold text-gray-900">
                    {formatDate(selectedAppointment.date)} at {formatTime(selectedAppointment.time)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Type</p>
                  <p className="font-semibold text-gray-900">{selectedAppointment.type}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Current Status</p>
                  <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedAppointment.status)}`}>
                    {getStatusIcon(selectedAppointment.status)}
                    <span>{selectedAppointment.status.charAt(0).toUpperCase() + selectedAppointment.status.slice(1)}</span>
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                {selectedAppointment.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleStatusUpdate(selectedAppointment.id, 'confirmed')}
                      disabled={actionLoading}
                      className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors"
                    >
                      <CheckCircle className="w-5 h-5" />
                      <span>Confirm Appointment</span>
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(selectedAppointment.id, 'cancelled', 'Cancelled by doctor')}
                      disabled={actionLoading}
                      className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 disabled:opacity-50 transition-colors"
                    >
                      <XCircle className="w-5 h-5" />
                      <span>Cancel Appointment</span>
                    </button>
                  </>
                )}

                {selectedAppointment.status === 'confirmed' && (
                  <>
                    <button
                      onClick={() => handleStatusUpdate(selectedAppointment.id, 'completed', 'Appointment completed successfully')}
                      disabled={actionLoading}
                      className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:opacity-50 transition-colors"
                    >
                      <CheckCircle className="w-5 h-5" />
                      <span>Mark as Completed</span>
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(selectedAppointment.id, 'rescheduled', 'Appointment rescheduled')}
                      disabled={actionLoading}
                      className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 disabled:opacity-50 transition-colors"
                    >
                      <RotateCcw className="w-5 h-5" />
                      <span>Reschedule</span>
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(selectedAppointment.id, 'cancelled', 'Cancelled by doctor')}
                      disabled={actionLoading}
                      className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 disabled:opacity-50 transition-colors"
                    >
                      <XCircle className="w-5 h-5" />
                      <span>Cancel Appointment</span>
                    </button>
                  </>
                )}

                {(selectedAppointment.status === 'completed' || selectedAppointment.status === 'cancelled') && (
                  <div className="text-center py-4">
                    <p className="text-gray-600">This appointment has been {selectedAppointment.status}.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorAppointments;