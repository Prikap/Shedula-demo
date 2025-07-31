// Test script to debug login functionality
const API_BASE_URL = process.env.VITE_API_URL || 'http://localhost:3001/api';

async function testLogin() {
  console.log('🔍 Testing login functionality...');
  console.log(`📡 API Base URL: ${API_BASE_URL}`);
  
  try {
    // Test health endpoint
    console.log('\n1. Testing health endpoint...');
    const healthResponse = await fetch(`${API_BASE_URL}/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Health check:', healthData);
    
    // Test login endpoint
    console.log('\n2. Testing login endpoint...');
    const loginResponse = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'demo@example.com',
        password: 'password123'
      })
    });
    
    if (!loginResponse.ok) {
      console.error('❌ Login failed:', loginResponse.status, loginResponse.statusText);
      const errorText = await loginResponse.text();
      console.error('Error details:', errorText);
    } else {
      const loginData = await loginResponse.json();
      console.log('✅ Login successful:', loginData);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('This might be a CORS issue or the server is not running');
  }
}

testLogin(); 