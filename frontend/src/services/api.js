import axios from 'axios';

const api = axios.create({
 
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://bootcamp04.duckdns.org/api', 
  headers: {
    'Content-Type': 'application/json',
  },
});

// Mock interceptor to inject auth token (ใช้ของเดิมได้เลย)
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