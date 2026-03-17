import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, ShieldCheck, Store, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // เช็คว่าเข้าผ่าน URL /admin/login หรือเปล่า ถ้าใช่ให้ Default เป็นแท็บ Admin
  const defaultRole = location.pathname.includes('/admin') ? 'admin' : 'reseller';
  
  const [role, setRole] = useState<'reseller' | 'admin'>(defaultRole);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { email, password } = formData;

    // ==========================================
    // จำลองระบบ Login ของ Admin
    // ==========================================
    if (role === 'admin') {
      if (email === 'admin@email.com' && password === '12345678') {
        toast.success('ยินดีต้อนรับผู้ดูแลระบบ');
        navigate('/admin/dashboard'); // BR-01: เข้าสู่ระบบสำเร็จ ไปหน้า Admin Dashboard
      } else {
        toast.error('อีเมลหรือรหัสผ่านไม่ถูกต้อง'); // BR-02
      }
      return;
    }

    // ==========================================
    // จำลองระบบ Login ของ Reseller (ตัวแทน)
    // ==========================================
    if (role === 'reseller') {
      if (password !== '12345678') {
        toast.error('อีเมลหรือรหัสผ่านไม่ถูกต้อง'); // BR-18
        return;
      }

      // จำลองการเช็คสถานะบัญชี (BR-15, BR-16, BR-17)
      if (email === 'minnie@email.com') {
        toast.success('เข้าสู่ระบบสำเร็จ! ยินดีต้อนรับกลับมา');
        navigate('/reseller/dashboard'); // สถานะ: อนุมัติแล้ว
      } else if (email === 'pending@email.com') {
        toast.error('บัญชีรออนุมัติ กรุณารอการติดต่อจากผู้ดูแลระบบ', { duration: 4000 }); // สถานะ: รออนุมัติ
      } else if (email === 'bad@email.com') {
        toast.error('บัญชีนี้ไม่ได้รับการอนุมัติ', { duration: 4000 }); // สถานะ: ปฏิเสธ
      } else {
        toast.error('ไม่พบบัญชีผู้ใช้นี้ในระบบ');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4 transition-colors duration-200">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-gray-100 dark:border-gray-700">
        
        {/* ส่วน Header และ Tab สลับ Role */}
        <div className="bg-gray-50 dark:bg-gray-900/50 p-6 pb-0 border-b border-gray-100 dark:border-gray-700">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">เข้าสู่ระบบ</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">ยินดีต้อนรับสู่ระบบ Reseller Management</p>
          </div>

          <div className="flex rounded-t-xl overflow-hidden border-b-2 border-transparent">
            <button 
              type="button"
              onClick={() => setRole('reseller')}
              className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${
                role === 'reseller' 
                  ? 'bg-white dark:bg-gray-800 text-secondary border-b-2 border-secondary' 
                  : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <Store size={18} /> ตัวแทนจำหน่าย
            </button>
            <button 
              type="button"
              onClick={() => setRole('admin')}
              className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${
                role === 'admin' 
                  ? 'bg-white dark:bg-gray-800 text-primary border-b-2 border-primary' 
                  : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <ShieldCheck size={18} /> ผู้ดูแลระบบ
            </button>
          </div>
        </div>

        {/* ฟอร์มกรอกข้อมูล */}
        <div className="p-6 sm:p-8">
          
          {/* แจ้งเตือนอีเมลจำลองสำหรับทดสอบ */}
          <div className="mb-6 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg text-xs text-blue-800 dark:text-blue-300 border border-blue-100 dark:border-blue-800/50">
            <p className="font-bold mb-1">ข้อมูลสำหรับทดสอบ (รหัสผ่าน: 12345678):</p>
            {role === 'admin' ? (
              <ul className="list-disc pl-4">
                <li>admin@email.com (เข้าสู่ระบบได้เลย)</li>
              </ul>
            ) : (
              <ul className="list-disc pl-4 space-y-0.5">
                <li>minnie@email.com (บัญชีที่อนุมัติแล้ว)</li>
                <li>pending@email.com (บัญชีที่รออนุมัติ)</li>
                <li>bad@email.com (บัญชีที่ถูกปฏิเสธ)</li>
              </ul>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">อีเมลผู้ใช้งาน</label>
              <div className="relative">
                <input 
                  type="email" name="email" required
                  value={formData.email} onChange={handleChange}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none transition-all"
                />
                <Mail className="absolute left-3 top-3.5 text-gray-400" size={18} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">รหัสผ่าน</label>
              <div className="relative">
                <input 
                  type="password" name="password" required
                  value={formData.password} onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none transition-all"
                />
                <Lock className="absolute left-3 top-3.5 text-gray-400" size={18} />
              </div>
            </div>

            <button 
              type="submit"
              className={`w-full py-3 text-white font-bold rounded-xl transition-colors shadow-md mt-4 flex justify-center items-center gap-2 ${
                role === 'admin' ? 'bg-primary hover:bg-indigo-700' : 'bg-secondary hover:bg-emerald-600'
              }`}
            >
              เข้าสู่ระบบ {role === 'admin' ? 'ผู้ดูแลระบบ' : 'ตัวแทนจำหน่าย'} <ArrowRight size={18} />
            </button>
          </form>

          {role === 'reseller' && (
            <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
              ยังไม่มีบัญชีตัวแทนจำหน่าย?{' '}
              <Link to="/register" className="font-bold text-secondary hover:text-emerald-600 transition-colors">
                สมัครสมาชิกที่นี่
              </Link>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}