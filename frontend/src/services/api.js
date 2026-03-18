import axios from 'axios';

// Since we use mock services, we won't strictly use axios for the data layer,
// but the requirement explicitly mentions Axios. We can simulate interceptors 
// or keep a configured instance here for future real-API integration.

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Dummy URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Mock interceptor to inject auth token
api.interceptors.request.use((config) => {
  const user = localStorage.getItem('user');
  if (user) {
    const { token } = JSON.parse(user);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
