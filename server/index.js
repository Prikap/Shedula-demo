import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const PORT = process.env.PORT || 3001;

// CORS configuration for production
const allowedOrigins = [
  'http://localhost:5173', // Development
  'https://shedula-frontend.onrender.com', // Render frontend
  'https://shedula-demo.onrender.com', // Alternative frontend name
  process.env.CORS_ORIGIN // Environment variable
].filter(Boolean); // Remove undefined values

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());

// Demo data
let doctors = [
  {
    id: '1',
    name: 'Dr. Shanaya',
    specialty: 'Cardiologist',
    experience: '15 years',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face',
    availability: ['Monday', 'Wednesday', 'Friday'],
    availableSlots: [
      { date: '2025-01-27', time: '09:00 AM', available: true },
      { date: '2025-01-27', time: '10:00 AM', available: true },
      { date: '2025-01-27', time: '11:00 AM', available: false },
      { date: '2025-01-29', time: '02:00 PM', available: true },
      { date: '2025-01-29', time: '03:00 PM', available: true },
      { date: '2025-01-31', time: '09:00 AM', available: true },
      { date: '2025-01-31', time: '10:00 AM', available: true }
    ]
  },
  {
    id: '2',
    name: 'Dr. Anil Kumar',
    specialty: 'Dermatologist',
    experience: '12 years',
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face',
    availability: ['Tuesday', 'Thursday', 'Saturday'],
    availableSlots: [
      { date: '2025-01-28', time: '10:00 AM', available: true },
      { date: '2025-01-28', time: '11:00 AM', available: true },
      { date: '2025-01-30', time: '02:00 PM', available: true },
      { date: '2025-01-30', time: '03:00 PM', available: false },
      { date: '2025-02-01', time: '09:00 AM', available: true },
      { date: '2025-02-01', time: '10:00 AM', available: true }
    ]
  },
  {
    id: '3',
    name: 'Dr. Shivani Patel',
    specialty: 'Pediatrician',
    experience: '18 years',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1594824475544-3a1e0c4c7e6f?w=150&h=150&fit=crop&crop=face',
    availability: ['Monday', 'Wednesday', 'Friday'],
    availableSlots: [
      { date: '2025-01-27', time: '09:00 AM', available: true },
      { date: '2025-01-27', time: '10:00 AM', available: true },
      { date: '2025-01-29', time: '02:00 PM', available: true },
      { date: '2025-01-29', time: '03:00 PM', available: true },
      { date: '2025-01-31', time: '09:00 AM', available: true },
      { date: '2025-01-31', time: '10:00 AM', available: true }
    ]
  },
  {
    id: '4',
    name: 'Dr. Rohan Upadhyay',
    specialty: 'Neurologist',
    experience: '20 years',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    availability: ['Tuesday', 'Thursday'],
    availableSlots: [
      { date: '2025-01-28', time: '10:00 AM', available: true },
      { date: '2025-01-28', time: '11:00 AM', available: true },
      { date: '2025-01-30', time: '02:00 PM', available: true },
      { date: '2025-01-30', time: '03:00 PM', available: true }
    ]
  }
];

let appointments = [
  {
    id: '1',
    doctorName: 'Dr. Priya Sharma',
    specialty: 'Cardiologist',
    date: '2025-01-25',
    time: '10:00 AM',
    status: 'upcoming',
    type: 'Consultation',
    patientId: 'user123'
  },
  {
    id: '2',
    doctorName: 'Dr. Rajesh Kumar',
    specialty: 'Dermatologist',
    date: '2025-01-20',
    time: '2:00 PM',
    status: 'completed',
    type: 'Check-up',
    patientId: 'user123'
  }
];

let users = [
  {
    id: 'user123',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1-555-0123'
  }
];

// Doctor users data
let doctorUsers = [
  {
    id: 'doc1',
    name: 'Dr. Sarah Johnson',
    email: 'doctor@example.com',
    phone: '+1-555-0001',
    specialty: 'Cardiologist',
    experience: '10 years',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face',
    bio: 'Experienced cardiologist with expertise in heart disease prevention and treatment.',
    qualifications: ['MBBS', 'MD Cardiology', 'Fellowship in Interventional Cardiology'],
    clinicAddress: '123 Medical Center, Downtown',
    consultationFee: 500,
    availability: [
      {
        day: 'Monday',
        isAvailable: true,
        timeSlots: [
          { time: '09:00 AM', isAvailable: true },
          { time: '10:00 AM', isAvailable: true },
          { time: '11:00 AM', isAvailable: false },
          { time: '02:00 PM', isAvailable: true },
          { time: '03:00 PM', isAvailable: true }
        ]
      },
      {
        day: 'Tuesday',
        isAvailable: false,
        timeSlots: []
      },
      {
        day: 'Wednesday',
        isAvailable: true,
        timeSlots: [
          { time: '09:00 AM', isAvailable: true },
          { time: '10:00 AM', isAvailable: true },
          { time: '02:00 PM', isAvailable: true }
        ]
      },
      {
        day: 'Thursday',
        isAvailable: true,
        timeSlots: [
          { time: '09:00 AM', isAvailable: true },
          { time: '10:00 AM', isAvailable: false },
          { time: '11:00 AM', isAvailable: true }
        ]
      },
      {
        day: 'Friday',
        isAvailable: true,
        timeSlots: [
          { time: '09:00 AM', isAvailable: true },
          { time: '10:00 AM', isAvailable: true }
        ]
      },
      {
        day: 'Saturday',
        isAvailable: false,
        timeSlots: []
      },
      {
        day: 'Sunday',
        isAvailable: false,
        timeSlots: []
      }
    ],
    isVerified: true,
    createdAt: '2024-01-01T00:00:00.000Z',
    totalPatients: 150,
    totalAppointments: 500
  }
];

// Doctor appointments data
let doctorAppointments = [
  {
    id: 'dapp1',
    patientId: 'user123',
    patientName: 'John Doe',
    patientPhone: '+1-555-0123',
    patientEmail: 'john@example.com',
    date: '2025-01-27',
    time: '10:00 AM',
    status: 'pending',
    type: 'Consultation',
    notes: '',
    symptoms: 'Chest pain and shortness of breath',
    prescription: '',
    createdAt: '2025-01-25T10:00:00.000Z',
    updatedAt: '2025-01-25T10:00:00.000Z'
  },
  {
    id: 'dapp2',
    patientId: 'user123',
    patientName: 'John Doe',
    patientPhone: '+1-555-0123',
    patientEmail: 'john@example.com',
    date: '2025-01-25',
    time: '09:00 AM',
    status: 'completed',
    type: 'Follow-up',
    notes: 'Patient responded well to treatment',
    symptoms: 'Follow-up for previous consultation',
    prescription: 'Continue current medication for 2 weeks',
    createdAt: '2025-01-20T09:00:00.000Z',
    updatedAt: '2025-01-25T09:30:00.000Z'
  }
];

// Patients data for doctors
let patients = [
  {
    id: 'user123',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1-555-0123',
    age: 35,
    gender: 'Male',
    address: '456 Oak Street, City',
    medicalHistory: ['Hypertension', 'Diabetes Type 2'],
    lastVisit: '2025-01-25',
    totalAppointments: 5
  }
];

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Shedula API is running' });
});

// Get all doctors
app.get('/api/doctors', (req, res) => {
  res.json(doctors);
});

// Get doctor by ID
app.get('/api/doctors/:id', (req, res) => {
  const doctor = doctors.find(d => d.id === req.params.id);
  if (!doctor) {
    return res.status(404).json({ message: 'Doctor not found' });
  }
  res.json(doctor);
});

// Get available slots for a doctor
app.get('/api/doctors/:id/slots', (req, res) => {
  const doctor = doctors.find(d => d.id === req.params.id);
  if (!doctor) {
    return res.status(404).json({ message: 'Doctor not found' });
  }
  res.json(doctor.availableSlots.filter(slot => slot.available));
});

// Book an appointment
app.post('/api/appointments', (req, res) => {
  const { doctorId, date, time, patientId, type = 'Consultation', symptoms = '', notes = '' } = req.body;
  
  const doctor = doctors.find(d => d.id === doctorId);
  if (!doctor) {
    return res.status(404).json({ message: 'Doctor not found' });
  }

  // Check if slot is available
  const slot = doctor.availableSlots.find(s => s.date === date && s.time === time);
  if (!slot || !slot.available) {
    return res.status(400).json({ message: 'Slot not available' });
  }

  // Get patient info
  const patient = users.find(u => u.id === patientId) || {
    id: patientId,
    name: 'Unknown Patient',
    email: 'unknown@example.com',
    phone: '+1-555-0000'
  };

  // Create patient appointment
  const appointment = {
    id: uuidv4(),
    doctorName: doctor.name,
    specialty: doctor.specialty,
    date,
    time,
    status: 'upcoming',
    type,
    patientId
  };

  appointments.push(appointment);

  // Create doctor appointment
  const doctorAppointment = {
    id: uuidv4(),
    patientId: patient.id,
    patientName: patient.name,
    patientPhone: patient.phone,
    patientEmail: patient.email,
    date,
    time,
    status: 'pending', // Doctor appointments start as pending
    type,
    notes: notes || '',
    symptoms: symptoms || '',
    prescription: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  doctorAppointments.push(doctorAppointment);

  // Mark slot as unavailable
  slot.available = false;

  // Add patient to patients list if not exists
  const existingPatient = patients.find(p => p.id === patient.id);
  if (!existingPatient) {
    patients.push({
      id: patient.id,
      name: patient.name,
      email: patient.email,
      phone: patient.phone,
      age: undefined,
      gender: undefined,
      address: undefined,
      medicalHistory: [],
      lastVisit: date,
      totalAppointments: 1
    });
  } else {
    // Update existing patient
    existingPatient.lastVisit = date;
    existingPatient.totalAppointments += 1;
  }

  res.status(201).json(appointment);
});

// Get appointments for a user
app.get('/api/appointments/:patientId', (req, res) => {
  const userAppointments = appointments.filter(a => a.patientId === req.params.patientId);
  res.json(userAppointments);
});

// Update appointment status
app.patch('/api/appointments/:id', (req, res) => {
  const { status } = req.body;
  const appointment = appointments.find(a => a.id === req.params.id);
  
  if (!appointment) {
    return res.status(404).json({ message: 'Appointment not found' });
  }

  appointment.status = status;
  res.json(appointment);
});

// Cancel appointment
app.delete('/api/appointments/:id', (req, res) => {
  const appointment = appointments.find(a => a.id === req.params.id);
  
  if (!appointment) {
    return res.status(404).json({ message: 'Appointment not found' });
  }

  // Find the doctor and mark the slot as available again
  const doctor = doctors.find(d => d.name === appointment.doctorName);
  if (doctor) {
    const slot = doctor.availableSlots.find(s => s.date === appointment.date && s.time === appointment.time);
    if (slot) {
      slot.available = true;
    }
  }

  appointments = appointments.filter(a => a.id !== req.params.id);
  res.json({ message: 'Appointment cancelled successfully' });
});

// User authentication (demo)
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  // Demo authentication - accept any email/password
  const user = users.find(u => u.email === email) || {
    id: uuidv4(),
    name: email.split('@')[0],
    email,
    phone: '+1-555-0000'
  };

  res.json({
    user,
    token: 'demo-token-' + Date.now()
  });
});

// User signup (demo)
app.post('/api/auth/signup', (req, res) => {
  const { name, email, password, phone } = req.body;
  
  // Check if user already exists
  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists with this email' });
  }

  // Create new user
  const newUser = {
    id: uuidv4(),
    name,
    email,
    phone: phone || '+1-555-0000'
  };

  users.push(newUser);

  res.status(201).json({
    user: newUser,
    token: 'demo-token-' + Date.now()
  });
});

// Get user profile
app.get('/api/users/:id', (req, res) => {
  const user = users.find(u => u.id === req.params.id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.json(user);
});

// Update user profile
app.put('/api/users/:id', (req, res) => {
  const userIndex = users.findIndex(u => u.id === req.params.id);
  if (userIndex === -1) {
    return res.status(404).json({ message: 'User not found' });
  }

  users[userIndex] = { ...users[userIndex], ...req.body };
  res.json(users[userIndex]);
});

// Search doctors
app.get('/api/doctors/search', (req, res) => {
  const { specialty, name } = req.query;
  
  let filteredDoctors = doctors;
  
  if (specialty) {
    filteredDoctors = filteredDoctors.filter(d => 
      d.specialty.toLowerCase().includes(specialty.toLowerCase())
    );
  }
  
  if (name) {
    filteredDoctors = filteredDoctors.filter(d => 
      d.name.toLowerCase().includes(name.toLowerCase())
    );
  }
  
  res.json(filteredDoctors);
});

// Get appointment statistics
app.get('/api/stats', (req, res) => {
  const totalAppointments = appointments.length;
  const upcomingAppointments = appointments.filter(a => a.status === 'upcoming').length;
  const completedAppointments = appointments.filter(a => a.status === 'completed').length;
  const cancelledAppointments = appointments.filter(a => a.status === 'cancelled').length;

  res.json({
    totalAppointments,
    upcomingAppointments,
    completedAppointments,
    cancelledAppointments,
    totalDoctors: doctors.length
  });
});

// Doctor Authentication Routes
app.post('/api/auth/doctor/login', (req, res) => {
  const { email, password } = req.body;
  
  // Demo authentication - accept any email/password for existing doctors
  let doctor = doctorUsers.find(d => d.email === email);
  
  if (!doctor) {
    // For demo purposes, create a basic doctor if not found
    doctor = {
      id: uuidv4(),
      name: email.split('@')[0],
      email,
      phone: '+1-555-0000',
      specialty: 'General Physician',
      experience: '5 years',
      rating: 4.5,
      image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face',
      bio: 'Dedicated healthcare professional',
      qualifications: ['MBBS'],
      clinicAddress: 'Medical Center',
      consultationFee: 300,
      availability: [],
      isVerified: true,
      createdAt: new Date().toISOString(),
      totalPatients: 0,
      totalAppointments: 0
    };
    doctorUsers.push(doctor);
  }

  res.json({
    doctor,
    token: 'doctor-token-' + Date.now()
  });
});

app.post('/api/auth/doctor/signup', (req, res) => {
  const { name, email, password, phone, specialty, experience, qualifications, consultationFee, bio } = req.body;
  
  // Check if doctor already exists
  const existingDoctor = doctorUsers.find(d => d.email === email);
  if (existingDoctor) {
    return res.status(400).json({ message: 'Doctor already exists with this email' });
  }

  // Create new doctor
  const newDoctor = {
    id: uuidv4(),
    name,
    email,
    phone: phone || '+1-555-0000',
    specialty,
    experience,
    rating: 4.0,
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face',
    bio: bio || '',
    qualifications: Array.isArray(qualifications) ? qualifications : [qualifications],
    clinicAddress: '',
    consultationFee: consultationFee || 0,
    availability: [
      { day: 'Monday', isAvailable: false, timeSlots: [] },
      { day: 'Tuesday', isAvailable: false, timeSlots: [] },
      { day: 'Wednesday', isAvailable: false, timeSlots: [] },
      { day: 'Thursday', isAvailable: false, timeSlots: [] },
      { day: 'Friday', isAvailable: false, timeSlots: [] },
      { day: 'Saturday', isAvailable: false, timeSlots: [] },
      { day: 'Sunday', isAvailable: false, timeSlots: [] }
    ],
    isVerified: false,
    createdAt: new Date().toISOString(),
    totalPatients: 0,
    totalAppointments: 0
  };

  doctorUsers.push(newDoctor);

  res.status(201).json({
    doctor: newDoctor,
    token: 'doctor-token-' + Date.now()
  });
});

// Doctor Profile Management
app.get('/api/doctor/profile/:id', (req, res) => {
  const doctor = doctorUsers.find(d => d.id === req.params.id);
  if (!doctor) {
    return res.status(404).json({ message: 'Doctor not found' });
  }
  res.json(doctor);
});

app.put('/api/doctor/profile/:id', (req, res) => {
  const doctorIndex = doctorUsers.findIndex(d => d.id === req.params.id);
  if (doctorIndex === -1) {
    return res.status(404).json({ message: 'Doctor not found' });
  }

  doctorUsers[doctorIndex] = { ...doctorUsers[doctorIndex], ...req.body };
  res.json(doctorUsers[doctorIndex]);
});

// Doctor Appointments Management
app.get('/api/doctor/appointments/:doctorId', (req, res) => {
  const { status } = req.query;
  let appointments = doctorAppointments.filter(a => a.doctorId === req.params.doctorId || true); // For demo, return all
  
  if (status) {
    appointments = appointments.filter(a => a.status === status);
  }
  
  res.json(appointments);
});

app.put('/api/doctor/appointments/:id', (req, res) => {
  const { status, notes } = req.body;
  const appointmentIndex = doctorAppointments.findIndex(a => a.id === req.params.id);
  
  if (appointmentIndex === -1) {
    return res.status(404).json({ message: 'Appointment not found' });
  }

  doctorAppointments[appointmentIndex] = {
    ...doctorAppointments[appointmentIndex],
    status,
    notes: notes || doctorAppointments[appointmentIndex].notes,
    updatedAt: new Date().toISOString()
  };
  
  res.json(doctorAppointments[appointmentIndex]);
});

app.put('/api/doctor/appointments/:id/reschedule', (req, res) => {
  const { newDate, newTime, reason } = req.body;
  const appointmentIndex = doctorAppointments.findIndex(a => a.id === req.params.id);
  
  if (appointmentIndex === -1) {
    return res.status(404).json({ message: 'Appointment not found' });
  }

  doctorAppointments[appointmentIndex] = {
    ...doctorAppointments[appointmentIndex],
    date: newDate,
    time: newTime,
    status: 'rescheduled',
    notes: `Rescheduled: ${reason || 'No reason provided'}`,
    updatedAt: new Date().toISOString()
  };
  
  res.json(doctorAppointments[appointmentIndex]);
});

app.put('/api/doctor/appointments/:id/prescription', (req, res) => {
  const { prescription, notes } = req.body;
  const appointmentIndex = doctorAppointments.findIndex(a => a.id === req.params.id);
  
  if (appointmentIndex === -1) {
    return res.status(404).json({ message: 'Appointment not found' });
  }

  doctorAppointments[appointmentIndex] = {
    ...doctorAppointments[appointmentIndex],
    prescription,
    notes: notes || doctorAppointments[appointmentIndex].notes,
    updatedAt: new Date().toISOString()
  };
  
  res.json(doctorAppointments[appointmentIndex]);
});

// Doctor Patients Management
app.get('/api/doctor/patients/:doctorId', (req, res) => {
  // For demo, return all patients
  res.json(patients);
});

app.get('/api/doctor/patients/:patientId', (req, res) => {
  const { doctorId } = req.query;
  const patient = patients.find(p => p.id === req.params.patientId);
  
  if (!patient) {
    return res.status(404).json({ message: 'Patient not found' });
  }

  // Get patient's appointments with this doctor
  const patientAppointments = doctorAppointments.filter(a => a.patientId === req.params.patientId);
  
  res.json({
    ...patient,
    appointments: patientAppointments
  });
});

// Doctor Availability Management
app.put('/api/doctor/availability/:doctorId', (req, res) => {
  const { availability } = req.body;
  const doctorIndex = doctorUsers.findIndex(d => d.id === req.params.doctorId);
  
  if (doctorIndex === -1) {
    return res.status(404).json({ message: 'Doctor not found' });
  }

  doctorUsers[doctorIndex].availability = availability;
  res.json({ message: 'Availability updated successfully' });
});

// Doctor Statistics
app.get('/api/doctor/stats/:doctorId', (req, res) => {
  const doctorId = req.params.doctorId;
  const doctor = doctorUsers.find(d => d.id === doctorId);
  
  if (!doctor) {
    return res.status(404).json({ message: 'Doctor not found' });
  }

  // Calculate stats from appointments
  const doctorAppointmentsList = doctorAppointments.filter(a => a.doctorId === doctorId || true); // For demo
  const today = new Date().toISOString().split('T')[0];
  
  const stats = {
    totalAppointments: doctorAppointmentsList.length,
    pendingAppointments: doctorAppointmentsList.filter(a => a.status === 'pending').length,
    confirmedAppointments: doctorAppointmentsList.filter(a => a.status === 'confirmed').length,
    completedAppointments: doctorAppointmentsList.filter(a => a.status === 'completed').length,
    cancelledAppointments: doctorAppointmentsList.filter(a => a.status === 'cancelled').length,
    totalPatients: doctor.totalPatients,
    todayAppointments: doctorAppointmentsList.filter(a => a.date === today).length,
    monthlyRevenue: doctor.consultationFee * doctorAppointmentsList.filter(a => a.status === 'completed').length,
    averageRating: doctor.rating
  };

  res.json(stats);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Shedula API server running on http://localhost:${PORT}`);
  console.log(`📋 Available endpoints:`);
  console.log(`   GET  /api/health`);
  console.log(`   GET  /api/doctors`);
  console.log(`   GET  /api/doctors/:id`);
  console.log(`   GET  /api/doctors/:id/slots`);
  console.log(`   POST /api/appointments`);
  console.log(`   GET  /api/appointments/:patientId`);
  console.log(`   PATCH /api/appointments/:id`);
  console.log(`   DELETE /api/appointments/:id`);
  console.log(`   POST /api/auth/login`);
  console.log(`   POST /api/auth/signup`);
  console.log(`   GET  /api/users/:id`);
  console.log(`   PUT  /api/users/:id`);
  console.log(`   GET  /api/doctors/search`);
  console.log(`   GET  /api/stats`);
  console.log(`   🩺 Doctor endpoints:`);
  console.log(`   POST /api/auth/doctor/login`);
  console.log(`   POST /api/auth/doctor/signup`);
  console.log(`   GET  /api/doctor/profile/:id`);
  console.log(`   PUT  /api/doctor/profile/:id`);
  console.log(`   GET  /api/doctor/appointments/:doctorId`);
  console.log(`   PUT  /api/doctor/appointments/:id`);
  console.log(`   PUT  /api/doctor/appointments/:id/reschedule`);
  console.log(`   PUT  /api/doctor/appointments/:id/prescription`);
  console.log(`   GET  /api/doctor/patients/:doctorId`);
  console.log(`   GET  /api/doctor/patients/:patientId`);
  console.log(`   PUT  /api/doctor/availability/:doctorId`);
  console.log(`   GET  /api/doctor/stats/:doctorId`);
});