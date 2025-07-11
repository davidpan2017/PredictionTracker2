import axios from 'axios';

const API_URL = 'http://localhost:5000';

const getToken = () => {
  return localStorage.getItem('token');
};

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors globally
api.interceptors.response.use(
  response => response,
  error => {
    const message = error.response?.data?.message || error.message;
    if (error.response?.status === 401) {
      error.showMessage = 'Authentication required - please login';
    }
    return Promise.reject({...error, message});
  }
);

// Update login to use email and password (default backend expects email)
export const login = async (email, password) => {
  const response = await api.post('/api/login', { email, password });
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
  }
  if (response.data.username) {
    localStorage.setItem('username', response.data.username);
  }
  return response;
};

// Update register to use email, first_name, password, confirm_password
export const register = async (email, first_name, password, confirm_password) => {
  const response = await api.post('/api/register', { email, first_name, password, confirm_password });
  return response;
};

export const getPredictions = () => {
  return api.get('/api/predictions');
};

export const submitPrediction = (predictionData) => {
  return api.post('/api/predictions', predictionData);
};

const apiMethods = {
  login,
  register,
  getPredictions,
  submitPrediction,
};

export default apiMethods;
