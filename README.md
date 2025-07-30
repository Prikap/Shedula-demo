# Shedula Demo

A modern medical appointment booking system built with React, TypeScript, and Tailwind CSS.

## Features

- **User Authentication**: Secure login system with demo credentials
- **Doctor Selection**: Browse and search for doctors by specialty
- **Appointment Booking**: Book appointments with available time slots
- **Dashboard**: View upcoming and past appointments
- **Profile Management**: Update user profile information
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Express.js, Node.js
- **Development**: Vite, ESLint
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd Shedula-demo
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

#### Option 1: Run Frontend Only (Demo Mode)
```bash
npm run dev
```
This will start the frontend with mock data at `http://localhost:5173`

#### Option 2: Run Full Stack (Frontend + API)
```bash
npm run dev:full
```
This will start both the frontend and the demo API server:
- Frontend: `http://localhost:5173`
- API Server: `http://localhost:3001`

#### Option 3: Run API Server Only
```bash
npm run server
```
This will start only the demo API server at `http://localhost:3001`

## Demo API

The project includes a comprehensive demo API with the following endpoints:

### Authentication
- `POST /api/auth/login` - User login (accepts any credentials)

### Doctors
- `GET /api/doctors` - Get all doctors
- `GET /api/doctors/:id` - Get specific doctor
- `GET /api/doctors/:id/slots` - Get available time slots
- `GET /api/doctors/search` - Search doctors by specialty/name

### Appointments
- `POST /api/appointments` - Book new appointment
- `GET /api/appointments/:patientId` - Get user appointments
- `PATCH /api/appointments/:id` - Update appointment status
- `DELETE /api/appointments/:id` - Cancel appointment

### Users
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update user profile

### Statistics
- `GET /api/stats` - Get system statistics
- `GET /api/health` - Health check

For detailed API documentation, see [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

## Demo Credentials

- **Email**: Any valid email format
- **Password**: Any password (minimum 1 character)

## Project Structure

```
Shedula-demo/
├── src/
│   ├── components/          # React components
│   │   ├── Login.tsx
│   │   ├── Dashboard.tsx
│   │   ├── DoctorSelection.tsx
│   │   ├── TimeSlotPicker.tsx
│   │   ├── BookingConfirmation.tsx
│   │   └── Profile.tsx
│   ├── services/           # API services
│   │   └── api.ts
│   ├── App.tsx            # Main application component
│   └── main.tsx           # Application entry point
├── server/                # Demo API server
│   └── index.js
├── API_DOCUMENTATION.md   # Complete API documentation
└── test-api.js           # API test script
```

## Available Scripts

- `npm run dev` - Start development server (frontend only)
- `npm run dev:full` - Start both frontend and API server
- `npm run server` - Start API server only
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Testing the API

You can test the API endpoints using the included test script:

```bash
node test-api.js
```

This will run a comprehensive test of all API endpoints and display the results.

## Features in Detail

### Doctor Selection
- Browse doctors by specialty
- View doctor ratings and experience
- See available appointment slots
- Filter and search functionality

### Appointment Booking
- Select preferred time slots
- Confirm appointment details
- Real-time slot availability
- Booking confirmation

### Dashboard
- Overview of upcoming appointments
- Quick access to book new appointments
- Appointment status tracking
- User profile management

### Profile Management
- Update personal information
- View appointment history
- Manage account settings

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is for demonstration purposes only.

## Support

For questions or issues, please open an issue in the repository.