import { useState } from 'react';
import { Package, Truck, CheckCircle, Search } from 'lucide-react';
import toast from 'react-hot-toast';

// ข้อมูลจำลอง (Mock Data) สำหรับออเดอร์
const initialOrders = [
  { id: 1, orderNumber: 'ORD-20260001', shopName: 'มินนี่ช็อป', customerName: 'คุณสมศรี ใจดี', items: 'เสื้อยืดคอกลม สีดำ (2)', total: 400, date: '2026-03-15 10:30', status: 'pending' },
  { id: 2, orderNumber: 'ORD-20260002', shopName: 'สมชายการขาย', customerName: 'คุณวิชัย รักชาติ', items: 'กางเกงยีนส์ ทรงกระบอก (1)', total: 450, date: '2026-03-14 15:45', status: 'pending' },
  { id: 3, orderNumber: 'ORD-20260003', shopName: 'มินนี่ช็อป', customerName: 'คุณสมปอง น้องรัก', items: 'หมวกแก๊ป (3)', total: 450, date: '2026-03-12 09:15', status: 'shipped' },
  { id: 4, orderNumber: 'ORD-20260004', shopName: 'ใจดีสโตร์', customerName: 'คุณอำนาจ บารมี', items: 'เสื้อยืดคอกลม สีดำ (1)', total: 200, date: '2026-03-10 11:20', status: 'completed' },
];

export default function OrderList() {
  const [orders, setOrders] = useState(initialOrders);
  const [searchTerm, setSearchTerm] = useState('');

  // ฟังก์ชันค้นหาออเดอร์ (ค้นหาจากเลขออเดอร์, ชื่อร้าน, หรือชื่อลูกค้า)
  const filteredOrders = orders.filter(o => 
    o.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.shopName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.customerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ฟังก์ชันเปลี่ยนสถานะเป็นจัดส่งแล้ว (BR-10)
  const handleShipOrder = (id: number) => {
    if (window.confirm('ยืนยันว่าออเดอร์นี้ "จัดส่งแล้ว" ใช่หรือไม่?\n(ระบบจะคำนวณกำไรเข้า Wallet ของตัวแทนอัตโนมัติ)')) {
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status: 'shipped' } : o));
      toast.success('อัปเดตสถานะเป็น "จัดส่งแล้ว" เรียบร้อย');
    }
  };

  // Component สำหรับแสดง ป้ายสถานะ (Badge)
  const StatusBadge = ({ status }: { status: string }) => {
    switch (status) {
      case 'pending':
        return <span className="flex items-center gap-1 w-fit px-3 py-1 bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 rounded-full text-sm font-medium"><Package size={16} /> รอดำเนินการ</span>;
      case 'shipped':
        return <span className="flex items-center gap-1 w-fit px-3 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded-full text-sm font-medium"><Truck size={16} /> จัดส่งแล้ว</span>;
      case 'completed':
        return <span className="flex items-center gap-1 w-fit px-3 py-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-full text-sm font-medium"><CheckCircle size={16} /> เสร็จสมบูรณ์</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">จัดการออเดอร์ (ส่วนกลาง)</h1>
        <p className="text-gray-500 dark:text-gray-400">ดูออเดอร์จากทุกร้านค้าและอัปเดตสถานะการจัดส่ง</p>
      </div>

      {/* แถบค้นหา */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="relative w-full max-w-md">
          <input 
            type="text" 
            placeholder="ค้นหาเลขออเดอร์, ชื่อร้าน, ชื่อลูกค้า..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
        </div>
      </div>

      {/* ตารางออเดอร์ */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">เลขออเดอร์</th>
                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">ร้านที่ขาย</th>
                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">ลูกค้า / สินค้า</th>
                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300 text-right">ยอดรวม</th>
                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">วันที่สั่งซื้อ</th>
                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">สถานะ</th>
                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300 text-center">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/25 transition-colors">
                    <td className="p-4 font-medium text-primary dark:text-indigo-400">{order.orderNumber}</td>
                    <td className="p-4 text-gray-900 dark:text-white font-medium">{order.shopName}</td>
                    <td className="p-4 text-sm text-gray-600 dark:text-gray-300">
                      <div className="font-medium text-gray-900 dark:text-gray-200">{order.customerName}</div>
                      <div className="text-gray-500">{order.items}</div>
                    </td>
                    <td className="p-4 text-right font-medium text-gray-900 dark:text-white">฿{order.total}</td>
                    <td className="p-4 text-sm text-gray-600 dark:text-gray-300">{order.date}</td>
                    <td className="p-4">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="p-4 text-center">
                      {/* ปุ่มจะแสดงเฉพาะออเดอร์ที่ "รอดำเนินการ" */}
                      {order.status === 'pending' ? (
                        <button 
                          onClick={() => handleShipOrder(order.id)}
                          className="flex items-center gap-1 justify-center w-full px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white dark:bg-blue-900/20 dark:hover:bg-blue-600 dark:text-blue-400 rounded-lg transition-colors text-sm font-medium"
                        >
                          <Truck size={16} /> จัดส่ง
                        </button>
                      ) : (
                        <span className="text-gray-400 dark:text-gray-500 text-sm">-</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-500 dark:text-gray-400">
                    ไม่พบข้อมูลออเดอร์
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