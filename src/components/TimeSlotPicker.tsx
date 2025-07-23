import React, { useState } from 'react';
import { ArrowLeft, Calendar, Clock, User } from 'lucide-react';
import { Doctor } from '../App';

interface TimeSlotPickerProps {
  doctor: Doctor;
  onSelectSlot: (slot: { date: string; time: string }) => void;
  onBack: () => void;
}

const TimeSlotPicker: React.FC<TimeSlotPickerProps> = ({ doctor, onSelectSlot, onBack }) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

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
  const timeSlots = ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'];

  const handleConfirm = () => {
    if (selectedDate && selectedTime) {
      onSelectSlot({ date: selectedDate, time: selectedTime });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <button
              onClick={onBack}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors mr-4"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </button>
            <h1 className="text-xl font-semibold text-gray-900">Select Time Slot</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Doctor Info */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
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
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center mb-6">
              <Calendar className="w-6 h-6 text-blue-600 mr-3" />
              <h3 className="text-xl font-semibold text-gray-900">Select Date</h3>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {availableDates.map((date) => (
                <button
                  key={date.value}
                  onClick={() => setSelectedDate(date.value)}
                  className={`p-4 rounded-xl text-left transition-all border-2 ${
                    selectedDate === date.value
                      ? 'border-blue-600 bg-blue-50 text-blue-900'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{date.label}</span>
                    {date.isToday && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        Tomorrow
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Time Selection */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
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
                {timeSlots.map((time) => (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
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
          <div className="mt-8 bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
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
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Confirm Appointment
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TimeSlotPicker;