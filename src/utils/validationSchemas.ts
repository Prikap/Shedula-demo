import * as yup from 'yup';

// Login validation schema
export const loginSchema = yup.object({
  email: yup
    .string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

// Patient signup validation schema
export const patientSignupSchema = yup.object({
  name: yup
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters')
    .required('Name is required'),
  email: yup
    .string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    )
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
  phone: yup
    .string()
    .matches(
      /^[\+]?[1-9][\d]{0,15}$/,
      'Please enter a valid phone number'
    )
    .required('Phone number is required'),
});

// Doctor signup validation schema
export const doctorSignupSchema = yup.object({
  name: yup
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters')
    .required('Name is required'),
  email: yup
    .string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    )
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
  phone: yup
    .string()
    .matches(
      /^[\+]?[1-9][\d]{0,15}$/,
      'Please enter a valid phone number'
    )
    .required('Phone number is required'),
  specialty: yup
    .string()
    .required('Medical specialty is required'),
  experience: yup
    .string()
    .required('Years of experience is required'),
  qualifications: yup
    .array()
    .of(yup.string().required('Qualification cannot be empty'))
    .min(1, 'At least one qualification is required'),
  consultationFee: yup
    .number()
    .min(0, 'Consultation fee must be a positive number')
    .required('Consultation fee is required'),
  bio: yup
    .string()
    .max(500, 'Bio must be less than 500 characters')
    .optional(),
});

// Doctor profile update validation schema
export const doctorProfileSchema = yup.object({
  name: yup
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters')
    .required('Name is required'),
  email: yup
    .string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  phone: yup
    .string()
    .matches(
      /^[\+]?[1-9][\d]{0,15}$/,
      'Please enter a valid phone number'
    )
    .required('Phone number is required'),
  specialty: yup
    .string()
    .required('Medical specialty is required'),
  experience: yup
    .string()
    .required('Years of experience is required'),
  qualifications: yup
    .array()
    .of(yup.string().required('Qualification cannot be empty'))
    .min(1, 'At least one qualification is required'),
  consultationFee: yup
    .number()
    .min(0, 'Consultation fee must be a positive number')
    .required('Consultation fee is required'),
  bio: yup
    .string()
    .max(500, 'Bio must be less than 500 characters')
    .optional(),
  clinicAddress: yup
    .string()
    .max(200, 'Clinic address must be less than 200 characters')
    .optional(),
});

// Patient profile validation schema
export const patientProfileSchema = yup.object({
  name: yup
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters')
    .required('Name is required'),
  email: yup
    .string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  phone: yup
    .string()
    .matches(
      /^[\+]?[1-9][\d]{0,15}$/,
      'Please enter a valid phone number'
    )
    .required('Phone number is required'),
});

// Appointment booking validation schema
export const appointmentBookingSchema = yup.object({
  type: yup
    .string()
    .required('Appointment type is required'),
  symptoms: yup
    .string()
    .max(500, 'Symptoms description must be less than 500 characters')
    .optional(),
  notes: yup
    .string()
    .max(300, 'Additional notes must be less than 300 characters')
    .optional(),
});

// Contact form validation schema
export const contactFormSchema = yup.object({
  name: yup
    .string()
    .min(2, 'Name must be at least 2 characters')
    .required('Name is required'),
  email: yup
    .string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  subject: yup
    .string()
    .min(5, 'Subject must be at least 5 characters')
    .max(100, 'Subject must be less than 100 characters')
    .required('Subject is required'),
  message: yup
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(1000, 'Message must be less than 1000 characters')
    .required('Message is required'),
});

// Search validation schema
export const searchSchema = yup.object({
  query: yup
    .string()
    .min(2, 'Search query must be at least 2 characters')
    .max(50, 'Search query must be less than 50 characters')
    .required('Search query is required'),
});

// Password reset validation schema
export const passwordResetSchema = yup.object({
  email: yup
    .string()
    .email('Please enter a valid email address')
    .required('Email is required'),
});

// Change password validation schema
export const changePasswordSchema = yup.object({
  currentPassword: yup
    .string()
    .required('Current password is required'),
  newPassword: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    )
    .required('New password is required'),
  confirmNewPassword: yup
    .string()
    .oneOf([yup.ref('newPassword')], 'Passwords must match')
    .required('Please confirm your new password'),
});

export type LoginFormData = yup.InferType<typeof loginSchema>;
export type PatientSignupFormData = yup.InferType<typeof patientSignupSchema>;
export type DoctorSignupFormData = yup.InferType<typeof doctorSignupSchema>;
export type DoctorProfileFormData = yup.InferType<typeof doctorProfileSchema>;
export type PatientProfileFormData = yup.InferType<typeof patientProfileSchema>;
export type AppointmentBookingFormData = yup.InferType<typeof appointmentBookingSchema>;
export type ContactFormData = yup.InferType<typeof contactFormSchema>;
export type SearchFormData = yup.InferType<typeof searchSchema>;
export type PasswordResetFormData = yup.InferType<typeof passwordResetSchema>;
export type ChangePasswordFormData = yup.InferType<typeof changePasswordSchema>;