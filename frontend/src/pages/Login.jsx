import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link, useSearchParams } from 'react-router-dom'; // 🌟 เพิ่ม useSearchParams
import { showToast } from '../components/Toast';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // 🌟 ดึงค่า role จาก URL (เช่น ?role=admin หรือ ?role=reseller)
  const [searchParams] = useSearchParams();
  const role = searchParams.get('role');

  // 🌟 ตรวจสอบ role เพื่อใช้เปลี่ยนข้อความในหน้าเว็บ
  const isAdmin = role === 'admin';
  const isReseller = role === 'reseller';
  const titleText = isAdmin ? 'Sign in as Admin' : isReseller ? 'Sign in as Reseller' : 'Sign in to RMS';
  const emailPlaceholder = isAdmin ? 'admin@test.com' : 'reseller@test.com';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');

    try {
      // const user = await login(email, password);
      // showToast('Login successful!');
      // if (user.role === 'ADMIN') navigate('/admin/dashboard');
      // else if (user.role === 'RESELLER') navigate('/reseller/dashboard');
      const user = await login(email, password);
      console.log("USER:", user);
      const role = user.role?.toUpperCase(); // 🔥 แก้ตรงนี้
      if (role === 'ADMIN') navigate('/admin/dashboard');
      else if (role === 'RESELLER') navigate('/reseller/dashboard');
      else navigate('/'); // fallback กันพลาด
    } catch (err) {
      showToast(err.message || 'Login failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg border border-gray-100">
        <div>
          {/* 🌟 แสดงข้อความตาม Role ที่เลือก */}
          <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900">
            {titleText}
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
                placeholder={emailPlaceholder} /* 🌟 เปลี่ยน placeholder ตาม role */
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                name="password"
                type="password"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Password"
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

          {/* 🌟 ถ้าเป็น Admin ไม่ต้องแสดงปุ่ม "Register here" เพราะแอดมินต้องเพิ่มจาก Database */}
          {!isAdmin && (
            <div className="text-center mt-4">
              <span className="text-sm text-gray-600">Don't have a reseller account? </span>
              <Link to="/register" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                Register here
              </Link>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;