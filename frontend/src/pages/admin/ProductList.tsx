import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Edit, Trash2, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';

// ข้อมูลจำลอง (Mock Data) สำหรับสินค้า
const initialProducts = [
  { id: 1, name: 'เสื้อยืดคอกลม สีดำ', cost: 100, minPrice: 150, stock: 50, image: '' },
  { id: 2, name: 'กางเกงยีนส์ ทรงกระบอก', cost: 250, minPrice: 350, stock: 30, image: '' },
  { id: 3, name: 'หมวกแก๊ป สไตล์มินิมอล', cost: 80, minPrice: 120, stock: 0, image: '' }, // สต็อกหมด
];

export default function ProductList() {
  const [products, setProducts] = useState(initialProducts);
  const [searchTerm, setSearchTerm] = useState('');

  // ฟังก์ชันจำลองการค้นหาสินค้า (โบนัส 2 คะแนน)
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ฟังก์ชันจำลองการลบสินค้า พร้อม Confirm Dialog
  const handleDelete = (id: number) => {
    if (window.confirm('คุณแน่ใจหรือไม่ว่าต้องการลบสินค้านี้?')) {
      setProducts(products.filter(p => p.id !== id));
      toast.success('ลบสินค้าเรียบร้อยแล้ว');
    }
  };

  return (
    <div className="space-y-6">
      {/* ส่วน Header และปุ่มเพิ่มสินค้า */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">จัดการสินค้า</h1>
          <p className="text-gray-500 dark:text-gray-400">เพิ่ม แก้ไข และลบสินค้าในระบบ</p>
        </div>
        
        <Link 
          to="/admin/products/add" 
          className="flex items-center gap-2 bg-primary hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm"
        >
          <Plus size={20} />
          <span>เพิ่มสินค้าใหม่</span>
        </Link>
      </div>

      {/* แถบเครื่องมือ (ค้นหา) */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex justify-between items-center">
        <div className="relative w-full max-w-md">
          <input 
            type="text" 
            placeholder="ค้นหาสินค้า..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
        </div>
      </div>

      {/* ตารางแสดงสินค้า */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">รูปภาพ</th>
                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">ชื่อสินค้า</th>
                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300 text-right">ราคาทุน</th>
                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300 text-right">ราคาขั้นต่ำ</th>
                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300 text-center">สต็อก</th>
                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300 text-center">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/25 transition-colors">
                    <td className="p-4">
                      {product.image ? (
                        <img src={product.image} alt={product.name} className="w-12 h-12 rounded object-cover" />
                      ) : (
                        <div className="w-12 h-12 rounded bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-400">
                          <ImageIcon size={20} />
                        </div>
                      )}
                    </td>
                    <td className="p-4 font-medium text-gray-900 dark:text-white">{product.name}</td>
                    <td className="p-4 text-right text-gray-600 dark:text-gray-300">฿{product.cost}</td>
                    <td className="p-4 text-right text-gray-600 dark:text-gray-300">฿{product.minPrice}</td>
                    <td className="p-4 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        product.stock > 0 
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' 
                          : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                        {product.stock > 0 ? `${product.stock} ชิ้น` : 'สินค้าหมด'}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex justify-center gap-2">
                        <Link 
                          to={`/admin/products/edit/${product.id}`}
                          className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                          title="แก้ไข"
                        >
                          <Edit size={18} />
                        </Link>
                        <button 
                          onClick={() => handleDelete(product.id)}
                          className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          title="ลบ"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500 dark:text-gray-400">
                    ไม่พบรายการสินค้า
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