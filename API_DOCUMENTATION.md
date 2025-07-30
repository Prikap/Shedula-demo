# Shedula Demo API Documentation

This document describes the demo API endpoints for the Shedula medical appointment booking system.

## Base URL
```
http://localhost:3001/api
```

## Authentication

### Login
**POST** `/auth/login`

Login with email and password (demo authentication - accepts any credentials).

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "user": {
    "id": "user123",
    "name": "John Doe",
    "email": "user@example.com",
    "phone": "+1-555-0123"
  },
  "token": "demo-token-1704067200000"
}
```

## Doctors

### Get All Doctors
**GET** `/doctors`

Returns a list of all available doctors.

**Response:**
```json
[
  {
    "id": "1",
    "name": "Dr. Priya Sharma",
    "specialty": "Cardiologist",
    "experience": "15 years",
    "rating": 4.8,
    "image": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face",
    "availability": ["Monday", "Wednesday", "Friday"],
    "availableSlots": [
      {
        "date": "2025-01-27",
        "time": "09:00 AM",
        "available": true
      }
    ]
  }
]
```

### Get Doctor by ID
**GET** `/doctors/:id`

Returns details of a specific doctor.

**Response:**
```json
{
  "id": "1",
  "name": "Dr. Priya Sharma",
  "specialty": "Cardiologist",
  "experience": "15 years",
  "rating": 4.8,
  "image": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face",
  "availability": ["Monday", "Wednesday", "Friday"],
  "availableSlots": [...]
}
```

### Get Doctor Available Slots
**GET** `/doctors/:id/slots`

Returns available time slots for a specific doctor.

**Response:**
```json
[
  {
    "date": "2025-01-27",
    "time": "09:00 AM",
    "available": true
  },
  {
    "date": "2025-01-27",
    "time": "10:00 AM",
    "available": true
  }
]
```

### Search Doctors
**GET** `/doctors/search?specialty=cardiology&name=priya`

Search doctors by specialty and/or name.

**Query Parameters:**
- `specialty` (optional): Filter by medical specialty
- `name` (optional): Filter by doctor name

**Response:**
```json
[
  {
    "id": "1",
    "name": "Dr. Priya Sharma",
    "specialty": "Cardiologist",
    ...
  }
]
```

## Appointments

### Book Appointment
**POST** `/appointments`

Book a new appointment with a doctor.

**Request Body:**
```json
{
  "doctorId": "1",
  "date": "2025-01-27",
  "time": "09:00 AM",
  "patientId": "user123",
  "type": "Consultation"
}
```

**Response:**
```json
{
  "id": "appointment-123",
  "doctorName": "Dr. Priya Sharma",
  "specialty": "Cardiologist",
  "date": "2025-01-27",
  "time": "09:00 AM",
  "status": "upcoming",
  "type": "Consultation",
  "patientId": "user123"
}
```

### Get User Appointments
**GET** `/appointments/:patientId`

Get all appointments for a specific user.

**Response:**
```json
[
  {
    "id": "1",
    "doctorName": "Dr. Priya Sharma",
    "specialty": "Cardiologist",
    "date": "2025-01-25",
    "time": "10:00 AM",
    "status": "upcoming",
    "type": "Consultation",
    "patientId": "user123"
  }
]
```

### Update Appointment Status
**PATCH** `/appointments/:id`

Update the status of an appointment.

**Request Body:**
```json
{
  "status": "completed"
}
```

**Response:**
```json
{
  "id": "1",
  "doctorName": "Dr. Priya Sharma",
  "specialty": "Cardiologist",
  "date": "2025-01-25",
  "time": "10:00 AM",
  "status": "completed",
  "type": "Consultation",
  "patientId": "user123"
}
```

### Cancel Appointment
**DELETE** `/appointments/:id`

Cancel an appointment and free up the time slot.

**Response:**
```json
{
  "message": "Appointment cancelled successfully"
}
```

## Users

### Get User Profile
**GET** `/users/:id`

Get user profile information.

**Response:**
```json
{
  "id": "user123",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1-555-0123"
}
```

### Update User Profile
**PUT** `/users/:id`

Update user profile information.

**Request Body:**
```json
{
  "name": "John Smith",
  "phone": "+1-555-9999"
}
```

**Response:**
```json
{
  "id": "user123",
  "name": "John Smith",
  "email": "john@example.com",
  "phone": "+1-555-9999"
}
```

## Statistics

### Get System Statistics
**GET** `/stats`

Get overall system statistics.

**Response:**
```json
{
  "totalAppointments": 15,
  "upcomingAppointments": 8,
  "completedAppointments": 6,
  "cancelledAppointments": 1,
  "totalDoctors": 4
}
```

## Health Check

### API Health Status
**GET** `/health`

Check if the API is running.

**Response:**
```json
{
  "status": "OK",
  "message": "Shedula API is running"
}
```

## Error Responses

All endpoints return appropriate HTTP status codes and error messages:

```json
{
  "message": "Doctor not found"
}
```

Common status codes:
- `200` - Success
- `201` - Created (for new appointments)
- `400` - Bad Request
- `404` - Not Found
- `500` - Internal Server Error

## Running the API Server

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the server:
   ```bash
   npm run server
   ```

3. The API will be available at `http://localhost:3001/api`

4. To run both frontend and API simultaneously:
   ```bash
   npm run dev:full
   ```

## Demo Data

The API includes demo data for:
- 4 doctors with different specialties
- Sample appointments
- Demo user profiles
- Available time slots for each doctor

The data is stored in memory and resets when the server restarts. 