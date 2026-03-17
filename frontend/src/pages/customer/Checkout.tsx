import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom';
import { MapPin, Phone, User, Package, ChevronLeft, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

// จำลองฐานข้อมูลสินค้าในร้าน (อิงจากหน้า Shop)
const shopProducts = [
  { id: 1, name: 'เสื้อยืดคอกลม สีดำ', sellingPrice: 199, stock: 50, image: '' },
  { id: 4, name: 'กระเป๋าผ้า Canvas', sellingPrice: 250, stock: 100, image: '' },
];

export default function Checkout() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const productId = Number(searchParams.get('productId')); // ดึง ID สินค้าจาก URL

  // ค้นหาสินค้าที่ลูกค้าเลือก
  const product = shopProducts.find(p => p.id === productId);

  // State สำหรับฟอร์มจัดส่ง และ จำนวนสินค้า
  const [quantity, setQuantity] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: ''
  });

  // ถ้าหาสินค้าไม่เจอ (เช่น เข้า URL มั่ว) ให้เด้งกลับไปหน้าร้าน
  useEffect(() => {
    if (!product) {
      toast.error('ไม่พบสินค้าที่ต้องการสั่งซื้อ');
      navigate(`/shop/${slug}`);
    }
  }, [product, navigate, slug]);

  if (!product) return null;

  // คำนวณยอดรวม (ราคาสินค้า x จำนวน)
  const totalAmount = product.sellingPrice * quantity;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ฟังก์ชันยืนยันคำสั่งซื้อ
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate ข้อมูลให้ครบถ้วน
    if (!formData.name || !formData.phone || !formData.address) {
      toast.error('กรุณากรอกข้อมูลจัดส่งให้ครบถ้วน');
      return;
    }

    // ตรวจสอบ BR-27: จำนวนที่สั่งต้องไม่เกินสต็อก
    if (quantity > product.stock) {
      toast.error(`ขออภัย สินค้ามีจำนวนจำกัด (เหลือ ${product.stock} ชิ้น)`);
      return;
    }
    if (quantity < 1) {
      toast.error('กรุณาระบุจำนวนสินค้าอย่างน้อย 1 ชิ้น');
      return;
    }

    // จำลองการสร้างเลขออเดอร์ (BR-26)
    const mockOrderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
    
    toast.success('สร้างคำสั่งซื้อสำเร็จ กำลังพาไปหน้าชำระเงิน...');
    
    // พาไปหน้าจำลองชำระเงิน พร้อมส่งเลขออเดอร์ไปใน URL
    setTimeout(() => {
      navigate(`/shop/${slug}/payment/${mockOrderId}`);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8 font-sans transition-colors duration-200">
      <div className="max-w-4xl mx-auto">
        
        {/* Header และปุ่มย้อนกลับ */}
        <div className="mb-8">
          <Link 
            to={`/shop/${slug}`} 
            className="inline-flex items-center gap-2 text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-indigo-400 transition-colors mb-4 font-medium"
          >
            <ChevronLeft size={20} /> กลับไปหน้าเลือกสินค้า
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">ยืนยันคำสั่งซื้อ</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">กรุณากรอกข้อมูลจัดส่งและตรวจสอบรายการสินค้า</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* ฝั่งซ้าย: ฟอร์มข้อมูลจัดส่ง */}
          <div className="lg:col-span-2">
            <form id="checkout-form" onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 sm:p-8 space-y-6">
              
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                <MapPin className="text-primary" /> ข้อมูลสำหรับจัดส่ง
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    ชื่อ-นามสกุล ผู้รับ <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input 
                      type="text" 
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="เช่น สมชาย ใจดี"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none transition-all"
                    />
                    <User className="absolute left-3 top-3.5 text-gray-400" size={18} />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    เบอร์โทรศัพท์ <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input 
                      type="tel" 
                      name="phone"
                      required
                      pattern="[0-9]{10}"
                      maxLength={10}
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="เช่น 0812345678"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none transition-all"
                    />
                    <Phone className="absolute left-3 top-3.5 text-gray-400" size={18} />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    ที่อยู่จัดส่งแบบละเอียด <span className="text-red-500">*</span>
                  </label>
                  <textarea 
                    name="address"
                    required
                    rows={3}
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="บ้านเลขที่, หมู่, ซอย, ถนน, ตำบล, อำเภอ, จังหวัด, รหัสไปรษณีย์"
                    className="w-full p-4 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none transition-all resize-none"
                  />
                </div>
              </div>
            </form>
          </div>

          {/* ฝั่งขวา: สรุปรายการคำสั่งซื้อ */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 sticky top-24">
              
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-6">
                <Package className="text-primary" /> สรุปยอดสั่งซื้อ
              </h2>

              {/* รายการสินค้า */}
              <div className="flex gap-4 mb-6 pb-6 border-b border-gray-100 dark:border-gray-700">
                <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-xl flex-shrink-0 flex items-center justify-center">
                  <span className="text-xs text-gray-400">รูปสินค้า</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 dark:text-white line-clamp-2">{product.name}</h3>
                  <p className="text-primary dark:text-indigo-400 font-bold mt-1">฿{product.sellingPrice}</p>
                </div>
              </div>

              {/* ปรับจำนวน */}
              <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-100 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-300 font-medium">ระบุจำนวน</span>
                <div className="flex items-center border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
                  <button 
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 transition-colors"
                  >-</button>
                  <input 
                    type="number" 
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-12 text-center py-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none"
                    min="1"
                    max={product.stock}
                  />
                  <button 
                    type="button"
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="px-3 py-1 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 transition-colors"
                  >+</button>
                </div>
              </div>

              {/* ยอดรวม */}
              <div className="space-y-3 mb-8">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>ยอดรวมสินค้า</span>
                  <span>฿{totalAmount}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>ค่าจัดส่ง (จำลอง)</span>
                  <span>ฟรี</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-gray-900 dark:text-white pt-4 border-t border-gray-100 dark:border-gray-700">
                  <span>ยอดสุทธิ</span>
                  <span className="text-primary dark:text-indigo-400">฿{totalAmount}</span>
                </div>
              </div>

              {/* ปุ่มยืนยัน โดยผูกกับฟอร์มฝั่งซ้ายผ่าน form="checkout-form" */}
              <button 
                type="submit"
                form="checkout-form"
                className="w-full py-4 bg-gray-900 hover:bg-gray-800 dark:bg-primary dark:hover:bg-indigo-600 text-white font-bold rounded-xl transition-colors shadow-lg shadow-gray-200 dark:shadow-none flex items-center justify-center gap-2"
              >
                ยืนยันและไปชำระเงิน <ArrowRight size={20} />
              </button>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}