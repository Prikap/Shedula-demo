import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, User } from 'lucide-react';
import { Doctor } from '../services/api';

interface TimeSlotPickerProps {
  doctor: Doctor;
  onSelectSlot: (slot: { date: string; time: string }) => void;
  onBack: () => void;
}

interface TimeSlot {
  date: string;
  time: string;
  available: boolean;
}

const TimeSlotPicker: React.FC<TimeSlotPickerProps> = ({ doctor, onSelectSlot, onBack }) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchAvailableSlots();
  }, [doctor.id]);

  const fetchAvailableSlots = async () => {
    try {
      setLoading(true);
      // Simulate API call with mock data
      setTimeout(() => {
        // Generate mock slots for the next 7 days
        const mockSlots: TimeSlot[] = [];
        const today = new Date();
        
        for (let i = 1; i <= 7; i++) {
          const date = new Date(today);
          date.setDate(today.getDate() + i);
          const dateString = date.toISOString().split('T')[0];
          
          // Add multiple time slots for each date
          const times = ['09:00 AM', '10:00 AM', '02:00 PM', '03:00 PM'];
          times.forEach(time => {
            mockSlots.push({
              date: dateString,
              time: time,
              available: Math.random() > 0.3 // 70% chance of being available
            });
          });
        }
        
        setAvailableSlots(mockSlots);
        setLoading(false);
      }, 1000);
    } catch (err) {
      setError('Failed to load available slots. Please try again.');
      console.error('Error fetching slots:', err);
      setLoading(false);
    }
  };

  // Generate next 7 days
  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 1; i <= 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push({
        value: date.toISOString().split('T')[0],
        label: date.toLocaleDateString('en-US', { 
          weekday: 'short', 
          month: 'short', 
          day: 'numeric' 
        }),
        isToday: i === 1
      });
    }
    return dates;
  };

  const availableDates = getAvailableDates();

  // Get unique dates from available slots
  const slotDates = [...new Set(availableSlots.map(slot => slot.date))].sort();

  // Get time slots for selected date
  const getTimeSlotsForDate = (date: string) => {
    return availableSlots
      .filter(slot => slot.date === date && slot.available)
      .map(slot => slot.time)
      .sort();
  };

  const handleDateSelect = (date: string) => {
    console.log('Date selected:', date);
    setSelectedDate(date);
    setSelectedTime(''); // Reset time selection when date changes
  };

  const handleTimeSelect = (time: string) => {
    console.log('Time selected:', time);
    setSelectedTime(time);
  };

  const handleConfirm = () => {
    if (selectedDate && selectedTime) {
      console.log('Confirming slot:', { date: selectedDate, time: selectedTime });
      onSelectSlot({ date: selectedDate, time: selectedTime });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-gray-600">Loading available slots...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/doctors')}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Select Time Slot</h1>
            <p className="text-gray-600">Choose your preferred appointment time</p>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      {/* Doctor Info */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-4">
          <img
            src={doctor.image}
            alt={doctor.name}
            className="w-16 h-16 rounded-full object-cover border-2 border-blue-100"
          />
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-900">{doctor.name}</h2>
            <p className="text-blue-600 font-medium">{doctor.specialty}</p>
            <p className="text-gray-600">{doctor.experience} experience</p>
          </div>
          <div className="text-right">
            <div className="flex items-center text-yellow-500 mb-1">
              ⭐ <span className="ml-1 font-semibold">{doctor.rating}</span>
            </div>
            <p className="text-sm text-gray-600">Rating</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Date Selection */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-6">
            <Calendar className="w-6 h-6 text-blue-600 mr-3" />
            <h3 className="text-xl font-semibold text-gray-900">Select Date</h3>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {availableDates.map((date) => {
              const hasSlots = slotDates.includes(date.value);
              const availableTimes = getTimeSlotsForDate(date.value);
              return (
                <button
                  key={date.value}
                  onClick={() => hasSlots && handleDateSelect(date.value)}
                  disabled={!hasSlots}
                  className={`p-4 rounded-xl text-left transition-all border-2 ${
                    selectedDate === date.value
                      ? 'border-blue-600 bg-blue-50 text-blue-900'
                      : hasSlots
                      ? 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      : 'border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{date.label}</span>
                    <div className="flex items-center space-x-2">
                      {date.isToday && hasSlots && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                          Available ({availableTimes.length} slots)
                        </span>
                      )}
                      {hasSlots && !date.isToday && (
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          {availableTimes.length} slots
                        </span>
                      )}
                      {!hasSlots && (
                        <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full">
                          No slots
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Time Selection */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-6">
            <Clock className="w-6 h-6 text-blue-600 mr-3" />
            <h3 className="text-xl font-semibold text-gray-900">Select Time</h3>
          </div>

          {!selectedDate ? (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">Please select a date first</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {getTimeSlotsForDate(selectedDate).map((time) => (
                <button
                  key={time}
                  onClick={() => handleTimeSelect(time)}
                  className={`p-3 rounded-xl text-center transition-all border-2 ${
                    selectedTime === time
                      ? 'border-blue-600 bg-blue-50 text-blue-900'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <span className="font-medium">{time}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Confirmation */}
      {selectedDate && selectedTime && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Appointment Summary</h3>
          <div className="space-y-3 mb-6">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Doctor</span>
              <span className="font-medium text-gray-900">{doctor.name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Specialty</span>
              <span className="font-medium text-gray-900">{doctor.specialty}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Date</span>
              <span className="font-medium text-gray-900">
                {new Date(selectedDate).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Time</span>
              <span className="font-medium text-gray-900">{selectedTime}</span>
            </div>
          </div>

          <button
            onClick={handleConfirm}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Continue to Confirmation
          </button>
        </div>
      )}
    </div>
  );
};

export default TimeSlotPicker;