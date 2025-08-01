import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { apiService } from '../services/api';
import { useAuth, UserType } from '../contexts/AuthContext';
import { loginSchema, LoginFormData } from '../utils/validationSchemas';

interface LoginProps {
  onLogin?: (user: { name: string; email: string }) => void;
  onSwitchToSignup?: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onSwitchToSignup }) => {
  const [userType, setUserType] = useState<UserType>('patient');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { loginAsPatient, loginAsDoctor } = useAuth();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError('');

    try {
      if (userType === 'patient') {
        const response = await apiService.login(data.email, data.password);
        loginAsPatient(response.user, response.token);
        if (onLogin) {
          onLogin({
            name: response.user.name,
            email: response.user.email
          });
        }
        navigate('/dashboard');
      } else {
        const response = await apiService.doctorLogin(data.email, data.password);
        loginAsDoctor(response.doctor, response.token);
        navigate('/doctor/dashboard');
      }
    } catch (err) {
      setError(`${userType === 'patient' ? 'Patient' : 'Doctor'} login failed. Please try again.`);
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = () => {
    if (userType === 'patient') {
      setValue('email', 'demo@example.com');
      setValue('password', 'password123');
    } else {
      setValue('email', 'doctor@example.com');
      setValue('password', 'doctor123');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mb-6">
            <span className="text-white font-bold text-2xl">S</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h2>
          <p className="text-gray-600">Sign in to your Shedula account</p>
        </div>
        
        {/* User Type Toggle */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-2">
          <div className="flex bg-gray-100 rounded-xl p-1">
            <button
              type="button"
              onClick={() => setUserType('patient')}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-all duration-200 ${
                userType === 'patient'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Patient
            </button>
            <button
              type="button"
              onClick={() => setUserType('doctor')}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-all duration-200 ${
                userType === 'doctor'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Doctor
            </button>
          </div>
        </div>
        
        {/* Form */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}
            
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                {...register('email')}
                className={`w-full px-4 py-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                {...register('password')}
                className={`w-full px-4 py-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.password ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Enter your password"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>
            
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Signing in...</span>
                  </div>
                ) : (
                  'Sign in'
                )}
              </button>
            </div>

            <div>
              <button
                type="button"
                onClick={handleDemoLogin}
                className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-xl shadow-sm text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
              >
                Use Demo Credentials
              </button>
            </div>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link
                to="/signup"
                className="text-blue-600 hover:text-blue-800 font-semibold transition-colors"
              >
                Sign up
              </Link>
            </p>
          </div>

          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
            <h4 className="text-sm font-semibold text-blue-900 mb-2">Demo Credentials</h4>
            <div className="text-xs text-blue-800 space-y-1">
              {userType === 'patient' ? (
                <>
                  <p><strong>Patient Email:</strong> demo@example.com</p>
                  <p><strong>Password:</strong> password123</p>
                </>
              ) : (
                <>
                  <p><strong>Doctor Email:</strong> doctor@example.com</p>
                  <p><strong>Password:</strong> doctor123</p>
                </>
              )}
              <p className="text-blue-600 mt-2">Or use any email/password combination</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;