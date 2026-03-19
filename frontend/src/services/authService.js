import api from './api'; // นำเข้าตัวแปร api ที่เราตั้งค่าไว้

export const authService = {
  login: async (email, password) => {
    try {
      // ส่ง POST request ไปที่ http://localhost:8080/api/auth/login
      const response = await api.post('/auth/login', { email, password });
      
      // ส่งข้อมูล User/Token กลับไปให้ฝั่ง UI
      return response.data; 
    } catch (error) {
      // ถ้า Backend ส่ง HTTP Status Error กลับมา (เช่น 401 UNAUTHORIZED)
      throw new Error(error.response?.data || 'อีเมลหรือรหัสผ่านไม่ถูกต้อง');
    }
  },

  registerReseller: async (data) => {
    try {
      // ส่ง POST request ไปที่ http://localhost:8080/api/auth/register
      const response = await api.post('/auth/register', data);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data || 'สมัครสมาชิกไม่สำเร็จ');
    }
  }
};