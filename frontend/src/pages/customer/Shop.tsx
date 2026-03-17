import { useParams, Link } from 'react-router-dom';
import { ShoppingBag, Image as ImageIcon, Search, Store } from 'lucide-react';
import { useState } from 'react';

// ข้อมูลจำลอง (Mock Data) สินค้าที่ตัวแทน(มินนี่ช็อป) เลือกมาขาย
const shopProducts = [
  { id: 1, name: 'เสื้อยืดคอกลม สีดำ', sellingPrice: 199, stock: 50, image: '' },
  { id: 4, name: 'กระเป๋าผ้า Canvas', sellingPrice: 250, stock: 100, image: '' },
  { id: 3, name: 'หมวกแก๊ป สไตล์มินิมอล', sellingPrice: 150, stock: 0, image: '' }, // สต็อกหมด
];

export default function Shop() {
  const { slug } = useParams(); // ดึงชื่อร้านจาก URL เช่น minnieshop
  const [searchTerm, setSearchTerm] = useState('');

  // ค้นหาสินค้าในหน้าร้าน (คะแนนพิเศษ Bonus)
  const filteredProducts = shopProducts.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200 font-sans">
      
      {/* Navbar ของหน้าร้าน */}
      <nav className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="bg-primary/10 p-2 rounded-lg text-primary dark:text-indigo-400">
                <Store size={24} />
              </div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white capitalize">
                ร้าน {slug || 'Shop'}
              </h1>
            </div>
            
            <div className="flex items-center gap-4">
              {/* แถบค้นหาสินค้า (ซ่อนในจอมือถือ ไปแสดงด้านล่างแทน) */}
              <div className="hidden md:flex relative">
                <input 
                  type="text" 
                  placeholder="ค้นหาสินค้า..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-4 py-1.5 border border-gray-200 dark:border-gray-700 rounded-full bg-gray-50 dark:bg-gray-900 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary w-64"
                />
                <Search className="absolute left-3 top-2 text-gray-400" size={16} />
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* แถบค้นหาสำหรับจอมือถือ */}
      <div className="md:hidden p-4 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700">
        <div className="relative">
          <input 
            type="text" 
            placeholder="ค้นหาสินค้า..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
      </div>

      {/* Main Content (แสดงสินค้า) */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => {
              const isOutOfStock = product.stock === 0;

              return (
                <div key={product.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col group hover:shadow-md transition-shadow">
                  
                  {/* รูปสินค้า */}
                  <div className="aspect-square bg-gray-100 dark:bg-gray-700 relative flex items-center justify-center overflow-hidden">
                    <ImageIcon size={48} className="text-gray-300 dark:text-gray-500 group-hover:scale-110 transition-transform duration-300" />
                    
                    {isOutOfStock && (
                      <div className="absolute inset-0 bg-white/50 dark:bg-black/50 backdrop-blur-[2px] flex items-center justify-center z-10">
                        <span className="bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900 px-4 py-1.5 rounded-full text-sm font-bold shadow-lg">
                          สินค้าหมด
                        </span>
                      </div>
                    )}
                  </div>

                  {/* รายละเอียดสินค้า */}
                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="font-medium text-gray-900 dark:text-white text-sm sm:text-base line-clamp-2 mb-2 flex-1">
                      {product.name}
                    </h3>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mt-auto">
                      <span className="text-lg font-bold text-primary dark:text-indigo-400">
                        ฿{product.sellingPrice}
                      </span>
                      
                      {/* ปุ่มสั่งซื้อ */}
                      {isOutOfStock ? (
                        <button disabled className="w-full sm:w-auto px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 text-sm font-medium rounded-lg cursor-not-allowed text-center">
                          สินค้าหมด
                        </button>
                      ) : (
                        <Link 
                          to={`/shop/${slug}/checkout?productId=${product.id}`}
                          className="w-full sm:w-auto px-3 py-2 bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-900 text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                        >
                          <ShoppingBag size={16} /> สั่งซื้อ
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full py-12 text-center text-gray-500 dark:text-gray-400">
              <ShoppingBag size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-3" />
              <p>ไม่พบสินค้าที่คุณค้นหา</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}