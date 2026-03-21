import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { productService } from '../../services/productService';
import { shopService } from '../../services/shopService';
import ProductCard from '../../components/ProductCard';
import Loading from '../../components/Loading';
import { showToast } from '../../components/Toast';

const ResellerCatalog = () => {
  const { user } = useAuth();

  const [products, setProducts] = useState([]);
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  // 1. เพิ่ม State สำหรับเก็บคำค้นหา
  const [searchTerm, setSearchTerm] = useState('');

  // 🔥 FIX: ไม่ยิง API ถ้า user ยังไม่มา
  useEffect(() => {
    if (!user?.id) return;

    const init = async () => {
      setLoading(true);
      try {
        const [productData, shopData] = await Promise.all([
          productService.getAllProducts(),
          shopService.getMyShop(user.id)
        ]);

        setProducts(productData);
        setShop(shopData);

      } catch (err) {
        console.error(err);

        // 🔥 ถ้าไม่มีร้าน → แจ้ง user
        if (err.message.includes('ไม่พบร้านค้า')) {
          showToast('คุณยังไม่มีร้านค้า กรุณาสร้างร้านก่อน', 'error');
        } else {
          showToast('โหลดข้อมูลไม่สำเร็จ', 'error');
        }

      } finally {
        setLoading(false);
      }
    };

    init();
  }, [user?.id]); // 🔥 FIX: ไม่ใช้ [user] เดี๋ยว render ซ้ำ

  const handleAddClick = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleSaveToShop = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const sellingPrice = Number(formData.get('sellingPrice'));

    if (sellingPrice < selectedProduct.minPrice) {
      showToast(
        `ราคาขายต้องไม่ต่ำกว่าราคาขั้นต่ำ ฿${selectedProduct.minPrice}`,
        'error'
      );
      return;
    }

    try {
      if (!shop?.id) {
        showToast('ไม่พบร้านค้า กรุณาสร้างร้านก่อน', 'error');
        return;
      }

      await shopService.addProductToShop(shop.id, {
        productId: selectedProduct.id,
        sellingPrice
      });

      showToast('เพิ่มสินค้าเรียบร้อยแล้ว');

      setIsModalOpen(false);
      setSelectedProduct(null); // 🔥 reset state

    } catch (err) {
      console.error(err);
      showToast(err.message || 'เพิ่มสินค้าไม่สำเร็จ', 'error');
    }
  };

  // 2. กรองข้อมูลสินค้าตามคำค้นหา (ค้นหาจากชื่อ เล็ก-ใหญ่ได้หมด)
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <Loading />;

  return (
    <div className="space-y-6">
      
      {/* 3. ปรับ Layout ส่วนหัวให้มีช่องค้นหา */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800">
          คลังสินค้าส่วนกลาง
        </h2>

        {/* ช่อง Input สำหรับค้นหา */}
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="ค้นหาสินค้า..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
          <svg 
            className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* 4. เปลี่ยนมาใช้ filteredProducts แทน products ในการแสดงผล */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-10 bg-white rounded-xl border border-gray-200">
          <p className="text-gray-500">
            {products.length === 0 ? 'ไม่มีสินค้าในระบบ' : 'ไม่พบสินค้าที่ค้นหา'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              isCatalog={true}
              onAction={handleAddClick}
            />
          ))}
        </div>
      )}

      {/* Modal เพิ่มสินค้า (โค้ดเดิม) */}
      {isModalOpen && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">
              เพิ่มสินค้าเข้าร้านค้า
            </h3>

            <div className="mb-4 p-4 bg-blue-50 rounded-lg">
              <p className="font-bold text-blue-800 text-lg">
                {selectedProduct.name}
              </p>
              <p className="text-sm text-blue-600">
                ราคาขั้นต่ำ: ฿{selectedProduct.minPrice}
              </p>
            </div>

            <form onSubmit={handleSaveToShop} className="space-y-4">
              <input
                type="number"
                name="sellingPrice"
                min={selectedProduct.minPrice}
                defaultValue={selectedProduct.minPrice}
                required
                className="w-full border-gray-300 rounded-lg px-4 py-3 border focus:ring-blue-500 focus:border-blue-500"
              />

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setSelectedProduct(null);
                  }}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition"
                >
                  ยกเลิก
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm transition"
                >
                  ยืนยันเพิ่มสินค้า
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResellerCatalog;