import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDoctorAuth } from '../../contexts/DoctorContext';
import { apiService, Patient, DoctorAppointment } from '../../services/api';
import { 
  Users, 
  Search, 
  ArrowLeft,
  User,
  Phone,
  Mail,
  Calendar,
  Clock,
  FileText,
  Eye,
  Filter,
  MapPin,
  Activity,
  AlertCircle
} from 'lucide-react';

const DoctorPatients: React.FC = () => {
  const { doctor, patients, setPatients } = useDoctorAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [patientAppointments, setPatientAppointments] = useState<DoctorAppointment[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    if (doctor) {
      loadPatients();
    }
  }, [doctor]);

  const loadPatients = async () => {
    if (!doctor) return;
    
    setIsLoading(true);
    try {
      const patientsData = await apiService.getDoctorPatients(doctor.id);
      setPatients(patientsData);
    } catch (err) {
      setError('Failed to load patients');
      console.error('Error loading patients:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadPatientDetails = async (patientId: string) => {
    if (!doctor) return;
    
    setModalLoading(true);
    try {
      const patientDetails = await apiService.getPatientDetails(patientId, doctor.id);
      setSelectedPatient(patientDetails);
      setPatientAppointments(patientDetails.appointments || []);
    } catch (err) {
      setError('Failed to load patient details');
      console.error('Error loading patient details:', err);
    } finally {
      setModalLoading(false);
    }
  };

  const handleViewPatient = async (patient: Patient) => {
    setShowModal(true);
    await loadPatientDetails(patient.id);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
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

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.phone.includes(searchTerm)
  );

  if (!doctor) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading patients...</p>
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
                  Patient List
                </h1>
                <p className="text-sm text-gray-600">Manage your patient records</p>
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

        {/* Search and Stats */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search patients by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Stats */}
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{patients.length}</p>
                <p className="text-sm text-gray-600">Total Patients</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {patients.filter(p => p.lastVisit && new Date(p.lastVisit) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length}
                </p>
                <p className="text-sm text-gray-600">Active (30 days)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Patients List */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading patients...</p>
            </div>
          ) : filteredPatients.length === 0 ? (
            <div className="p-8 text-center">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">
                {searchTerm ? 'No patients match your search criteria' : 'No patients registered yet'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredPatients.map((patient) => (
                <div key={patient.id} className="p-6 hover:bg-gray-50/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {patient.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-1">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {patient.name}
                          </h3>
                          {patient.age && (
                            <span className="text-sm text-gray-500">
                              Age {patient.age}
                            </span>
                          )}
                          {patient.gender && (
                            <span className="text-sm text-gray-500">
                              • {patient.gender}
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                          <div className="flex items-center space-x-1">
                            <Mail className="w-4 h-4" />
                            <span>{patient.email}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Phone className="w-4 h-4" />
                            <span>{patient.phone}</span>
                          </div>
                        </div>

                        {patient.address && (
                          <div className="flex items-center space-x-1 text-sm text-gray-500 mb-2">
                            <MapPin className="w-4 h-4" />
                            <span>{patient.address}</span>
                          </div>
                        )}
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>
                              Last visit: {patient.lastVisit ? formatDate(patient.lastVisit) : 'Never'}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Activity className="w-4 h-4" />
                            <span>{patient.totalAppointments} appointments</span>
                          </div>
                        </div>

                        {patient.medicalHistory && patient.medicalHistory.length > 0 && (
                          <div className="mt-2 flex items-center space-x-1">
                            <AlertCircle className="w-4 h-4 text-orange-500" />
                            <span className="text-sm text-orange-700">
                              Medical History: {patient.medicalHistory.join(', ')}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleViewPatient(patient)}
                        className="flex items-center space-x-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        <span>View Details</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Patient Details Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Patient Details</h3>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setSelectedPatient(null);
                    setPatientAppointments([]);
                  }}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
                >
                  ×
                </button>
              </div>

              {modalLoading ? (
                <div className="text-center py-8">
                  <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading patient details...</p>
                </div>
              ) : selectedPatient ? (
                <div className="space-y-6">
                  {/* Patient Info */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xl font-medium">
                          {selectedPatient.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-gray-900">{selectedPatient.name}</h4>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          {selectedPatient.age && <span>Age {selectedPatient.age}</span>}
                          {selectedPatient.gender && <span>• {selectedPatient.gender}</span>}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Email</p>
                        <p className="font-medium text-gray-900">{selectedPatient.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Phone</p>
                        <p className="font-medium text-gray-900">{selectedPatient.phone}</p>
                      </div>
                      {selectedPatient.address && (
                        <div className="md:col-span-2">
                          <p className="text-sm text-gray-600">Address</p>
                          <p className="font-medium text-gray-900">{selectedPatient.address}</p>
                        </div>
                      )}
                    </div>

                    {selectedPatient.medicalHistory && selectedPatient.medicalHistory.length > 0 && (
                      <div className="mt-4">
                        <p className="text-sm text-gray-600 mb-2">Medical History</p>
                        <div className="flex flex-wrap gap-2">
                          {selectedPatient.medicalHistory.map((condition, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm"
                            >
                              {condition}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Appointment History */}
                  <div>
                    <h5 className="text-lg font-bold text-gray-900 mb-4">Appointment History</h5>
                    {patientAppointments.length === 0 ? (
                      <div className="text-center py-6 bg-gray-50 rounded-xl">
                        <Calendar className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-600">No appointments found</p>
                      </div>
                    ) : (
                      <div className="space-y-3 max-h-60 overflow-y-auto">
                        {patientAppointments.map((appointment) => (
                          <div key={appointment.id} className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-3">
                                <span className="font-medium text-gray-900">
                                  {formatDate(appointment.date)}
                                </span>
                                <span className="text-gray-600">
                                  {formatTime(appointment.time)}
                                </span>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(appointment.status)}`}>
                                  {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                                </span>
                              </div>
                              <span className="text-sm text-gray-600">{appointment.type}</span>
                            </div>
                            
                            {appointment.symptoms && (
                              <div className="mb-2">
                                <p className="text-sm text-gray-600">Symptoms:</p>
                                <p className="text-sm text-gray-900">{appointment.symptoms}</p>
                              </div>
                            )}
                            
                            {appointment.prescription && (
                              <div className="mb-2">
                                <p className="text-sm text-gray-600">Prescription:</p>
                                <p className="text-sm text-gray-900">{appointment.prescription}</p>
                              </div>
                            )}
                            
                            {appointment.notes && (
                              <div>
                                <p className="text-sm text-gray-600">Notes:</p>
                                <p className="text-sm text-gray-900">{appointment.notes}</p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600">Failed to load patient details</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorPatients;