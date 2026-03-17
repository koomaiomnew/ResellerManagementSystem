import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Save, ArrowLeft, Upload, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProductForm() {
  const navigate = useNavigate();
  const { id } = useParams(); // ถ้ามี id แปลว่าเป็นการ "แก้ไข" ถ้าไม่มีคือ "เพิ่มใหม่"
  const isEditing = !!id;

  // State สำหรับเก็บข้อมูลฟอร์ม
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    costPrice: '',
    minPrice: '',
    stock: '',
    image: null as File | null,
  });

  // ฟังก์ชันจัดการเมื่อพิมพ์ข้อมูลในช่องต่างๆ
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // ฟังก์ชันจำลองการอัปโหลดรูป
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, image: e.target.files![0] }));
    }
  };

  // ฟังก์ชันบันทึกข้อมูล (มี Validation ตามเอกสาร BA)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 1. ตรวจสอบข้อมูลที่จำเป็น (บังคับกรอก)
    if (!formData.name || !formData.costPrice || !formData.minPrice || !formData.stock) {
      toast.error('กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน');
      return;
    }

    const cost = Number(formData.costPrice);
    const min = Number(formData.minPrice);

    // 2. ตรวจสอบ Business Rule: ราคาขั้นต่ำต้อง >= ราคาทุน
    if (min < cost) {
      toast.error('ราคาขั้นต่ำต้องมากกว่าหรือเท่ากับราคาทุน (BR-07)');
      return;
    }

    // จำลองการบันทึกสำเร็จ
    toast.success(isEditing ? 'อัปเดตสินค้าเรียบร้อยแล้ว' : 'เพิ่มสินค้าใหม่เรียบร้อยแล้ว');
    
    // บันทึกเสร็จแล้วให้เด้งกลับไปหน้ารายการสินค้า
    setTimeout(() => navigate('/admin/products'), 1000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* ส่วน Header */}
      <div className="flex items-center gap-4">
        <Link 
          to="/admin/products" 
          className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
        >
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {isEditing ? 'แก้ไขข้อมูลสินค้า' : 'เพิ่มสินค้าใหม่'}
          </h1>
          <p className="text-gray-500 dark:text-gray-400">กรอกรายละเอียดสินค้าเพื่อแสดงในระบบ</p>
        </div>
      </div>

      {/* ฟอร์มข้อมูลสินค้า */}
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 space-y-6">
        
        {/* ส่วนอัปโหลดรูปภาพ */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            รูปภาพสินค้า <span className="text-red-500">*</span>
          </label>
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer relative">
            <input 
              type="file" 
              accept="image/jpeg, image/png" 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={handleImageChange}
            />
            {formData.image ? (
              <div className="text-emerald-600 dark:text-emerald-400 flex flex-col items-center">
                <ImageIcon size={40} className="mb-2" />
                <span className="font-medium">เลือกรูปภาพแล้ว: {formData.image.name}</span>
                <span className="text-xs text-gray-500 mt-1">คลิกเพื่อเปลี่ยนรูปใหม่</span>
              </div>
            ) : (
              <div className="text-gray-500 dark:text-gray-400 flex flex-col items-center">
                <Upload size={40} className="mb-2 text-gray-400" />
                <span className="font-medium">คลิกเพื่ออัปโหลด หรือลากไฟล์มาวางที่นี่</span>
                <span className="text-xs mt-1">รองรับไฟล์ JPG, PNG ขนาดไม่เกิน 5MB</span>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* ข้อมูลพื้นฐาน */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              ชื่อสินค้า <span className="text-red-500">*</span>
            </label>
            <input 
              type="text" 
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="เช่น เสื้อยืดคอกลม สีดำ"
              className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              ราคาทุน (บาท) <span className="text-red-500">*</span>
            </label>
            <input 
              type="number" 
              name="costPrice"
              min="1"
              value={formData.costPrice}
              onChange={handleChange}
              placeholder="100"
              className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              ราคาขั้นต่ำ (บาท) <span className="text-red-500">*</span>
            </label>
            <input 
              type="number" 
              name="minPrice"
              min="1"
              value={formData.minPrice}
              onChange={handleChange}
              placeholder="150"
              className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none transition-all"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              ราคาต่ำสุดที่ยอมให้ Reseller ตั้งขายได้
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              จำนวนสต็อก (ชิ้น) <span className="text-red-500">*</span>
            </label>
            <input 
              type="number" 
              name="stock"
              min="0"
              value={formData.stock}
              onChange={handleChange}
              placeholder="0"
              className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none transition-all"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              รายละเอียดสินค้า (ไม่บังคับ)
            </label>
            <textarea 
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              placeholder="อธิบายรายละเอียดของสินค้าเพิ่มเติม..."
              className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none transition-all resize-none"
            />
          </div>
        </div>

        {/* ปุ่มบันทึก */}
        <div className="pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-4">
          <Link 
            to="/admin/products"
            className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            ยกเลิก
          </Link>
          <button 
            type="submit"
            className="flex items-center gap-2 px-6 py-2 bg-primary hover:bg-indigo-700 text-white rounded-lg transition-colors shadow-sm"
          >
            <Save size={20} />
            <span>{isEditing ? 'บันทึกการแก้ไข' : 'บันทึกสินค้า'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}