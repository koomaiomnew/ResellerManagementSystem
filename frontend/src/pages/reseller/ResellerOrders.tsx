import { useState } from 'react';
import { Package, Truck, CheckCircle, Search, TrendingUp } from 'lucide-react';

// ข้อมูลจำลอง (Mock Data) เฉพาะออเดอร์ที่เข้ามาในร้านของตัวแทนคนนี้ (เช่น ร้านมินนี่ช็อป)
const initialOrders = [
  { id: 1, orderNumber: 'ORD-20260001', customerName: 'คุณสมศรี ใจดี', items: 'เสื้อยืดคอกลม สีดำ (2)', total: 398, profit: 198, date: '2026-03-16 14:30', status: 'pending' },
  { id: 3, orderNumber: 'ORD-20260003', customerName: 'คุณสมปอง น้องรัก', items: 'หมวกแก๊ป (3)', total: 450, profit: 120, date: '2026-03-12 09:15', status: 'shipped' },
  { id: 5, orderNumber: 'ORD-20260005', customerName: 'คุณมาลี สวยมาก', items: 'กางเกงยีนส์ ทรงกระบอก (1)', total: 450, profit: 100, date: '2026-03-11 10:00', status: 'completed' },
];

export default function ResellerOrders() {
  const [orders, setOrders] = useState(initialOrders);
  const [searchTerm, setSearchTerm] = useState('');

  // ฟังก์ชันค้นหาออเดอร์
  const filteredOrders = orders.filter(o => 
    o.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.customerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">ออเดอร์ร้านฉัน</h1>
        <p className="text-gray-500 dark:text-gray-400">รายการสั่งซื้อทั้งหมดที่เข้ามาผ่านลิงก์ร้านค้าของคุณ</p>
      </div>

      {/* แถบค้นหา */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row justify-between gap-4 items-center">
        <div className="relative w-full max-w-md">
          <input 
            type="text" 
            placeholder="ค้นหาเลขออเดอร์ หรือ ชื่อลูกค้า..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-secondary"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <span>รวมทั้งหมด:</span>
          <span className="font-bold text-gray-900 dark:text-white">{filteredOrders.length} ออเดอร์</span>
        </div>
      </div>

      {/* ตารางออเดอร์ */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">เลขออเดอร์</th>
                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">ลูกค้า / สินค้า</th>
                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300 text-right">ยอดขายรวม</th>
                <th className="p-4 font-semibold text-emerald-600 dark:text-emerald-400 text-right">กำไรของคุณ</th>
                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">วันที่สั่งซื้อ</th>
                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">สถานะ</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/25 transition-colors">
                    <td className="p-4 font-medium text-secondary dark:text-emerald-400">{order.orderNumber}</td>
                    <td className="p-4 text-sm text-gray-600 dark:text-gray-300">
                      <div className="font-medium text-gray-900 dark:text-gray-200">{order.customerName}</div>
                      <div className="text-gray-500">{order.items}</div>
                    </td>
                    <td className="p-4 text-right font-medium text-gray-900 dark:text-white">฿{order.total}</td>
                    <td className="p-4 text-right font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-900/10">
                      <div className="flex items-center justify-end gap-1">
                        <TrendingUp size={14} /> ฿{order.profit}
                      </div>
                    </td>
                    <td className="p-4 text-sm text-gray-600 dark:text-gray-300">{order.date}</td>
                    <td className="p-4">
                      <StatusBadge status={order.status} />
                      {order.status === 'pending' && (
                        <p className="text-xs text-gray-400 mt-1">รอแอดมินจัดส่ง</p>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500 dark:text-gray-400">
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