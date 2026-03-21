import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      // 🌟 1. รับค่าที่ส่งมาจาก backend ซึ่งตอนนี้จะเป็น { accessToken: "...", user: {...} }
      const responseData = await authService.login(email, password);
      
      // 🌟 2. ดึงแยก Token และ User ออกจากกัน
      const { accessToken, user } = responseData;

      // 🌟 3. เซ็ต State ให้หน้าเว็บรู้จัก User (เหมือนเดิม)
      setUser(user);
      
      // 🌟 4. เก็บข้อมูลลง localStorage (แยกเก็บ Token ไว้อีกตัว)
      localStorage.setItem('currentUser', JSON.stringify(user));
      localStorage.setItem('token', accessToken); // 👈 สำคัญมาก! เก็บ Token ไว้ส่ง API
      
      // 🌟 5. รีเทิร์นแค่ข้อมูล user กลับไปให้ Login.js (Login.js จะได้ไม่ต้องแก้โค้ดเลย)
      return user; 
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token'); // 🌟 อย่าลืมลบ Token ทิ้งตอนกดออกจากระบบด้วย!
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};