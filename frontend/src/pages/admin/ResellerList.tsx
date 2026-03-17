import { useState } from 'react';
import { CheckCircle, XCircle, Clock, Search } from 'lucide-react';
import toast from 'react-hot-toast';

// ข้อมูลจำลอง (Mock Data) สำหรับตัวแทนจำหน่าย
const initialResellers = [
  { id: 1, name: 'สมชาย ขายดี', email: 'somchai@email.com', shopName: 'somchaishop', phone: '0812345678', date: '2026-03-15', status: 'pending' },
  { id: 2, name: 'มินนี่ ช้อปปิ้ง', email: 'minnie@email.com', shopName: 'minnieshop', phone: '0898765432', date: '2026-03-14', status: 'pending' },
  { id: 3, name: 'ใจดี มีสุข', email: 'jaidee@email.com', shopName: 'jaideestore', phone: '0881112233', date: '2026-03-10', status: 'approved' },
  { id: 4, name: 'แย่จัง ปังปินาศ', email: 'bad@email.com', shopName: 'badshop', phone: '0810000000', date: '2026-03-09', status: 'rejected' },
];

export default function ResellerList() {
  const [resellers, setResellers] = useState(initialResellers);
  const [searchTerm, setSearchTerm] = useState('');

  // ฟังก์ชันค้นหา
  const filteredResellers = resellers.filter(r => 
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.shopName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ฟังก์ชันอนุมัติตัวแทน (BR-08)
  const handleApprove = (id: number) => {
    if (window.confirm('ยืนยันการ "อนุมัติ" ตัวแทนจำหน่ายรายนี้?')) {
      setResellers(prev => prev.map(r => r.id === id ? { ...r, status: 'approved' } : r));
      toast.success('อนุมัติตัวแทนจำหน่ายสำเร็จ ตัวแทนสามารถเข้าสู่ระบบได้แล้ว');
    }
  };

  // ฟังก์ชันปฏิเสธตัวแทน (BR-09)
  const handleReject = (id: number) => {
    if (window.confirm('คุณแน่ใจหรือไม่ที่จะ "ปฏิเสธ" การสมัครนี้?')) {
      setResellers(prev => prev.map(r => r.id === id ? { ...r, status: 'rejected' } : r));
      toast.error('ปฏิเสธการสมัครตัวแทนจำหน่ายแล้ว');
    }
  };

  // Component เล็กๆ สำหรับแสดง Badge สถานะ
  const StatusBadge = ({ status }: { status: string }) => {
    switch (status) {
      case 'pending':
        return <span className="flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 rounded-full text-sm font-medium"><Clock size={16} /> รออนุมัติ</span>;
      case 'approved':
        return <span className="flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-full text-sm font-medium"><CheckCircle size={16} /> อนุมัติแล้ว</span>;
      case 'rejected':
        return <span className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-full text-sm font-medium"><XCircle size={16} /> ถูกปฏิเสธ</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">จัดการตัวแทนจำหน่าย</h1>
        <p className="text-gray-500 dark:text-gray-400">ตรวจสอบและอนุมัติการสมัครเป็นตัวแทนขายสินค้า</p>
      </div>

      {/* แถบค้นหา */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="relative w-full max-w-md">
          <input 
            type="text" 
            placeholder="ค้นหาชื่อ หรือ ชื่อร้าน..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
        </div>
      </div>

      {/* ตารางตัวแทน */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">ชื่อ-นามสกุล</th>
                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">การติดต่อ</th>
                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">ชื่อร้าน (URL)</th>
                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">วันที่สมัคร</th>
                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">สถานะ</th>
                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300 text-center">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {filteredResellers.length > 0 ? (
                filteredResellers.map((reseller) => (
                  <tr key={reseller.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/25 transition-colors">
                    <td className="p-4 font-medium text-gray-900 dark:text-white">{reseller.name}</td>
                    <td className="p-4 text-sm text-gray-600 dark:text-gray-300">
                      <div>{reseller.email}</div>
                      <div className="text-gray-500">{reseller.phone}</div>
                    </td>
                    <td className="p-4 text-primary dark:text-indigo-400 font-medium">/shop/{reseller.shopName}</td>
                    <td className="p-4 text-sm text-gray-600 dark:text-gray-300">{reseller.date}</td>
                    <td className="p-4">
                      <StatusBadge status={reseller.status} />
                    </td>
                    <td className="p-4 text-center">
                      {/* แสดงปุ่มเฉพาะคนที่สถานะ "รออนุมัติ" เท่านั้น */}
                      {reseller.status === 'pending' ? (
                        <div className="flex justify-center gap-2">
                          <button 
                            onClick={() => handleApprove(reseller.id)}
                            className="px-3 py-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white dark:bg-emerald-900/20 dark:hover:bg-emerald-600 dark:text-emerald-400 rounded-lg transition-colors text-sm font-medium"
                          >
                            อนุมัติ
                          </button>
                          <button 
                            onClick={() => handleReject(reseller.id)}
                            className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-500 hover:text-white dark:bg-red-900/20 dark:hover:bg-red-600 dark:text-red-400 rounded-lg transition-colors text-sm font-medium"
                          >
                            ปฏิเสธ
                          </button>
                        </div>
                      ) : (
                        <span className="text-gray-400 dark:text-gray-500 text-sm">-</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500 dark:text-gray-400">
                    ไม่พบข้อมูลตัวแทนจำหน่าย
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}