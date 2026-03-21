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

  if (loading) return <Loading />;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">
        คลังสินค้าส่วนกลาง
      </h2>

      {/* 🔥 ถ้าไม่มีสินค้า */}
      {products.length === 0 ? (
        <p className="text-gray-500">ไม่มีสินค้าในระบบ</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              isCatalog={true}
              onAction={handleAddClick}
            />
          ))}
        </div>
      )}

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
                className="w-full border-gray-300 rounded-lg px-4 py-3 border"
              />

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setSelectedProduct(null);
                  }}
                  className="px-4 py-2 bg-gray-200 rounded-lg"
                >
                  ยกเลิก
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg"
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