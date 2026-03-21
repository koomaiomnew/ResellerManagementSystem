import React, { useState } from 'react';
import { authService } from '../services/authService';
import { useNavigate, Link } from 'react-router-dom';
import { showToast } from '../components/Toast';

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    // 🚨 1. Form Validation (ดักหน้าบ้านแบบรัดกุมสุดๆ)
    const email = data.email.trim(); // ตัดช่องว่างหัวท้ายที่อาจเผลอพิมพ์
    const password = data.password;
    const shopSlug = data.shopSlug.trim();

    // ✉️ ดัก Email: บังคับรูปแบบมาตรฐาน a-z, 0-9 และห้ามมีภาษาไทยเด็ดขาด
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return showToast('รูปแบบอีเมลไม่ถูกต้อง (กรุณาใช้อีเมลภาษาอังกฤษเท่านั้น)', 'error');
    }

    // 🔑 ดัก Password
    if (password.includes(' ')) {
      return showToast('รหัสผ่านห้ามมีช่องว่างเด็ดขาด!', 'error');
    }
    if (/[ก-๙]/.test(password)) {
      return showToast('รหัสผ่านต้องเป็นภาษาอังกฤษหรือตัวเลขเท่านั้น!', 'error');
    }
    if (password.length < 6) {
      return showToast('รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร', 'error');
    }

    // 🛒 ดัก Shop Slug: ย้ำอีกชั้นเผื่อโดนแก้ HTML หน้าบ้าน
    const slugRegex = /^[A-Za-z0-9_-]+$/;
    if (!slugRegex.test(shopSlug)) {
      return showToast('ลิงก์ร้านค้าต้องเป็นภาษาอังกฤษ ตัวเลข ขีดกลาง(-) และขีดล่าง(_) เท่านั้น!', 'error');
    }

    setLoading(true);

    // 🌟 2. จัดเตรียม Payload ส่งให้ Backend
    const payload = {
      name: data.fullname.trim(),
      email: email, // ใช้อีเมลที่ trim() แล้ว
      password: password,
      role: "reseller",
      phone: data.phone || "0000000000",
      items: [
        {
          shopName: data.shopName.trim(),
          shopSlug: shopSlug.toLowerCase() // บังคับลิงก์ร้านเป็นตัวเล็กทั้งหมดเพื่อป้องกันปัญหา URL
        }
      ]
    };

    try {
      await authService.registerReseller(payload);
      showToast('สมัครสมาชิกสำเร็จ! กรุณาเข้าสู่ระบบ', 'success');
      navigate('/login');
    } catch (err) {
      showToast(err.message || 'เกิดข้อผิดพลาดในการสมัครสมาชิก', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-xl w-full bg-white p-8 sm:p-10 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 transition-all">
        
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 mb-4">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Apply as Reseller</h2>
          <p className="mt-2 text-sm text-slate-500">Join RMS and start your own shop today</p>
        </div>

        {/* Form Section */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          
          {/* ส่วนที่ 1: ข้อมูลส่วนตัว */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5 ml-1">Full Name</label>
              <input name="fullname" type="text" required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm" placeholder="สมชาย ใจดี" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5 ml-1">Email Address</label>
              <input name="email" type="email" required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm" placeholder="email@example.com" />
            </div>
            <div className="sm:col-span-2 relative">
              <label className="block text-sm font-medium text-slate-700 mb-1.5 ml-1">Password</label>
              <input name="password" type={showPassword ? 'text' : 'password'} required className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm" placeholder="••••••••" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute bottom-0 right-0 p-3 h-[46px] text-slate-400 hover:text-slate-600 focus:outline-none">
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                )}
              </button>
            </div>
          </div>

          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
            <div className="relative flex justify-center"><span className="px-3 bg-white text-xs text-slate-400 font-medium uppercase tracking-wider">Shop Information</span></div>
          </div>

          {/* ส่วนที่ 2: ข้อมูลร้านค้า */}
          <div className="grid grid-cols-1 gap-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5 ml-1">Shop Name (ชื่อร้านค้า)</label>
              <input name="shopName" type="text" required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm" placeholder="My Cool Shop" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5 ml-1">Shop URL (ลิงก์ร้านค้า)</label>
              <div className="flex rounded-xl overflow-hidden shadow-sm border border-slate-200 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
                <span className="inline-flex items-center px-4 bg-slate-100 text-slate-500 text-sm font-medium border-r border-slate-200">/shop/</span>
                <input name="shopSlug" type="text" required pattern="[A-Za-z0-9_-]+" title="อังกฤษ ตัวเลข ขีดกลาง(-) และขีดล่าง(_) เท่านั้น" className="flex-1 w-full px-4 py-3 bg-slate-50 focus:bg-white focus:outline-none text-sm" placeholder="my-cool-shop" />
              </div>
              <p className="mt-2 ml-1 text-xs text-slate-500">ภาษาอังกฤษ ไม่มีเว้นวรรค เช่น my-shop</p>
            </div>
          </div>

          {/* Submit Button */}
          <button type="submit" disabled={loading} className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-lg shadow-blue-600/20 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed mt-4">
            {loading ? (
              <><svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Submitting...</>
            ) : 'Submit Application'}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-slate-500">Already a reseller?{' '}
            <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-500 transition-colors">Sign in</Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Register;