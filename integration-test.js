// Simple integration test to verify API endpoints
const axios = require('axios');

async function testAPI() {
  const baseURL = 'http://localhost:5000';
  
  try {
    // Test the root endpoint
    console.log('Testing root endpoint...');
    const rootResponse = await axios.get(`${baseURL}/`);
    console.log('Root endpoint response:', rootResponse.data);
    
    // Test the subjects endpoint
    console.log('\nTesting subjects endpoint...');
    try {
      const subjectsResponse = await axios.get(`${baseURL}/api/subjects`);
      console.log('Subjects endpoint response status:', subjectsResponse.status);
      console.log('Subjects endpoint response data keys:', Object.keys(subjectsResponse.data));
    } catch (error) {
      console.log('Subjects endpoint error:', error.response?.data || error.message);
    }
    
    // Test the auth endpoint
    console.log('\nTesting auth endpoint...');
    try {
      const authResponse = await axios.post(`${baseURL}/api/auth/login`, {
        email: 'test@example.com',
        password: 'invalid'
      });
      console.log('Auth endpoint response status:', authResponse.status);
    } catch (error) {
      console.log('Auth endpoint error (expected):', error.response?.status, error.response?.data);
    }
    
    console.log('\nIntegration tests completed.');
  } catch (error) {
    console.error('Error during integration test:', error.message);
  }
}

testAPI();