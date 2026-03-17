import { TrendingUp, ShoppingCart, Clock, Copy, ExternalLink, Package } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function ResellerDashboard() {
  // จำลองข้อมูลของตัวแทนคนนี้
  const shopName = "minnieshop"; // ดึงจากฐานข้อมูลจริงในอนาคต
  const shopUrl = `${window.location.origin}/shop/${shopName}`; // สร้าง URL แบบเต็มตามเครื่องที่รันอยู่

  // ฟังก์ชันคัดลอกลิงก์ร้าน
  const handleCopyLink = () => {
    navigator.clipboard.writeText(shopUrl);
    toast.success('คัดลอกลิงก์ร้านค้าเรียบร้อยแล้ว! นำไปแชร์ให้ลูกค้าได้เลย');
  };

  // ข้อมูลสรุปตัวเลขจำลอง
  const summaryCards = [
    { title: 'กำไรสะสมของฉัน', value: '฿4,500', icon: <TrendingUp size={24} />, color: 'text-emerald-600', bg: 'bg-emerald-100 dark:bg-emerald-900/30' },
    { title: 'ออเดอร์ร้านฉันทั้งหมด', value: '45', icon: <ShoppingCart size={24} />, color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/30' },
    { title: 'ออเดอร์รอแอดมินจัดส่ง', value: '3', icon: <Clock size={24} />, color: 'text-orange-600', bg: 'bg-orange-100 dark:bg-orange-900/30' },
    { title: 'สินค้าในร้านตอนนี้', value: '12', icon: <Package size={24} />, color: 'text-indigo-600', bg: 'bg-indigo-100 dark:bg-indigo-900/30' },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">ภาพรวมร้านค้าของคุณ</h1>
        <p className="text-gray-500 dark:text-gray-400">ยินดีต้อนรับกลับมา! นี่คือสถิติร้านค้าของคุณในวันนี้</p>
      </div>

      {/* กล่องแชร์ลิงก์ร้านค้า (ฟีเจอร์สำคัญของ Reseller) */}
      <div className="bg-gradient-to-r from-secondary to-emerald-500 rounded-2xl p-6 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white mb-1">แชร์หน้าร้านของคุณให้ลูกค้าเลย!</h2>
          <p className="text-emerald-50 text-sm">ลูกค้าที่สั่งซื้อผ่านลิงก์นี้ กำไรจะเข้า Wallet ของคุณโดยอัตโนมัติ</p>
        </div>
        
        <div className="flex items-center gap-2 w-full md:w-auto bg-white/20 p-1.5 rounded-lg border border-white/30 backdrop-blur-sm">
          <span className="pl-3 pr-2 py-2 text-sm font-medium truncate max-w-[200px] md:max-w-xs">
            {shopUrl}
          </span>
          <button 
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 bg-white text-emerald-700 hover:bg-gray-50 px-3 py-2 rounded-md font-medium text-sm transition-colors shadow-sm shrink-0"
          >
            <Copy size={16} /> คัดลอก
          </button>
          <Link 
            to={`/shop/${shopName}`}
            target="_blank"
            className="flex items-center gap-1.5 bg-emerald-700 text-white hover:bg-emerald-800 px-3 py-2 rounded-md font-medium text-sm transition-colors shadow-sm shrink-0"
          >
            <ExternalLink size={16} /> เปิดดู
          </Link>
        </div>
      </div>

      {/* Grid สำหรับการ์ดสรุปผล (แก้ไขเรื่องตัวหนังสือล้นแล้ว) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-6">
        {summaryCards.map((card, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 flex items-center gap-4 hover:shadow-md transition-shadow overflow-hidden">
            {/* ใส่ shrink-0 ป้องกันไอคอนโดนบีบ */}
            <div className={`p-4 rounded-lg shrink-0 ${card.bg} ${card.color}`}>
              {card.icon}
            </div>
            {/* ใส่ min-w-0 และ truncate เพื่อให้ข้อความที่ยาวเกินมี ... แทนการดันกรอบ */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 " title={card.title}>
                {card.title}
              </p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1 " title={card.value}>
                {card.value}
              </h3>
            </div>
          </div>
        ))}
      </div>

      {/* ส่วนปุ่มลัด (Quick Actions) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">อยากได้กำไรเพิ่มไหม?</h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">เข้าไปเลือกสินค้าจากแค็ตตาล็อกส่วนกลางมาเพิ่มในร้านของคุณสิ มีสินค้าออกใหม่รอให้คุณทำกำไรอยู่เพียบ!</p>
          <Link to="/reseller/catalog" className="inline-flex items-center gap-2 bg-secondary hover:bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
            <Package size={18} /> ไปเลือกสินค้าเข้าร้าน
          </Link>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">สถานะการอนุมัติ</h3>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <span className="text-2xl font-bold">✓</span>
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">บัญชีได้รับการอนุมัติแล้ว</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">คุณสามารถใช้งานทุกฟีเจอร์ในระบบได้ตามปกติ</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}