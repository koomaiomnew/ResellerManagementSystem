import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CreditCard, CheckCircle, ShieldCheck, Loader2, Store } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Payment() {
  const { slug, id } = useParams(); // ดึงชื่อร้าน และ เลขออเดอร์ จาก URL
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  // จำลองการดึงข้อมูลออเดอร์ (ในระบบจริงต้องยิง API ไปถาม Backend)
  const mockOrderAmount = 199; // สมมติว่ายอด 199 บาท

  // ป้องกันกรณีเข้าหน้านี้โดยไม่มีเลขออเดอร์
  useEffect(() => {
    if (!id) {
      toast.error('ไม่พบข้อมูลคำสั่งซื้อ');
      navigate(`/shop/${slug}`);
    }
  }, [id, navigate, slug]);

  // ฟังก์ชันจำลองการกดจ่ายเงิน
  const handlePayment = () => {
    setIsProcessing(true); // เปิด Loading State
    
    // จำลองเวลาประมวลผลของธนาคาร 1.5 วินาที
    setTimeout(() => {
      setIsProcessing(false);
      toast.success('ชำระเงินสำเร็จ! ระบบได้รับคำสั่งซื้อของคุณแล้ว');
      
      // Redirect ไปหน้าเช็คสถานะออเดอร์ พร้อมส่งเลขออเดอร์ไปใน URL Query
      navigate(`/track-order?orderId=${id}`);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col transition-colors duration-200 font-sans">
      
      {/* Navbar เรียบง่าย */}
      <nav className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2 text-gray-900 dark:text-white font-bold text-xl">
            <Store className="text-primary" /> ร้าน {slug}
          </div>
          <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-sm font-medium">
            <ShieldCheck size={18} /> ชำระเงินปลอดภัย
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-gray-100 dark:border-gray-700">
          
          {/* หัวข้อ */}
          <div className="bg-gray-900 dark:bg-black p-6 text-center">
            <h2 className="text-xl font-bold text-white mb-2">ชำระเงิน (ระบบจำลอง)</h2>
            <p className="text-gray-400 text-sm">เลขออเดอร์: <span className="text-white font-mono bg-white/10 px-2 py-0.5 rounded">{id}</span></p>
          </div>

          <div className="p-6 sm:p-8 space-y-8">
            
            {/* ยอดเงิน */}
            <div className="text-center">
              <p className="text-gray-500 dark:text-gray-400 font-medium mb-1">ยอดชำระสุทธิ</p>
              <div className="text-4xl font-bold text-gray-900 dark:text-white">
                ฿{mockOrderAmount.toLocaleString('th-TH', { minimumFractionDigits: 2 })}
              </div>
            </div>

            {/* กล่องแจ้งเตือน */}
            <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 p-4 rounded-xl text-sm flex items-start gap-3 border border-blue-100 dark:border-blue-800/50">
              <CheckCircle className="shrink-0 text-blue-600 dark:text-blue-400 mt-0.5" size={20} />
              <p>นี่คือระบบจำลองการชำระเงิน เมื่อคุณกดปุ่ม <b>"จ่ายเงินจำลอง"</b> ด้านล่าง ระบบจะอนุมัติคำสั่งซื้อทันทีโดยไม่ต้องหักเงินจริง</p>
            </div>

            {/* ปุ่มจ่ายเงิน */}
            <button 
              onClick={handlePayment}
              disabled={isProcessing}
              className={`w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-200 dark:shadow-none ${
                isProcessing 
                  ? 'bg-emerald-400 cursor-not-allowed text-white' 
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
            >
              {isProcessing ? (
                <>
                  <Loader2 size={24} className="animate-spin" /> กำลังประมวลผล...
                </>
              ) : (
                <>
                  <CreditCard size={24} /> จ่ายเงินจำลอง
                </>
              )}
            </button>
            
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-900/50 p-4 text-center border-t border-gray-100 dark:border-gray-700">
            <p className="text-xs text-gray-400 dark:text-gray-500">
              ระบบรักษาความปลอดภัยจำลอง 256-bit Encryption
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}