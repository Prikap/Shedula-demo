// Test script for Shedula Demo API
const API_BASE = 'http://localhost:3001/api';

async function testAPI() {
  console.log('🧪 Testing Shedula Demo API...\n');

  try {
    // Test health check
    console.log('1. Testing health check...');
    const health = await fetch(`${API_BASE}/health`);
    const healthData = await health.json();
    console.log('✅ Health check:', healthData);

    // Test login
    console.log('\n2. Testing login...');
    const loginResponse = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@example.com', password: 'password123' })
    });
    const loginData = await loginResponse.json();
    console.log('✅ Login successful:', { user: loginData.user.name, email: loginData.user.email });

    // Test get doctors
    console.log('\n3. Testing get doctors...');
    const doctorsResponse = await fetch(`${API_BASE}/doctors`);
    const doctors = await doctorsResponse.json();
    console.log(`✅ Found ${doctors.length} doctors:`);
    doctors.forEach(doctor => {
      console.log(`   - ${doctor.name} (${doctor.specialty})`);
    });

    // Test get doctor slots
    console.log('\n4. Testing get doctor slots...');
    const slotsResponse = await fetch(`${API_BASE}/doctors/1/slots`);
    const slots = await slotsResponse.json();
    console.log(`✅ Found ${slots.length} available slots for Dr. Priya Sharma`);

    // Test book appointment
    console.log('\n5. Testing book appointment...');
    const bookingResponse = await fetch(`${API_BASE}/appointments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        doctorId: '1',
        date: '2025-01-27',
        time: '09:00 AM',
        patientId: loginData.user.id,
        type: 'Consultation'
      })
    });
    const booking = await bookingResponse.json();
    console.log('✅ Appointment booked:', booking);

    // Test get user appointments
    console.log('\n6. Testing get user appointments...');
    const appointmentsResponse = await fetch(`${API_BASE}/appointments/${loginData.user.id}`);
    const appointments = await appointmentsResponse.json();
    console.log(`✅ Found ${appointments.length} appointments for user`);

    // Test search doctors
    console.log('\n7. Testing search doctors...');
    const searchResponse = await fetch(`${API_BASE}/doctors/search?specialty=cardiology`);
    const searchResults = await searchResponse.json();
    console.log(`✅ Found ${searchResults.length} cardiologists`);

    // Test get stats
    console.log('\n8. Testing get stats...');
    const statsResponse = await fetch(`${API_BASE}/stats`);
    const stats = await statsResponse.json();
    console.log('✅ System stats:', stats);

    // Test cancel appointment
    console.log('\n9. Testing cancel appointment...');
    const cancelResponse = await fetch(`${API_BASE}/appointments/${booking.id}`, {
      method: 'DELETE'
    });
    const cancelData = await cancelResponse.json();
    console.log('✅ Appointment cancelled:', cancelData);

    console.log('\n🎉 All API tests completed successfully!');

  } catch (error) {
    console.error('❌ API test failed:', error.message);
  }
}

// Run the tests
testAPI(); 