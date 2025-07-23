import React, { useState } from 'react';
import { ArrowLeft, Star, Clock, Search, Filter } from 'lucide-react';
import { Doctor } from '../App';

interface DoctorSelectionProps {
  onSelectDoctor: (doctor: Doctor) => void;
  onBack: () => void;
}

const DoctorSelection: React.FC<DoctorSelectionProps> = ({ onSelectDoctor, onBack }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');

  const doctors: Doctor[] = [
    {
      id: '1',
      name: 'Dr. Priya Sharma',
      specialty: 'Cardiologist',
      experience: '15 years',
      rating: 4.9,
      image: 'https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=400',
      availability: ['9:00 AM', '10:00 AM', '2:00 PM', '3:00 PM']
    },
    {
      id: '2',
      name: 'Dr. Rajesh Kumar',
      specialty: 'Dermatologist',
      experience: '12 years',
      rating: 4.8,
      image: 'https://images.pexels.com/photos/6749778/pexels-photo-6749778.jpeg?auto=compress&cs=tinysrgb&w=400',
      availability: ['10:00 AM', '11:00 AM', '1:00 PM', '4:00 PM']
    },
    {
      id: '3',
      name: 'Dr. Anita Patel',
      specialty: 'Pediatrician',
      experience: '18 years',
      rating: 4.9,
      image: 'https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=400',
      availability: ['9:00 AM', '11:00 AM', '2:00 PM', '5:00 PM']
    },
    {
      id: '4',
      name: 'Dr. Vikram Singh',
      specialty: 'Orthopedic',
      experience: '20 years',
      rating: 4.7,
      image: 'https://images.pexels.com/photos/6749774/pexels-photo-6749774.jpeg?auto=compress&cs=tinysrgb&w=400',
      availability: ['8:00 AM', '10:00 AM', '1:00 PM', '3:00 PM']
    },
    {
      id: '5',
      name: 'Dr. Meera Reddy',
      specialty: 'Gynecologist',
      experience: '14 years',
      rating: 4.8,
      image: 'https://images.pexels.com/photos/5452274/pexels-photo-5452274.jpeg?auto=compress&cs=tinysrgb&w=400',
      availability: ['9:00 AM', '12:00 PM', '2:00 PM', '4:00 PM']
    },
    {
      id: '6',
      name: 'Dr. Arjun Gupta',
      specialty: 'Neurologist',
      experience: '16 years',
      rating: 4.9,
      image: 'https://images.pexels.com/photos/6749777/pexels-photo-6749777.jpeg?auto=compress&cs=tinysrgb&w=400',
      availability: ['10:00 AM', '11:00 AM', '3:00 PM', '5:00 PM']
    }
  ];

  const specialties = ['all', 'Cardiologist', 'Dermatologist', 'Pediatrician', 'Orthopedic', 'Gynecologist', 'Neurologist'];

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = selectedSpecialty === 'all' || doctor.specialty === selectedSpecialty;
    return matchesSearch && matchesSpecialty;
  });

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
            <h1 className="text-xl font-semibold text-gray-900">Select Doctor</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search doctors or specialties..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          <div className="flex items-center space-x-2 overflow-x-auto pb-2">
            <Filter className="w-5 h-5 text-gray-400 flex-shrink-0" />
            {specialties.map((specialty) => (
              <button
                key={specialty}
                onClick={() => setSelectedSpecialty(specialty)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                  selectedSpecialty === specialty
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {specialty === 'all' ? 'All Specialties' : specialty}
              </button>
            ))}
          </div>
        </div>

        {/* Doctors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map((doctor) => (
            <div
              key={doctor.id}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
              onClick={() => onSelectDoctor(doctor)}
            >
              <div className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-blue-100"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{doctor.name}</h3>
                    <p className="text-blue-600 font-medium">{doctor.specialty}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Experience</span>
                    <span className="font-semibold text-gray-900">{doctor.experience}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Rating</span>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                      <span className="font-semibold text-gray-900">{doctor.rating}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Available Today</span>
                    <div className="flex items-center text-green-600">
                      <Clock className="w-4 h-4 mr-1" />
                      <span className="text-sm font-medium">{doctor.availability.length} slots</span>
                    </div>
                  </div>
                </div>

                <button className="w-full mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl">
                  Book Appointment
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredDoctors.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No doctors found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorSelection;