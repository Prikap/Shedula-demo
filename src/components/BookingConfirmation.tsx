import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Calendar, Clock, User, Phone, MapPin, FileText } from 'lucide-react';
import { Doctor, apiService } from '../services/api';
import { useBooking } from '../contexts/BookingContext';
import { useAuth } from '../contexts/AuthContext';

interface BookingConfirmationProps {
  doctor: Doctor;
  slot: { date: string; time: string };
  onConfirm: () => void;
  onBack: () => void;
}

const BookingConfirmation: React.FC<BookingConfirmationProps> = ({ 
  doctor, 
  slot, 
  onConfirm, 
  onBack 
}) => {
  const [isBooking, setIsBooking] = useState(false);
  const [error, setError] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [notes, setNotes] = useState('');
  const [appointmentType, setAppointmentType] = useState('Consultation');
  const navigate = useNavigate();
  const { addAppointment, clearBooking } = useBooking();
  const { user } = useAuth();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleConfirmBooking = async () => {
    if (!user) {
      setError('Please log in to book an appointment.');
      return;
    }

    try {
      setIsBooking(true);
      setError('');

      // Book appointment via API
      const appointment = await apiService.bookAppointment({
        doctorId: doctor.id,
        date: slot.date,
        time: slot.time,
        patientId: user.id,
        type: appointmentType
      });
      
      // Add appointment to the booking context
      addAppointment({
        doctor,
        date: slot.date,
        time: slot.time,
        status: 'confirmed'
      });

      // Clear the booking context
      clearBooking();

      // Call the onConfirm callback
      onConfirm();
    } catch (err) {
      setError('Failed to book appointment. Please try again.');
      console.error('Booking error:', err);
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/appointment-booking')}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Confirm Appointment</h1>
            <p className="text-gray-600">Review and confirm your booking</p>
          </div>
        </div>
      </div>

      {/* Success Icon */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Almost Done!</h2>
        <p className="text-gray-600">Please review your appointment details before confirming</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      {/* Appointment Details Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Doctor Section */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <img
              src={doctor.image}
              alt={doctor.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-blue-100"
            />
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900">{doctor.name}</h3>
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

        {/* Appointment Details */}
        <div className="p-6 space-y-4">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Appointment Details</h4>
          
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <Calendar className="w-5 h-5 text-blue-600" />
              <span className="text-gray-600">Date:</span>
              <span className="font-medium text-gray-900">{formatDate(slot.date)}</span>
            </div>
            
            <div className="flex items-center space-x-3">
              <Clock className="w-5 h-5 text-blue-600" />
              <span className="text-gray-600">Time:</span>
              <span className="font-medium text-gray-900">{slot.time}</span>
            </div>
            
            <div className="flex items-center space-x-3">
              <User className="w-5 h-5 text-blue-600" />
              <span className="text-gray-600">Type:</span>
              <select
                value={appointmentType}
                onChange={(e) => setAppointmentType(e.target.value)}
                className="font-medium text-gray-900 border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Consultation">Consultation</option>
                <option value="Follow-up">Follow-up</option>
                <option value="Check-up">Check-up</option>
                <option value="Emergency">Emergency</option>
              </select>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="p-6 border-t border-gray-200 space-y-4">
          <h4 className="text-lg font-semibold text-gray-900">Additional Information</h4>
          
          <div>
            <label htmlFor="symptoms" className="block text-sm font-medium text-gray-700 mb-2">
              Symptoms or Reason for Visit
            </label>
            <textarea
              id="symptoms"
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Please describe your symptoms or reason for the appointment..."
            />
          </div>
          
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
              Additional Notes (Optional)
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Any additional information you'd like the doctor to know..."
            />
          </div>
        </div>

        {/* Doctor Contact Info */}
        <div className="p-6 bg-gray-50 border-t border-gray-200">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Appointment Information</h4>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <User className="w-5 h-5 text-blue-600" />
              <span className="text-gray-600">Specialty:</span>
              <span className="font-medium text-gray-900">{doctor.specialty}</span>
            </div>
            <div className="flex items-center space-x-3">
              <Clock className="w-5 h-5 text-blue-600" />
              <span className="text-gray-600">Experience:</span>
              <span className="font-medium text-gray-900">{doctor.experience}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Important Notes */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <h4 className="font-semibold text-blue-900 mb-2">Important Notes</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Please arrive 10 minutes before your appointment time</li>
          <li>• Bring your ID and insurance information</li>
          <li>• You can cancel or reschedule up to 24 hours before</li>
          <li>• A confirmation email will be sent to your registered email</li>
        </ul>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-4">
        <button
          onClick={() => navigate('/appointment-booking')}
          className="flex-1 bg-gray-100 text-gray-700 py-4 px-6 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
        >
          Back to Edit
        </button>
        <button
          onClick={handleConfirmBooking}
          disabled={isBooking}
          className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isBooking ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Confirming...</span>
            </div>
          ) : (
            'Confirm Appointment'
          )}
        </button>
      </div>
    </div>
  );
};

export default BookingConfirmation;