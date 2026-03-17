import { Wallet as WalletIcon, ArrowDownLeft, Info, Calendar, Receipt } from 'lucide-react';

// ข้อมูลจำลอง (Mock Data) สำหรับประวัติการรับรายได้
const walletHistory = [
  { id: 1, orderNumber: 'ORD-20260001', amount: 198, date: '2026-03-16 14:30', detail: 'กำไรจาก เสื้อยืดคอกลม สีดำ (2 ชิ้น)' },
  { id: 2, orderNumber: 'ORD-20260002', amount: 100, date: '2026-03-15 09:15', detail: 'กำไรจาก กางเกงยีนส์ ทรงกระบอก (1 ชิ้น)' },
  { id: 3, orderNumber: 'ORD-20260003', amount: 120, date: '2026-03-14 16:45', detail: 'กำไรจาก หมวกแก๊ป (3 ชิ้น)' },
];

export default function Wallet() {
  // คำนวณยอดรวมจำลองจาก History
  const totalBalance = walletHistory.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <WalletIcon className="text-secondary" /> กระเป๋าเงินจำลอง (Wallet)
        </h1>
        <p className="text-gray-500 dark:text-gray-400">ตรวจสอบยอดกำไรสะสมและประวัติรายได้ของคุณ</p>
      </div>

      {/* Alert แจ้งเตือนว่าเป็นระบบจำลอง (ตาม BR) */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4 rounded-xl flex items-start gap-3">
        <Info className="text-blue-500 mt-0.5 shrink-0" size={20} />
        <div>
          <h4 className="text-blue-800 dark:text-blue-300 font-medium">หมายเหตุจากระบบ</h4>
          <p className="text-blue-600 dark:text-blue-400 text-sm mt-1">
            Wallet นี้เป็นเพียงการจำลองเพื่อการศึกษาเท่านั้น ยอดเงินที่แสดงไม่สามารถถอนออกมาเป็นเงินสดได้จริง ระบบจะบวกกำไรให้อัตโนมัติเมื่อ Admin อัปเดตสถานะออเดอร์เป็น "จัดส่งแล้ว"
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* การ์ดยอดเงินสะสม (Balance Card) */}
        <div className="lg:col-span-1">
          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
            {/* วงกลมตกแต่งพื้นหลังให้ดูมีมิติ */}
            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-white/10 blur-2xl"></div>
            <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-24 h-24 rounded-full bg-black/10 blur-xl"></div>
            
            <div className="relative z-10">
              <div className="flex justify-between items-center mb-6">
                <span className="text-emerald-50 font-medium">ยอดกำไรสะสมทั้งหมด</span>
                <WalletIcon className="text-emerald-100 opacity-80" size={28} />
              </div>
              
              <div>
                <span className="text-emerald-100 text-lg font-medium mr-1">฿</span>
                <span className="text-5xl font-bold tracking-tight">
                  {totalBalance.toLocaleString('th-TH', { minimumFractionDigits: 2 })}
                </span>
              </div>
              
              <div className="mt-8 pt-4 border-t border-emerald-400/30 flex justify-between items-center text-sm text-emerald-50">
                <span>อัปเดตล่าสุด: วันนี้</span>
                <span>รอถอน: ฿0.00</span>
              </div>
            </div>
          </div>
        </div>

        {/* ประวัติรายได้ (Transaction History) */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden h-full flex flex-col">
            <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
              <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Receipt size={18} className="text-gray-500" /> ประวัติการรับรายได้
              </h3>
            </div>
            
            <div className="p-0 flex-1 overflow-y-auto">
              {walletHistory.length > 0 ? (
                <ul className="divide-y divide-gray-100 dark:divide-gray-700/50">
                  {walletHistory.map((transaction) => (
                    <li key={transaction.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/20 transition-colors flex items-center justify-between group">
                      <div className="flex items-start gap-4">
                        <div className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 p-2 rounded-full shrink-0 mt-1">
                          <ArrowDownLeft size={20} />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                            {transaction.orderNumber}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">
                            {transaction.detail}
                          </p>
                          <div className="flex items-center gap-1 text-xs text-gray-400 mt-1.5">
                            <Calendar size={12} /> {transaction.date}
                          </div>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="font-bold text-emerald-600 dark:text-emerald-400 text-lg">
                          +฿{transaction.amount}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="flex flex-col items-center justify-center h-full p-8 text-gray-500 dark:text-gray-400 text-center">
                  <Receipt size={48} className="text-gray-300 dark:text-gray-600 mb-3" />
                  <p>ยังไม่มีประวัติรายได้</p>
                  <p className="text-sm mt-1">กำไรจะแสดงที่นี่เมื่อออเดอร์ถูกจัดส่งแล้ว</p>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}