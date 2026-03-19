import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { showToast } from '../components/Toast';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // ดึงข้อมูล Email และ Password จากฟอร์ม
    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');

    try {
      // เรียกใช้ฟังก์ชัน login (จะไปคุยกับ Backend และคืนค่าข้อมูล User กลับมา)
      const user = await login(email, password);
      
      // ดึง Role มาแปลงเป็นตัวใหญ่ทั้งหมดเพื่อความชัวร์ในการเช็กเงื่อนไข
      const role = user.role?.toUpperCase(); 
      
      // เช็ก Role แล้วส่งไปหน้า Dashboard ที่ถูกต้อง
      if (role === 'ADMIN') {
        showToast('Login successful as Admin', 'success');
        navigate('/admin/dashboard');
      } else if (role === 'RESELLER') {
        showToast('Login successful', 'success');
        navigate('/reseller/dashboard');
      } else {
        // กรณีที่ไม่ใช่ทั้ง 2 role ด้านบน (เช่น เป็น customer หรือ role พัง)
        showToast('Unrecognized role, redirecting to home...', 'warning');
        navigate('/'); 
      }
      
    } catch (err) {
      // ดักจับ Error จาก Backend เช่น รหัสผิด อีเมลไม่มีในระบบ
      showToast(err.message || 'Login failed. Please check your credentials.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg border border-gray-100">
        <div>
          <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900">
            Sign in to RMS
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Reseller Management System Portal
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email address</label>
              <input
                name="email"
                type="email"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="your-email@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                name="password"
                type="password"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-md transition disabled:bg-blue-300"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>

          <div className="text-center mt-4">
            <span className="text-sm text-gray-600">Don't have a reseller account? </span>
            <Link to="/register" className="text-sm font-medium text-blue-600 hover:text-blue-500">
              Apply now
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;