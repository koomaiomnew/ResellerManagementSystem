import React, { useState } from 'react';
import { authService } from '../services/authService';
import { useNavigate, Link } from 'react-router-dom';
import { showToast } from '../components/Toast';

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // ดึงข้อมูลจากฟอร์ม
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    // 🌟 สร้าง Payload ให้ตรงกับที่ Java Backend ต้องการเป๊ะๆ
    const payload = {
      name: data.fullname,
      email: data.email,
      password: data.password,
      role: "reseller",
      phone: data.phone, // ส่งเบอร์โทรไปด้วย (เผื่อ Backend ใช้)
      items: [
        {
          shopName: data.shopName, // ชื่อร้านค้าที่แสดงผล (กรอกภาษาไทยได้ มีเว้นวรรคได้)
          shopSlug: data.shopSlug  // URL ของร้านค้า (ภาษาอังกฤษเท่านั้น)
        }
      ]
    };

    try {
      // เรียกใช้ API (ใช้ payload ที่จัดรูปแล้ว ไม่ใช่ data ดิบๆ)
      const res = await authService.registerReseller(payload);
      showToast('สมัครสมาชิกสำเร็จ กรุณาเข้าสู่ระบบ', 'success');
      navigate('/login');
    } catch (err) {
      // แจ้งเตือน Error จากฝั่ง Backend เช่น "อีเมลนี้ถูกใช้งานแล้ว"
      showToast(err.message || 'สมัครสมาชิกไม่สำเร็จ', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg border border-gray-100">
        <div>
          <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900">
            Apply as Reseller
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Join RMS and start your own shop today
          </p>
        </div>
        
        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          
          {/* ----- ส่วนที่ 1: ข้อมูลส่วนตัว ----- */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input name="fullname" type="text" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="สมชาย ใจดี" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input name="phone" type="tel" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="0812345678" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email Address</label>
            <input name="email" type="email" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="email@example.com" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input name="password" type="password" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="••••••••" />
          </div>

          <hr className="my-6 border-gray-200" />

          {/* ----- ส่วนที่ 2: ข้อมูลร้านค้า ----- */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Shop Name (ชื่อร้านค้า)</label>
            <input name="shopName" type="text" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="My Cool Shop" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Shop URL (ลิงก์ร้านค้า)</label>
            <div className="mt-1 flex rounded-md shadow-sm">
              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                /shop/
              </span>
              <input 
                name="shopSlug" 
                type="text" 
                required 
                pattern="[A-Za-z0-9_-]+" 
                title="ใช้ได้แค่ตัวอักษรภาษาอังกฤษ ตัวเลข ขีดกลาง(-) และขีดล่าง(_) เท่านั้น" 
                className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" 
                placeholder="my-cool-shop" 
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">ใช้สำหรับเป็นลิงก์ร้านค้าของคุณ (ภาษาอังกฤษ ไม่มีเว้นวรรค)</p>
          </div>

          {/* ----- ปุ่ม Submit ----- */}
          <div className="pt-4">
            <button 
              type="submit" 
              disabled={loading}
              className="group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none shadow-md transition disabled:bg-blue-300"
            >
              {loading ? 'Submitting Application...' : 'Submit Application'}
            </button>
          </div>
          
          <div className="text-center mt-4">
            <span className="text-sm text-gray-600">Already a reseller? </span>
            <Link to="/login" className="text-sm font-medium text-blue-600 hover:text-blue-500">
              Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;