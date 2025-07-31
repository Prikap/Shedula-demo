import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Doctor } from '../services/api';
import { Search, Star, MapPin, Clock, ArrowLeft, Filter } from 'lucide-react';

interface DoctorSelectionProps {
  onSelectDoctor: (doctor: Doctor) => void;
  onBack: () => void;
}

const DoctorSelection: React.FC<DoctorSelectionProps> = ({ onSelectDoctor, onBack }) => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate loading doctors
    setTimeout(() => {
      const mockDoctors: Doctor[] = [
        {
          id: '1',
          name: 'Dr. Priya Sharma',
          specialty: 'Cardiologist',
          experience: '15 years',
          rating: 4.8,
          image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face',
          availability: ['Monday', 'Wednesday', 'Friday'],
          availableSlots: []
        },
        {
          id: '2',
          name: 'Dr. Rajesh Kumar',
          specialty: 'Dermatologist',
          experience: '12 years',
          rating: 4.6,
          image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face',
          availability: ['Tuesday', 'Thursday', 'Saturday'],
          availableSlots: []
        },
        {
          id: '3',
          name: 'Dr. Sarah Johnson',
          specialty: 'Pediatrician',
          experience: '18 years',
          rating: 4.9,
          image: 'https://images.unsplash.com/photo-1594824475544-3a1e0c4c7e6f?w=150&h=150&fit=crop&crop=face',
          availability: ['Monday', 'Wednesday', 'Friday'],
          availableSlots: []
        },
        {
          id: '4',
          name: 'Dr. Michael Chen',
          specialty: 'Neurologist',
          experience: '20 years',
          rating: 4.7,
          image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
          availability: ['Tuesday', 'Thursday'],
          availableSlots: []
        }
      ];
      setDoctors(mockDoctors);
      setFilteredDoctors(mockDoctors);
      setIsLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = doctors;
    
    if (searchTerm) {
      filtered = filtered.filter(doctor =>
        doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedSpecialty) {
      filtered = filtered.filter(doctor =>
        doctor.specialty === selectedSpecialty
      );
    }
    
    setFilteredDoctors(filtered);
  }, [searchTerm, selectedSpecialty, doctors]);

  const specialties = Array.from(new Set(doctors.map(doctor => doctor.specialty)));

  const handleDoctorSelect = (doctor: Doctor) => {
    onSelectDoctor(doctor);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-gray-600">Loading doctors...</span>
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
            onClick={() => navigate('/dashboard')}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Find a Doctor</h1>
            <p className="text-gray-600">Choose from our network of specialists</p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search doctors by name or specialty..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Specialty Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors appearance-none bg-white"
            >
              <option value="">All Specialties</option>
              {specialties.map(specialty => (
                <option key={specialty} value={specialty}>{specialty}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDoctors.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No doctors found</h3>
            <p className="text-gray-600">Try adjusting your search criteria</p>
          </div>
        ) : (
          filteredDoctors.map((doctor) => (
            <div
              key={doctor.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200 cursor-pointer group"
              onClick={() => handleDoctorSelect(doctor)}
            >
              {/* Doctor Image */}
              <div className="relative h-48 bg-gradient-to-br from-blue-50 to-indigo-50">
                <img
                  src={doctor.image}
                  alt={doctor.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-sm font-semibold text-gray-900">{doctor.rating}</span>
                </div>
              </div>

              {/* Doctor Info */}
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{doctor.name}</h3>
                <p className="text-blue-600 font-medium mb-2">{doctor.specialty}</p>
                
                <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{doctor.experience}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>Available</span>
                  </div>
                </div>

                {/* Availability */}
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">Available on:</p>
                  <div className="flex flex-wrap gap-1">
                    {doctor.availability.map((day, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full"
                      >
                        {day}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Book Button */}
                <button
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 group-hover:shadow-lg"
                >
                  Book Appointment
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Results Summary */}
      <div className="text-center text-gray-600">
        Showing {filteredDoctors.length} of {doctors.length} doctors
      </div>
    </div>
  );
};

export default DoctorSelection;