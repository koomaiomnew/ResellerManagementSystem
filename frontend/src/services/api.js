import axios from 'axios';

const api = axios.create({
  baseURL: 'https://bootcamp04.duckdns.org/api', // ปรับตาม URL จริงของคุณ
});

// 👉 ตัวดักจับ: แอบแนบบัตร VIP (Token) ไปใน Header ทุกครั้ง
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;