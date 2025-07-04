const axios = require('axios');

const API_BASE_URL = 'http://localhost:5001/api';

async function testAuthFlow() {
  try {
    console.log('Testing authentication flow...');
    
    // Test 1: Register a new user
    console.log('\n1. Testing user registration...');
    const registerResponse = await axios.post(`${API_BASE_URL}/auth/register`, {
      username: 'testuser',
      password: 'testpass'
    });
    console.log('Register response:', registerResponse.data);
    
    // Test 2: Login with the user
    console.log('\n2. Testing user login...');
    const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
      username: 'testuser',
      password: 'testpass'
    });
    console.log('Login response:', loginResponse.data);
    
    const token = loginResponse.data.token;
    
    // Test 3: Test authenticated endpoint
    console.log('\n3. Testing authenticated endpoint...');
    const authHeaders = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
    
    const topicsResponse = await axios.get(`${API_BASE_URL}/topics`, authHeaders);
    console.log('Topics response:', topicsResponse.data);
    
    // Test 4: Test learning path generation
    console.log('\n4. Testing learning path generation...');
    const pathResponse = await axios.post(`${API_BASE_URL}/path`, {
      knownTopics: ['arrays']
    }, authHeaders);
    console.log('Path response:', pathResponse.data);
    
    console.log('\n✅ All tests passed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

testAuthFlow(); 