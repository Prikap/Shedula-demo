import React from 'react';
import { Calendar, Clock, User, Plus, Heart, Bell } from 'lucide-react';
import { User as UserType, Appointment } from '../App';

interface DashboardProps {
  user: UserType;
  appointments: Appointment[];
  onBookAppointment: () => void;
  onViewProfile: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  user, 
  appointments,
  onBookAppointment,
  onViewProfile
}) => {
  const upcomingAppointments = appointments.filter(apt => apt.status === 'upcoming');
  const today = new Date().toISOString().split('T')[0];
  const todayAppointments = upcomingAppointments.filter(apt => apt.date === today);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center mr-3">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-bold text-gray-900">Shedula</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <Bell className="w-5 h-5" />
              </button>
              <button
                onClick={onViewProfile}
                className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <span className="font-medium">{user.name}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome, {user.name.split(' ')[0]}! 👋
          </h2>
          <p className="text-gray-600">
            {todayAppointments.length > 0 
              ? `You have ${todayAppointments.length} appointment${todayAppointments.length > 1 ? 's' : ''} today`
              : 'No appointments today. Take care of your health!'
            }
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <button
            onClick={onBookAppointment}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group"
          >
            <div className="flex items-center justify-between">
              <div className="text-left">
                <h3 className="text-lg font-semibold mb-1">Book Appointment</h3>
                <p className="text-blue-100">Find the right doctor</p>
              </div>
              <Plus className="w-8 h-8 group-hover:scale-110 transition-transform" />
            </div>
          </button>

          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">My Appointments</h3>
                <p className="text-gray-600">{upcomingAppointments.length} appointments</p>
              </div>
              <Calendar className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Today</h3>
                <p className="text-gray-600">{todayAppointments.length} appointments</p>
              </div>
              <Clock className="w-8 h-8 text-green-500" />
            </div>
          </div>
        </div>

        {/* Upcoming Appointments */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Upcoming Appointments</h3>
            <button
              onClick={onViewProfile}
              className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
            >
              View All
            </button>
          </div>

          {upcomingAppointments.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">No upcoming appointments</h4>
              <p className="text-gray-600 mb-6">Book your first appointment to get started</p>
              <button
                onClick={onBookAppointment}
                className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
              >
                Book Now
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {upcomingAppointments.slice(0, 3).map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{appointment.doctorName}</h4>
                      <p className="text-sm text-gray-600">{appointment.specialty}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">
                      {new Date(appointment.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                    <p className="text-sm text-gray-600">{appointment.time}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;