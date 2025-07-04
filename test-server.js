const axios = require('axios');

const API_BASE_URL = 'http://localhost:5001/api';

async function testServer() {
  try {
    console.log('Testing server connectivity...');
    
    // Test 1: Health check
    console.log('\n1. Testing health endpoint...');
    const healthResponse = await axios.get(`${API_BASE_URL.replace('/api', '')}/health`);
    console.log('Health response:', healthResponse.data);
    
    // Test 2: Public topics endpoint
    console.log('\n2. Testing public topics endpoint...');
    const topicsResponse = await axios.get(`${API_BASE_URL}/topics`);
    console.log('Topics response:', topicsResponse.data);
    
    // Test 3: Test with auth header (should still work for public endpoint)
    console.log('\n3. Testing topics endpoint with auth header...');
    const topicsWithAuthResponse = await axios.get(`${API_BASE_URL}/topics`, {
      headers: {
        Authorization: 'Bearer test-token'
      }
    });
    console.log('Topics with auth response:', topicsWithAuthResponse.data);
    
    console.log('\n✅ Server is responding correctly!');
    
  } catch (error) {
    console.error('❌ Server test failed:', error.response?.data || error.message);
    console.error('Status:', error.response?.status);
    console.error('Headers:', error.response?.headers);
  }
}

testServer(); 