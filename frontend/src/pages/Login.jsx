import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { showToast } from '../components/Toast';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State สำหรับเปิด/ปิดตาดูรหัสผ่าน

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');

    try {
      const user = await login(email, password);
      const role = user.role?.toUpperCase();

      // ระบบจะแยกให้อัตโนมัติว่าใครเป็น Admin หรือ Reseller
      if (role === 'ADMIN') {
        showToast('เข้าสู่ระบบผู้ดูแลระบบสำเร็จ', 'success');
        navigate('/admin/dashboard');
      } else if (role === 'RESELLER') {
        showToast('เข้าสู่ระบบสำเร็จ', 'success');
        navigate('/reseller/dashboard');
      } else {
        showToast('ไม่พบสิทธิ์การใช้งานที่ถูกต้อง', 'warning');
        navigate('/');
      }
    } catch (err) {
      showToast(err.message || 'อีเมลหรือรหัสผ่านไม่ถูกต้อง', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-md w-full bg-white p-10 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 transition-all">
        
        {/* Header Section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 mb-4">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Welcome Back
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            ลงชื่อเข้าใช้ระบบ Reseller Management
          </p>
        </div>

        {/* Form Section */}
        <form className="space-y-5" onSubmit={handleSubmit}>
          
          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5 ml-1">อีเมล</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              </div>
              <input
                name="email"
                type="email"
                required
                className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl placeholder-slate-400 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 sm:text-sm transition-all"
                placeholder="name@example.com"
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5 ml-1">รหัสผ่าน</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <input
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                className="block w-full pl-11 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-xl placeholder-slate-400 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 sm:text-sm transition-all"
                placeholder="••••••••"
              />
              {/* ปุ่มเปิด/ปิดตา */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
              >
                {showPassword ? (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Forgot Password Link (Optional) */}
          <div className="flex items-center justify-end">
            <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors">
              ลืมรหัสผ่าน?
            </a>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-lg shadow-blue-600/20 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed mt-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                กำลังเข้าสู่ระบบ...
              </>
            ) : (
              'เข้าสู่ระบบ'
            )}
          </button>
        </form>

        {/* Footer Section */}
        <div className="mt-8 text-center">
          <p className="text-sm text-slate-500">
            ยังไม่มีบัญชีตัวแทนจำหน่าย?{' '}
            <Link to="/register" className="font-semibold text-blue-600 hover:text-blue-500 transition-colors">
              สมัครสมาชิกเลย
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Login;