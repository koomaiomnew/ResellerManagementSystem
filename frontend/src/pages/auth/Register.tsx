import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Lock, Store, MapPin, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    shopName: '',
    address: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation เบื้องต้นตาม BA Document
    if (formData.password !== formData.confirmPassword) {
      toast.error('รหัสผ่านและการยืนยันรหัสผ่านไม่ตรงกัน');
      return;
    }
    if (formData.password.length < 8) {
      toast.error('รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร');
      return;
    }

    // จำลองการสมัครสำเร็จ (BR-12)
    toast.success('สมัครสมาชิกสำเร็จ! กรุณารอแอดมินอนุมัติบัญชีของคุณ');
    
    // เด้งไปหน้า Login
    setTimeout(() => {
      navigate('/login');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4 py-12 transition-colors duration-200">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col md:flex-row border border-gray-100 dark:border-gray-700">
        
        {/* ฝั่งซ้าย (ข้อความเชิญชวน) */}
        <div className="bg-gradient-to-br from-primary to-secondary p-8 text-white flex flex-col justify-center md:w-2/5">
          <Store size={48} className="mb-6 text-emerald-200" />
          <h2 className="text-3xl font-bold mb-4">ร่วมเป็นพาร์ทเนอร์กับเรา</h2>
          <p className="text-emerald-50 mb-8 leading-relaxed">
            เปิดร้านค้าออนไลน์ของคุณเองได้ง่ายๆ กำหนดราคาขายและรับกำไรได้ทันทีโดยไม่ต้องสต็อกสินค้า
          </p>
          <div className="mt-auto">
            <p className="text-sm text-emerald-100">มีบัญชีอยู่แล้วใช่ไหม?</p>
            <Link to="/login" className="inline-block mt-2 font-bold text-white hover:text-emerald-200 transition-colors flex items-center gap-2">
              เข้าสู่ระบบที่นี่ <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* ฝั่งขวา (ฟอร์มกรอกข้อมูล) */}
        <div className="p-8 md:w-3/5">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">สร้างบัญชีตัวแทน</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="relative">
              <input 
                type="text" name="name" required placeholder="ชื่อ-นามสกุล"
                value={formData.name} onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none transition-all"
              />
              <User className="absolute left-3 top-3 text-gray-400" size={18} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="relative">
                <input 
                  type="email" name="email" required placeholder="อีเมล"
                  value={formData.email} onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none transition-all"
                />
                <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
              </div>
              <div className="relative">
                <input 
                  type="tel" name="phone" required pattern="[0-9]{10}" maxLength={10} placeholder="เบอร์โทรศัพท์"
                  value={formData.phone} onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none transition-all"
                />
                <Phone className="absolute left-3 top-3 text-gray-400" size={18} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="relative">
                <input 
                  type="password" name="password" required placeholder="รหัสผ่าน "
                  value={formData.password} onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none transition-all"
                />
                <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
              </div>
              <div className="relative">
                <input 
                  type="password" name="confirmPassword" required placeholder="ยืนยันรหัสผ่าน"
                  value={formData.confirmPassword} onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none transition-all"
                />
                <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
              </div>
            </div>

            <div className="relative">
              <input 
                type="text" name="shopName" required placeholder="ตั้งชื่อร้านค้า (ภาษาอังกฤษ)"
                value={formData.shopName} onChange={handleChange}
                pattern="[A-Za-z0-9]+" title="กรุณาใช้เฉพาะตัวอักษรภาษาอังกฤษและตัวเลขเท่านั้น"
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none transition-all"
              />
              <Store className="absolute left-3 top-3 text-gray-400" size={18} />
              {formData.shopName && (
                <p className="text-xs text-primary dark:text-indigo-400 mt-1 pl-1">URL ร้านของคุณ: /shop/{formData.shopName.toLowerCase()}</p>
              )}
            </div>

            <div className="relative">
              <textarea 
                name="address" required rows={2} placeholder="ที่อยู่สำหรับติดต่อ..."
                value={formData.address} onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none transition-all resize-none"
              />
              <MapPin className="absolute left-3 top-3 text-gray-400" size={18} />
            </div>

            <button 
              type="submit"
              className="w-full py-3 bg-primary hover:bg-indigo-700 text-white font-bold rounded-lg transition-colors shadow-md mt-2"
            >
              สมัครเป็นตัวแทนขาย
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}