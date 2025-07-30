import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Demo data
let doctors = [
  {
    id: '1',
    name: 'Dr. Priya Sharma',
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
    name: 'Dr. Rajesh Kumar',
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
    name: 'Dr. Sarah Johnson',
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
    name: 'Dr. Michael Chen',
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
  const { doctorId, date, time, patientId, type = 'Consultation' } = req.body;
  
  const doctor = doctors.find(d => d.id === doctorId);
  if (!doctor) {
    return res.status(404).json({ message: 'Doctor not found' });
  }

  // Check if slot is available
  const slot = doctor.availableSlots.find(s => s.date === date && s.time === time);
  if (!slot || !slot.available) {
    return res.status(400).json({ message: 'Slot not available' });
  }

  // Create appointment
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

  // Mark slot as unavailable
  slot.available = false;

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
  console.log(`   GET  /api/users/:id`);
  console.log(`   PUT  /api/users/:id`);
  console.log(`   GET  /api/doctors/search`);
  console.log(`   GET  /api/stats`);
}); 