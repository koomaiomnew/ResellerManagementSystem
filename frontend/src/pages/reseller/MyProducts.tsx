import { useState } from 'react';
import { Package, Trash2, Edit2, Image as ImageIcon, ExternalLink, X, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

// ข้อมูลจำลอง (Mock Data) เฉพาะสินค้าที่ Reseller เลือกเข้าร้านแล้ว
const initialMyProducts = [
  { id: 1, name: 'เสื้อยืดคอกลม สีดำ', cost: 100, minPrice: 150, sellingPrice: 199, stock: 50, image: '' },
  { id: 4, name: 'กระเป๋าผ้า Canvas', cost: 120, minPrice: 180, sellingPrice: 250, stock: 100, image: '' },
];

export default function MyProducts() {
  const [products, setProducts] = useState(initialMyProducts);
  
  // State สำหรับ Modal แก้ไขราคา
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [newPrice, setNewPrice] = useState('');

  // ฟังก์ชันนำสินค้าออกจากร้าน
  const handleRemoveProduct = (id: number) => {
    if (window.confirm('คุณแน่ใจหรือไม่ว่าต้องการนำสินค้านี้ออกจากร้าน?')) {
      setProducts(products.filter(p => p.id !== id));
      toast.success('นำสินค้าออกจากร้านเรียบร้อยแล้ว');
    }
  };

  // ฟังก์ชันเปิด Modal แก้ไขราคา
  const openEditModal = (product: any) => {
    setSelectedProduct(product);
    setNewPrice(product.sellingPrice.toString());
    setIsModalOpen(true);
  };

  // ฟังก์ชันบันทึกราคาใหม่
  const handleSavePrice = (e: React.FormEvent) => {
    e.preventDefault();
    const price = Number(newPrice);

    if (price < selectedProduct.minPrice) {
      toast.error(`ราคาขายต้องไม่ต่ำกว่า ${selectedProduct.minPrice} บาท`);
      return;
    }

    setProducts(products.map(p => 
      p.id === selectedProduct.id ? { ...p, sellingPrice: price } : p
    ));
    
    toast.success('อัปเดตราคาขายเรียบร้อยแล้ว');
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Package className="text-secondary" /> สินค้าในร้านฉัน
          </h1>
          <p className="text-gray-500 dark:text-gray-400">จัดการสินค้าและราคาขายในหน้าร้านของคุณ</p>
        </div>
        
        {/* ปุ่มจำลองเปิดหน้าร้านของตัวเอง */}
        <Link 
          to="/shop/minnieshop" 
          target="_blank"
          className="flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-lg transition-colors shadow-sm"
        >
          <ExternalLink size={18} />
          <span>ดูหน้าร้านของฉัน</span>
        </Link>
      </div>

      {/* Grid แสดงสินค้าในร้าน */}
      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => {
            const profit = product.sellingPrice - product.cost;

            return (
              <div key={product.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col transition-all hover:shadow-md">
                
                <div className="h-48 bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                  <ImageIcon size={48} className="text-gray-300 dark:text-gray-500" />
                </div>

                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-3 line-clamp-2">{product.name}</h3>
                  
                  <div className="space-y-2 mb-4 flex-1 bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg border border-gray-100 dark:border-gray-700">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">ราคาขายของคุณ:</span>
                      <span className="font-bold text-primary dark:text-indigo-400">฿{product.sellingPrice}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">ราคาทุน:</span>
                      <span className="text-gray-700 dark:text-gray-300">฿{product.cost}</span>
                    </div>
                    <div className="pt-2 mt-2 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">กำไรต่อชิ้น:</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">฿{profit}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-auto">
                    <button 
                      onClick={() => openEditModal(product)}
                      className="flex-1 py-2 flex items-center justify-center gap-1.5 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white dark:bg-blue-900/20 dark:hover:bg-blue-600 dark:text-blue-400 font-medium rounded-lg transition-colors text-sm"
                    >
                      <Edit2 size={16} /> แก้ไขราคา
                    </button>
                    <button 
                      onClick={() => handleRemoveProduct(product.id)}
                      className="flex-none p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      title="นำออกจากร้าน"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-12 flex flex-col items-center justify-center text-center">
          <Package size={64} className="text-gray-300 dark:text-gray-600 mb-4" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">ยังไม่มีสินค้าในร้าน</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">ไปที่แค็ตตาล็อกส่วนกลางเพื่อเลือกสินค้ามาวางขายในร้านของคุณ</p>
          <Link 
            to="/reseller/catalog"
            className="px-6 py-2.5 bg-secondary hover:bg-emerald-600 text-white font-medium rounded-lg transition-colors shadow-sm"
          >
            เลือกสินค้าเข้าร้าน
          </Link>
        </div>
      )}

      {/* Modal แก้ไขราคา */}
      {isModalOpen && selectedProduct && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">แก้ไขราคาขาย</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSavePrice} className="p-6">
              <div className="mb-6 space-y-3">
                <p className="font-medium text-gray-900 dark:text-white text-lg">{selectedProduct.name}</p>
                <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 p-3 rounded-lg text-sm flex items-start gap-2">
                  <AlertCircle size={18} className="shrink-0 mt-0.5" />
                  <p>ราคาทุน <b>฿{selectedProduct.cost}</b><br/>ราคาขั้นต่ำที่ระบบอนุญาต <b>฿{selectedProduct.minPrice}</b></p>
                </div>
              </div>

              <div className="space-y-2 mb-8">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  ราคาขายใหม่ (บาท) <span className="text-red-500">*</span>
                </label>
                <input 
                  type="number" 
                  required
                  min={selectedProduct.minPrice}
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  className="w-full text-lg px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-secondary outline-none transition-all"
                />
                {newPrice && Number(newPrice) > selectedProduct.cost && (
                  <p className="text-emerald-600 dark:text-emerald-400 text-sm font-medium mt-2">
                    กำไรที่จะได้รับ: ฿{Number(newPrice) - selectedProduct.cost} / ชิ้น
                  </p>
                )}
              </div>

              <div className="flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2.5 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  ยกเลิก
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-sm"
                >
                  บันทึกราคาใหม่
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}