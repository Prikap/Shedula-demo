import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDoctorAuth } from '../../contexts/DoctorContext';
import { apiService, DayAvailability, TimeSlot } from '../../services/api';
import { 
  Calendar, 
  Clock, 
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  ToggleLeft,
  ToggleRight,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

const DoctorAvailability: React.FC = () => {
  const { doctor, updateProfile } = useDoctorAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [availability, setAvailability] = useState<DayAvailability[]>([]);

  const daysOfWeek = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
  ];

  const timeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM',
    '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM',
    '06:00 PM', '06:30 PM', '07:00 PM', '07:30 PM', '08:00 PM', '08:30 PM'
  ];

  useEffect(() => {
    if (doctor) {
      initializeAvailability();
    }
  }, [doctor]);

  const initializeAvailability = () => {
    if (doctor?.availability && doctor.availability.length > 0) {
      setAvailability(doctor.availability);
    } else {
      // Initialize with default availability structure
      const defaultAvailability: DayAvailability[] = daysOfWeek.map(day => ({
        day,
        isAvailable: false,
        timeSlots: []
      }));
      setAvailability(defaultAvailability);
    }
  };

  const toggleDayAvailability = (dayIndex: number) => {
    setAvailability(prev => 
      prev.map((day, index) => 
        index === dayIndex 
          ? { 
              ...day, 
              isAvailable: !day.isAvailable,
              timeSlots: !day.isAvailable ? [] : day.timeSlots
            }
          : day
      )
    );
  };

  const addTimeSlot = (dayIndex: number) => {
    setAvailability(prev => 
      prev.map((day, index) => 
        index === dayIndex 
          ? { 
              ...day, 
              timeSlots: [...day.timeSlots, { time: '09:00 AM', isAvailable: true }]
            }
          : day
      )
    );
  };

  const removeTimeSlot = (dayIndex: number, slotIndex: number) => {
    setAvailability(prev => 
      prev.map((day, index) => 
        index === dayIndex 
          ? { 
              ...day, 
              timeSlots: day.timeSlots.filter((_, i) => i !== slotIndex)
            }
          : day
      )
    );
  };

  const updateTimeSlot = (dayIndex: number, slotIndex: number, time: string) => {
    setAvailability(prev => 
      prev.map((day, index) => 
        index === dayIndex 
          ? { 
              ...day, 
              timeSlots: day.timeSlots.map((slot, i) => 
                i === slotIndex ? { ...slot, time } : slot
              )
            }
          : day
      )
    );
  };

  const toggleTimeSlotAvailability = (dayIndex: number, slotIndex: number) => {
    setAvailability(prev => 
      prev.map((day, index) => 
        index === dayIndex 
          ? { 
              ...day, 
              timeSlots: day.timeSlots.map((slot, i) => 
                i === slotIndex ? { ...slot, isAvailable: !slot.isAvailable } : slot
              )
            }
          : day
      )
    );
  };

  const handleSave = async () => {
    if (!doctor) return;

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      await apiService.updateDoctorAvailability(doctor.id, availability);
      updateProfile({ availability });
      setSuccess('Availability updated successfully!');
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to update availability. Please try again.');
      console.error('Error updating availability:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const setQuickAvailability = (preset: 'weekdays' | 'weekends' | 'all' | 'none') => {
    let newAvailability: DayAvailability[];

    switch (preset) {
      case 'weekdays':
        newAvailability = availability.map((day, index) => ({
          ...day,
          isAvailable: index < 5, // Monday to Friday
          timeSlots: index < 5 ? [
            { time: '09:00 AM', isAvailable: true },
            { time: '10:00 AM', isAvailable: true },
            { time: '11:00 AM', isAvailable: true },
            { time: '02:00 PM', isAvailable: true },
            { time: '03:00 PM', isAvailable: true },
            { time: '04:00 PM', isAvailable: true }
          ] : []
        }));
        break;
      case 'weekends':
        newAvailability = availability.map((day, index) => ({
          ...day,
          isAvailable: index >= 5, // Saturday and Sunday
          timeSlots: index >= 5 ? [
            { time: '10:00 AM', isAvailable: true },
            { time: '11:00 AM', isAvailable: true },
            { time: '02:00 PM', isAvailable: true },
            { time: '03:00 PM', isAvailable: true }
          ] : []
        }));
        break;
      case 'all':
        newAvailability = availability.map(day => ({
          ...day,
          isAvailable: true,
          timeSlots: [
            { time: '09:00 AM', isAvailable: true },
            { time: '10:00 AM', isAvailable: true },
            { time: '11:00 AM', isAvailable: true },
            { time: '02:00 PM', isAvailable: true },
            { time: '03:00 PM', isAvailable: true },
            { time: '04:00 PM', isAvailable: true }
          ]
        }));
        break;
      case 'none':
        newAvailability = availability.map(day => ({
          ...day,
          isAvailable: false,
          timeSlots: []
        }));
        break;
      default:
        return;
    }

    setAvailability(newAvailability);
  };

  if (!doctor) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading availability settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
                  Availability Settings
                </h1>
                <p className="text-sm text-gray-600">Manage your schedule and time slots</p>
              </div>
            </div>

            <button
              onClick={handleSave}
              disabled={isLoading}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>{isLoading ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Status Messages */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl flex items-center">
            <CheckCircle className="w-5 h-5 mr-2" />
            {success}
          </div>
        )}

        {/* Quick Presets */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 mb-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Setup</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <button
              onClick={() => setQuickAvailability('weekdays')}
              className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
            >
              Weekdays Only
            </button>
            <button
              onClick={() => setQuickAvailability('weekends')}
              className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm font-medium"
            >
              Weekends Only
            </button>
            <button
              onClick={() => setQuickAvailability('all')}
              className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-sm font-medium"
            >
              All Days
            </button>
            <button
              onClick={() => setQuickAvailability('none')}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
            >
              Clear All
            </button>
          </div>
        </div>

        {/* Weekly Schedule */}
        <div className="space-y-6">
          {availability.map((dayAvailability, dayIndex) => (
            <div key={dayAvailability.day} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-bold text-gray-900">{dayAvailability.day}</h3>
                </div>
                
                <button
                  onClick={() => toggleDayAvailability(dayIndex)}
                  className="flex items-center space-x-2"
                >
                  {dayAvailability.isAvailable ? (
                    <ToggleRight className="w-8 h-8 text-blue-600" />
                  ) : (
                    <ToggleLeft className="w-8 h-8 text-gray-400" />
                  )}
                  <span className={`text-sm font-medium ${dayAvailability.isAvailable ? 'text-blue-600' : 'text-gray-500'}`}>
                    {dayAvailability.isAvailable ? 'Available' : 'Unavailable'}
                  </span>
                </button>
              </div>

              {dayAvailability.isAvailable && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600">Time Slots</p>
                    <button
                      onClick={() => addTimeSlot(dayIndex)}
                      className="flex items-center space-x-1 px-3 py-1 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Slot</span>
                    </button>
                  </div>

                  {dayAvailability.timeSlots.length === 0 ? (
                    <div className="text-center py-6 bg-gray-50 rounded-lg">
                      <Clock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600 text-sm">No time slots added yet</p>
                      <button
                        onClick={() => addTimeSlot(dayIndex)}
                        className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Add your first time slot
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {dayAvailability.timeSlots.map((slot, slotIndex) => (
                        <div key={slotIndex} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                          <select
                            value={slot.time}
                            onChange={(e) => updateTimeSlot(dayIndex, slotIndex, e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                          >
                            {timeSlots.map(time => (
                              <option key={time} value={time}>{time}</option>
                            ))}
                          </select>
                          
                          <button
                            onClick={() => toggleTimeSlotAvailability(dayIndex, slotIndex)}
                            className={`p-2 rounded-lg transition-colors ${
                              slot.isAvailable 
                                ? 'bg-green-100 text-green-600 hover:bg-green-200' 
                                : 'bg-red-100 text-red-600 hover:bg-red-200'
                            }`}
                            title={slot.isAvailable ? 'Available' : 'Unavailable'}
                          >
                            {slot.isAvailable ? (
                              <CheckCircle className="w-4 h-4" />
                            ) : (
                              <AlertCircle className="w-4 h-4" />
                            )}
                          </button>
                          
                          <button
                            onClick={() => removeTimeSlot(dayIndex, slotIndex)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Remove slot"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {!dayAvailability.isAvailable && (
                <div className="text-center py-4 text-gray-500">
                  <p className="text-sm">You are not available on {dayAvailability.day}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 mt-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Schedule Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600 mb-2">Available Days</p>
              <p className="font-semibold text-gray-900">
                {availability.filter(day => day.isAvailable).length} out of 7 days
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-2">Total Time Slots</p>
              <p className="font-semibold text-gray-900">
                {availability.reduce((total, day) => total + day.timeSlots.length, 0)} slots per week
              </p>
            </div>
          </div>
          
          <div className="mt-4">
            <p className="text-sm text-gray-600 mb-2">Available Days</p>
            <div className="flex flex-wrap gap-2">
              {availability
                .filter(day => day.isAvailable)
                .map(day => (
                  <span
                    key={day.day}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                  >
                    {day.day} ({day.timeSlots.length} slots)
                  </span>
                ))
              }
              {availability.filter(day => day.isAvailable).length === 0 && (
                <span className="text-gray-500 text-sm italic">No available days set</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorAvailability;