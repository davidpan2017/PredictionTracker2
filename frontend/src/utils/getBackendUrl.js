import axios from 'axios';

const getBackendUrl = () => {
  const storedUrl = localStorage.getItem('backendUrl');
  return storedUrl || 'http://localhost:5000';
};

export const apiRequest = async (method, endpoint, data = null) => {
  const { getApiHeaders } = require('./apiConfig');
  const url = `${getBackendUrl()}${endpoint}`;
  
  const config = {
    method,
    url,
    headers: getApiHeaders(),
    data
  };

  try {
    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

export default getBackendUrl;
