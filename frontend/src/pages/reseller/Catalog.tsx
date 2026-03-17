import { useState } from 'react';
import { Store, Image as ImageIcon, Plus, Edit2, AlertCircle, X } from 'lucide-react';
import toast from 'react-hot-toast';

// ข้อมูลจำลอง สินค้าจาก Admin
const centralProducts = [
  { id: 1, name: 'เสื้อยืดคอกลม สีดำ', cost: 100, minPrice: 150, stock: 50, image: '' },
  { id: 2, name: 'กางเกงยีนส์ ทรงกระบอก', cost: 250, minPrice: 350, stock: 30, image: '' },
  { id: 3, name: 'หมวกแก๊ป สไตล์มินิมอล', cost: 80, minPrice: 120, stock: 0, image: '' }, // สต็อกหมด
  { id: 4, name: 'กระเป๋าผ้า Canvas', cost: 120, minPrice: 180, stock: 100, image: '' },
];

export default function Catalog() {
  // จำลอง State ของสินค้าที่เราเลือกเข้าร้านตัวเองไปแล้ว
  const [myShopProducts, setMyShopProducts] = useState<{id: number, sellingPrice: number}[]>([
    { id: 1, sellingPrice: 199 } // สมมติว่าเคยเพิ่มเสื้อยืดเข้าร้านไปแล้วในราคา 199
  ]);

  // State สำหรับควบคุม Popup (Modal)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [sellingPrice, setSellingPrice] = useState('');

  // ฟังก์ชันเปิด Popup
  const openModal = (product: any) => {
    setSelectedProduct(product);
    // เช็คว่าเคยเพิ่มไปหรือยัง ถ้าเคยแล้วให้ดึงราคาเดิมมาแสดง
    const existing = myShopProducts.find(p => p.id === product.id);
    setSellingPrice(existing ? existing.sellingPrice.toString() : '');
    setIsModalOpen(true);
  };

  // ฟังก์ชันบันทึกราคาและเพิ่มเข้าร้าน
  const handleSaveToShop = (e: React.FormEvent) => {
    e.preventDefault();
    const price = Number(sellingPrice);

    // ตรวจสอบ BR-19: ราคาที่ตั้ง < ราคาขั้นต่ำ
    if (price < selectedProduct.minPrice) {
      toast.error(`ไม่สามารถตั้งราคาต่ำกว่า ${selectedProduct.minPrice} บาทได้`);
      return;
    }

    // บันทึกลง State (จำลองการบันทึกลง Database)
    const existingIndex = myShopProducts.findIndex(p => p.id === selectedProduct.id);
    if (existingIndex >= 0) {
      // อัปเดตราคาเดิม
      const updated = [...myShopProducts];
      updated[existingIndex].sellingPrice = price;
      setMyShopProducts(updated);
      toast.success('อัปเดตราคาขายเรียบร้อยแล้ว');
    } else {
      // เพิ่มสินค้าใหม่เข้าร้าน
      setMyShopProducts([...myShopProducts, { id: selectedProduct.id, sellingPrice: price }]);
      toast.success('เพิ่มสินค้าเข้าสู่ร้านของคุณเรียบร้อยแล้ว!');
    }

    setIsModalOpen(false); // ปิด Popup
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Store className="text-secondary" /> แค็ตตาล็อกสินค้าส่วนกลาง
        </h1>
        <p className="text-gray-500 dark:text-gray-400">เลือกสินค้าที่คุณต้องการนำไปวางขายในร้านของคุณ</p>
      </div>

      {/* Grid แสดงสินค้า */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {centralProducts.map((product) => {
          const isAlreadyInShop = myShopProducts.find(p => p.id === product.id);
          const isOutOfStock = product.stock === 0;

          return (
            <div key={product.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col transition-transform hover:-translate-y-1 hover:shadow-md">
              {/* รูปภาพ */}
              <div className="h-48 bg-gray-100 dark:bg-gray-700 flex items-center justify-center relative">
                <ImageIcon size={48} className="text-gray-300 dark:text-gray-500" />
                {isOutOfStock && (
                  <div className="absolute inset-0 bg-white/60 dark:bg-black/50 backdrop-blur-[2px] flex items-center justify-center">
                    <span className="bg-red-500 text-white px-4 py-1.5 rounded-full font-bold shadow-lg transform -rotate-12">
                      สินค้าหมด
                    </span>
                  </div>
                )}
              </div>

              {/* รายละเอียด */}
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-2 line-clamp-2">{product.name}</h3>
                
                <div className="space-y-1 mb-4 flex-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">ราคาทุน:</span>
                    <span className="font-medium text-gray-900 dark:text-gray-200">฿{product.cost}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">ราคาขายขั้นต่ำ:</span>
                    <span className="font-medium text-red-500 dark:text-red-400">฿{product.minPrice}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">สต็อกคงเหลือ:</span>
                    <span className="font-medium text-emerald-600 dark:text-emerald-400">{product.stock} ชิ้น</span>
                  </div>
                </div>

                {/* ปุ่มกด (จัดการ Business Rules) */}
                {isOutOfStock ? (
                   <button disabled className="w-full py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 font-medium rounded-lg cursor-not-allowed">
                     สินค้าหมด
                   </button>
                ) : isAlreadyInShop ? (
                  <button 
                    onClick={() => openModal(product)}
                    className="w-full py-2.5 flex items-center justify-center gap-2 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white dark:bg-blue-900/20 dark:hover:bg-blue-600 dark:text-blue-400 font-medium rounded-lg transition-colors"
                  >
                    <Edit2 size={18} /> แก้ไขราคา (ตั้งไว้ ฿{isAlreadyInShop.sellingPrice})
                  </button>
                ) : (
                  <button 
                    onClick={() => openModal(product)}
                    className="w-full py-2.5 flex items-center justify-center gap-2 bg-secondary hover:bg-emerald-600 text-white font-medium rounded-lg transition-colors shadow-sm"
                  >
                    <Plus size={18} /> เพิ่มเข้าร้าน
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Popup (Modal) สำหรับตั้งราคา */}
      {isModalOpen && selectedProduct && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header Modal */}
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">ตั้งราคาขายสินค้า</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                <X size={24} />
              </button>
            </div>
            
            {/* Body Modal */}
            <form onSubmit={handleSaveToShop} className="p-6">
              <div className="mb-6 space-y-3">
                <p className="font-medium text-gray-900 dark:text-white text-lg">{selectedProduct.name}</p>
                <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 p-3 rounded-lg text-sm flex items-start gap-2">
                  <AlertCircle size={18} className="shrink-0 mt-0.5" />
                  <p>ราคาทุน <b>฿{selectedProduct.cost}</b><br/>คุณต้องตั้งราคาขายให้ไม่ต่ำกว่า <b>฿{selectedProduct.minPrice}</b></p>
                </div>
              </div>

              <div className="space-y-2 mb-8">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  ราคาที่คุณจะขาย (บาท) <span className="text-red-500">*</span>
                </label>
                <input 
                  type="number" 
                  required
                  min={1}
                  value={sellingPrice}
                  onChange={(e) => setSellingPrice(e.target.value)}
                  placeholder={`ต้องไม่ต่ำกว่า ${selectedProduct.minPrice}`}
                  className="w-full text-lg px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-secondary outline-none transition-all"
                />
                {sellingPrice && Number(sellingPrice) > selectedProduct.cost && (
                  <p className="text-emerald-600 dark:text-emerald-400 text-sm font-medium mt-2">
                    กำไรที่จะได้รับ: ฿{Number(sellingPrice) - selectedProduct.cost} / ชิ้น
                  </p>
                )}
              </div>

              {/* Footer Modal */}
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
                  className="flex-1 px-4 py-2.5 bg-secondary hover:bg-emerald-600 text-white font-medium rounded-lg transition-colors shadow-sm"
                >
                  บันทึกราคา
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}