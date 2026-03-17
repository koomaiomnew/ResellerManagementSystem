import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Package, Truck, CheckCircle, MapPin, Box, ArrowLeft } from 'lucide-react';

// ข้อมูลจำลอง (Mock Data) สำหรับออเดอร์ในระบบ
const mockOrdersDB = [
  { 
    id: 'ORD-123456', 
    status: 'pending', // pending = รอดำเนินการ, shipped = จัดส่งแล้ว, completed = เสร็จสมบูรณ์
    customerName: 'สมชาย ใจดี',
    address: '123/45 ซ.สุขุมวิท 1 ถ.สุขุมวิท แขวงคลองเตยเหนือ เขตวัฒนา กทม. 10110',
    phone: '0812345678',
    items: [
      { name: 'เสื้อยืดคอกลม สีดำ', qty: 2, price: 199 },
    ],
    total: 398,
    date: '2026-03-16 14:30'
  },
  { 
    id: 'ORD-987654', 
    status: 'shipped', 
    customerName: 'สมหญิง รักดี',
    address: '99 หมู่ 1 ต.แม่กา อ.เมือง จ.พะเยา 56000',
    phone: '0898765432',
    items: [
      { name: 'กระเป๋าผ้า Canvas', qty: 1, price: 250 },
    ],
    total: 250,
    date: '2026-03-15 09:15'
  }
];

export default function TrackOrder() {
  const [searchParams] = useSearchParams();
  const initialOrderId = searchParams.get('orderId') || ''; // รับเลขออเดอร์ที่ส่งมาจากหน้า Payment (ถ้ามี)
  
  const [searchQuery, setSearchQuery] = useState(initialOrderId);
  const [orderResult, setOrderResult] = useState<any>(null);
  const [hasSearched, setHasSearched] = useState(false);

  // ค้นหาอัตโนมัติถ้ามี ID แนบมากับ URL
  useEffect(() => {
    if (initialOrderId) {
      handleSearch(new Event('submit') as any, initialOrderId);
    }
  }, [initialOrderId]);

  // ฟังก์ชันค้นหาออเดอร์
  const handleSearch = (e: React.FormEvent, forceQuery?: string) => {
    e?.preventDefault();
    const query = forceQuery || searchQuery;
    
    if (!query.trim()) return;

    const found = mockOrdersDB.find(o => o.id === query.trim().toUpperCase());
    setOrderResult(found || null);
    setHasSearched(true);
  };

  // Component สำหรับวาด Timeline สถานะ
  const StatusTimeline = ({ status }: { status: string }) => {
    const steps = [
      { id: 'pending', label: 'รับคำสั่งซื้อ', icon: Package },
      { id: 'shipped', label: 'กำลังจัดส่ง', icon: Truck },
      { id: 'completed', label: 'จัดส่งสำเร็จ', icon: CheckCircle },
    ];

    // หา index ของสถานะปัจจุบัน
    const currentStepIndex = steps.findIndex(s => s.id === status);

    return (
      <div className="relative flex justify-between items-center mb-8 mt-4">
        {/* เส้นเชื่อม Background */}
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-gray-200 dark:bg-gray-700 z-0"></div>
        {/* เส้นเชื่อม Progress */}
        <div 
          className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-emerald-500 z-0 transition-all duration-500"
          style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
        ></div>

        {steps.map((step, index) => {
          const isCompleted = index <= currentStepIndex;
          const isCurrent = index === currentStepIndex;
          const Icon = step.icon;

          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center gap-2">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 border-white dark:border-gray-800 transition-colors duration-300 ${
                isCompleted 
                  ? 'bg-emerald-500 text-white' 
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500'
              } ${isCurrent ? 'ring-4 ring-emerald-100 dark:ring-emerald-900/50' : ''}`}>
                <Icon size={20} />
              </div>
              <span className={`text-sm font-medium ${isCompleted ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 font-sans transition-colors duration-200">
      <div className="max-w-3xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">ติดตามสถานะพัสดุ</h1>
          <p className="text-gray-500 dark:text-gray-400">กรอกหมายเลขคำสั่งซื้อของคุณเพื่อตรวจสอบสถานะการจัดส่ง</p>
        </div>

        {/* ฟอร์มค้นหา */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="relative max-w-xl mx-auto flex shadow-sm rounded-xl overflow-hidden">
            <div className="relative flex-1">
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="เช่น ORD-123456"
                className="w-full pl-12 pr-4 py-4 border-y border-l border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-lg uppercase"
              />
              <Search className="absolute left-4 top-4 text-gray-400" size={24} />
            </div>
            <button 
              type="submit"
              className="px-8 py-4 bg-primary hover:bg-indigo-700 text-white font-bold transition-colors"
            >
              ค้นหา
            </button>
          </div>
        </form>

        {/* ผลการค้นหา */}
        {hasSearched && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {orderResult ? (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                
                {/* แถบด้านบน: เลขออเดอร์ และ วันที่ */}
                <div className="bg-gray-50 dark:bg-gray-800/50 p-6 border-b border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">หมายเลขคำสั่งซื้อ</p>
                    <p className="text-xl font-bold text-primary dark:text-indigo-400">{orderResult.id}</p>
                  </div>
                  <div className="sm:text-right">
                    <p className="text-sm text-gray-500 dark:text-gray-400">วันที่สั่งซื้อ</p>
                    <p className="font-medium text-gray-900 dark:text-white">{orderResult.date}</p>
                  </div>
                </div>

                <div className="p-6 sm:p-8">
                  {/* Timeline สถานะ */}
                  <StatusTimeline status={orderResult.status} />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10 pt-8 border-t border-gray-100 dark:border-gray-700">
                    
                    {/* ข้อมูลจัดส่ง */}
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                        <MapPin className="text-gray-400" size={20} /> ที่อยู่จัดส่ง
                      </h3>
                      <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl text-sm text-gray-600 dark:text-gray-300">
                        <p className="font-medium text-gray-900 dark:text-white mb-1">{orderResult.customerName}</p>
                        <p className="mb-2">{orderResult.phone}</p>
                        <p className="leading-relaxed">{orderResult.address}</p>
                      </div>
                    </div>

                    {/* รายการสินค้า */}
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                        <Box className="text-gray-400" size={20} /> รายการสินค้า
                      </h3>
                      <div className="space-y-4">
                        {orderResult.items.map((item: any, idx: number) => (
                          <div key={idx} className="flex justify-between items-center text-sm">
                            <div className="flex-1">
                              <p className="font-medium text-gray-900 dark:text-white line-clamp-1">{item.name}</p>
                              <p className="text-gray-500 dark:text-gray-400">จำนวน: {item.qty} ชิ้น</p>
                            </div>
                            <span className="font-medium text-gray-900 dark:text-white">฿{item.price * item.qty}</span>
                          </div>
                        ))}
                        <div className="pt-4 mt-4 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
                          <span className="font-bold text-gray-900 dark:text-white">ยอดสุทธิ</span>
                          <span className="font-bold text-xl text-primary dark:text-indigo-400">฿{orderResult.total}</span>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            ) : (
              // กรณีไม่พบออเดอร์ (BR-31)
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-red-100 dark:border-red-900/30 p-12 text-center">
                <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">ไม่พบคำสั่งซื้อนี้ในระบบ</h3>
                <p className="text-gray-500 dark:text-gray-400">โปรดตรวจสอบหมายเลขคำสั่งซื้ออีกครั้ง หรือติดต่อร้านค้า</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}