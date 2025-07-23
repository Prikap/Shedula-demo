import React from 'react';
import { ArrowLeft, CheckCircle, Calendar, Clock, User, Phone, MapPin } from 'lucide-react';
import { Doctor } from '../App';

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
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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
            <h1 className="text-xl font-semibold text-gray-900">Confirm Appointment</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Almost Done!</h2>
          <p className="text-gray-600">Please review your appointment details before confirming</p>
        </div>

        {/* Appointment Details Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-8">
          {/* Doctor Section */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center space-x-4">
              <img
                src={doctor.image}
                alt={doctor.name}
                className="w-20 h-20 rounded-full object-cover border-3 border-blue-100"
              />
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900">{doctor.name}</h3>
                <p className="text-blue-600 font-medium text-lg">{doctor.specialty}</p>
                <p className="text-gray-600">{doctor.experience} experience</p>
                <div className="flex items-center mt-2">
                  <div className="flex items-center text-yellow-500">
                    ⭐ <span className="ml-1 font-semibold">{doctor.rating}</span>
                  </div>
                  <span className="text-gray-400 mx-2">•</span>
                  <span className="text-gray-600">Highly rated</span>
                </div>
              </div>
            </div>
          </div>

          {/* Appointment Details */}
          <div className="p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Appointment Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Date</p>
                    <p className="font-semibold text-gray-900">{formatDate(slot.date)}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Time</p>
                    <p className="font-semibold text-gray-900">{slot.time}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="font-semibold text-gray-900">Medical Center, Mumbai</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Phone className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Contact</p>
                    <p className="font-semibold text-gray-900">+91 98765 43210</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Consultation Type */}
          <div className="px-6 pb-6">
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-blue-900">General Consultation</p>
                  <p className="text-sm text-blue-700">Initial consultation and diagnosis</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-900">₹500</p>
                  <p className="text-sm text-blue-700">Consultation fee</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Important N */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8">
          <h4 className="font-semibold text-amber-900 mb-2">Important Notes:</h4>
          <ul className="text-sm text-amber-800 space-y-1">
            <li>• Please arrive 15 minutes before your appointment time</li>
            <li>• Bring your medical history and current medications</li>
            <li>• You can reschedule up to 2 hours before the appointment</li>
            <li>• A confirmation SMS will be sent to your registered mobile number</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={onBack}
            className="flex-1 bg-white text-gray-700 py-4 px-6 rounded-xl font-semibold border-2 border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
          >
            Go Back
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Confirm Appointment
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;