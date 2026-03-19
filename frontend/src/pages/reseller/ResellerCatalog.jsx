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
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ✅ โหลดสินค้า global
  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await productService.getAllProducts();
        console.log('CATALOG:', data);
        setProducts(data || []);
      } catch (e) {
        showToast('โหลดสินค้าไม่สำเร็จ', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  // ✅ เปิด modal
  const handleAddClick = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  // ✅ เพิ่มสินค้าเข้าร้าน (API จริง)
  const handleSaveToShop = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const sellingPrice = Number(formData.get('sellingPrice'));

    if (sellingPrice < selectedProduct.minPrice) {
      showToast(`ราคาต้อง ≥ ${selectedProduct.minPrice}`, 'error');
      return;
    }

    try {
      // 🔥 ดึง shop จริง
      const shop = await shopService.getShopProductsBySlug(user.shopSlug);

      console.log('SHOP:', shop);

      if (!shop?.id) {
        throw new Error('ไม่พบ shop');
      }

      await shopService.addProductToShop(shop.id, {
        productId: selectedProduct.id,
        sellingPrice
      });

      showToast('เพิ่มสินค้าแล้ว!', 'success');
      setIsModalOpen(false);

    } catch (err) {
      console.error(err);
      showToast(err.message, 'error');
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Global Product Catalog</h2>

      <div className="grid grid-cols-4 gap-6">
        {products.map(p => (
          <ProductCard
            key={p.id}
            product={p}
            isCatalog
            onAction={handleAddClick}
          />
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl w-96">
            <h3 className="font-bold mb-2">{selectedProduct.name}</h3>
            <p className="text-sm mb-4">Min Price: {selectedProduct.minPrice}</p>

            <form onSubmit={handleSaveToShop}>
              <input
                type="number"
                name="sellingPrice"
                defaultValue={selectedProduct.minPrice}
                min={selectedProduct.minPrice}
                className="border p-2 w-full mb-4"
              />

              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                  Add
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