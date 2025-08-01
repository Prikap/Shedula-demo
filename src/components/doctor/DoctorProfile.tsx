import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDoctorAuth } from '../../contexts/DoctorContext';
import { apiService, DoctorUser } from '../../services/api';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Stethoscope, 
  GraduationCap, 
  Clock, 
  DollarSign, 
  Star,
  Camera,
  Save,
  ArrowLeft,
  Edit3
} from 'lucide-react';

const DoctorProfile: React.FC = () => {
  const { doctor, updateProfile } = useDoctorAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState<Partial<DoctorUser>>({
    name: '',
    email: '',
    phone: '',
    specialty: '',
    experience: '',
    bio: '',
    qualifications: [],
    clinicAddress: '',
    consultationFee: 0,
    image: ''
  });

  useEffect(() => {
    if (doctor) {
      setFormData({
        name: doctor.name || '',
        email: doctor.email || '',
        phone: doctor.phone || '',
        specialty: doctor.specialty || '',
        experience: doctor.experience || '',
        bio: doctor.bio || '',
        qualifications: doctor.qualifications || [],
        clinicAddress: doctor.clinicAddress || '',
        consultationFee: doctor.consultationFee || 0,
        image: doctor.image || ''
      });
    }
  }, [doctor]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'consultationFee' ? Number(value) : value
    }));
  };

  const handleQualificationChange = (index: number, value: string) => {
    const newQualifications = [...(formData.qualifications || [])];
    newQualifications[index] = value;
    setFormData(prev => ({
      ...prev,
      qualifications: newQualifications
    }));
  };

  const addQualification = () => {
    setFormData(prev => ({
      ...prev,
      qualifications: [...(prev.qualifications || []), '']
    }));
  };

  const removeQualification = (index: number) => {
    const newQualifications = [...(formData.qualifications || [])];
    newQualifications.splice(index, 1);
    setFormData(prev => ({
      ...prev,
      qualifications: newQualifications
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!doctor) return;

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const updatedDoctor = await apiService.updateDoctorProfile(doctor.id, formData);
      updateProfile(updatedDoctor);
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to update profile. Please try again.');
      console.error('Profile update error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (doctor) {
      setFormData({
        name: doctor.name || '',
        email: doctor.email || '',
        phone: doctor.phone || '',
        specialty: doctor.specialty || '',
        experience: doctor.experience || '',
        bio: doctor.bio || '',
        qualifications: doctor.qualifications || [],
        clinicAddress: doctor.clinicAddress || '',
        consultationFee: doctor.consultationFee || 0,
        image: doctor.image || ''
      });
    }
    setIsEditing(false);
    setError('');
  };

  if (!doctor) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
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
                  Doctor Profile
                </h1>
                <p className="text-sm text-gray-600">Manage your professional information</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Edit Profile</span>
                </button>
              ) : (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isLoading ? 'Saving...' : 'Save Changes'}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Status Messages */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Profile Header */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                  {formData.image ? (
                    <img
                      src={formData.image}
                      alt={formData.name}
                      className="w-24 h-24 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-white text-2xl font-bold">
                      {formData.name?.charAt(0)?.toUpperCase() || 'D'}
                    </span>
                  )}
                </div>
                {isEditing && (
                  <button
                    type="button"
                    className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Dr. {formData.name}
                  </h2>
                  <div className="flex items-center space-x-1">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="text-gray-600 font-medium">{doctor.rating}</span>
                  </div>
                </div>
                <p className="text-blue-600 font-medium mb-1">{formData.specialty}</p>
                <p className="text-gray-600">{formData.experience} of experience</p>
              </div>
            </div>
          </div>

          {/* Basic Information */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <User className="w-5 h-5 mr-2 text-blue-600" />
              Basic Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                ) : (
                  <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900">Dr. {formData.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                ) : (
                  <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900 flex items-center">
                    <Mail className="w-4 h-4 mr-2 text-gray-500" />
                    {formData.email}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                ) : (
                  <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900 flex items-center">
                    <Phone className="w-4 h-4 mr-2 text-gray-500" />
                    {formData.phone}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Consultation Fee (₹)
                </label>
                {isEditing ? (
                  <input
                    type="number"
                    name="consultationFee"
                    value={formData.consultationFee}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                ) : (
                  <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900 flex items-center">
                    <DollarSign className="w-4 h-4 mr-2 text-gray-500" />
                    ₹{formData.consultationFee}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Professional Information */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <Stethoscope className="w-5 h-5 mr-2 text-blue-600" />
              Professional Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Medical Specialty
                </label>
                {isEditing ? (
                  <select
                    name="specialty"
                    value={formData.specialty}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select Specialty</option>
                    <option value="Cardiologist">Cardiologist</option>
                    <option value="Dermatologist">Dermatologist</option>
                    <option value="Pediatrician">Pediatrician</option>
                    <option value="Neurologist">Neurologist</option>
                    <option value="Orthopedic">Orthopedic</option>
                    <option value="General Physician">General Physician</option>
                    <option value="Gynecologist">Gynecologist</option>
                    <option value="Psychiatrist">Psychiatrist</option>
                    <option value="ENT Specialist">ENT Specialist</option>
                    <option value="Ophthalmologist">Ophthalmologist</option>
                  </select>
                ) : (
                  <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900">{formData.specialty}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Years of Experience
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    placeholder="e.g., 10 years"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                ) : (
                  <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900 flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-gray-500" />
                    {formData.experience}
                  </p>
                )}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Clinic Address
              </label>
              {isEditing ? (
                <textarea
                  name="clinicAddress"
                  value={formData.clinicAddress}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your clinic address"
                />
              ) : (
                <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900 flex items-start">
                  <MapPin className="w-4 h-4 mr-2 text-gray-500 mt-0.5" />
                  {formData.clinicAddress || 'No address provided'}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Professional Bio
              </label>
              {isEditing ? (
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Tell patients about your expertise and approach to healthcare..."
                />
              ) : (
                <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900">
                  {formData.bio || 'No bio provided'}
                </p>
              )}
            </div>
          </div>

          {/* Qualifications */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <GraduationCap className="w-5 h-5 mr-2 text-blue-600" />
              Qualifications & Certifications
            </h3>
            
            <div className="space-y-4">
              {formData.qualifications?.map((qualification, index) => (
                <div key={index} className="flex items-center space-x-3">
                  {isEditing ? (
                    <>
                      <input
                        type="text"
                        value={qualification}
                        onChange={(e) => handleQualificationChange(index, e.target.value)}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., MBBS, MD, Fellowship"
                      />
                      <button
                        type="button"
                        onClick={() => removeQualification(index)}
                        className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        Remove
                      </button>
                    </>
                  ) : (
                    <p className="flex-1 px-4 py-3 bg-gray-50 rounded-xl text-gray-900">
                      {qualification}
                    </p>
                  )}
                </div>
              ))}
              
              {isEditing && (
                <button
                  type="button"
                  onClick={addQualification}
                  className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors"
                >
                  + Add Qualification
                </button>
              )}
              
              {!isEditing && (!formData.qualifications || formData.qualifications.length === 0) && (
                <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-500 italic">
                  No qualifications added yet
                </p>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DoctorProfile;