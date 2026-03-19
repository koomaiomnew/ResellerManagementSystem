import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { shopService } from '../../services/shopService';
import ProductTable from '../../components/ProductTable';
import Loading from '../../components/Loading';
import { showToast } from '../../components/Toast';

const ResellerMyProducts = () => {
  const { user } = useAuth();
  const [shopProducts, setShopProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [shopId, setShopId] = useState(null);

  // ดึงข้อมูลจริงจาก DB
  const fetchMyProducts = async () => {
    try {
      setLoading(true);
      // 1. ดึงร้านของ User นี้ก่อนเพื่อเอา shopId และ shopSlug
      const myShop = await shopService.getMyShop(user.id);
      setShopId(myShop.id); 

      // 2. ดึงสินค้าในร้าน
      const products = await shopService.getShopProductsBySlug(myShop.shopSlug);
      
      // แปลงข้อมูลให้เข้ากับ ProductTable
      const formatted = products.map(p => ({
        id: p.productId,
        name: p.name,
        imageUrl: p.imageUrl,
        sellingPrice: p.sellingPrice,
        minPrice: 0 // ถ้าไม่ได้ส่งมาจาก backend ใส่ 0 ไว้กันพัง
      }));
      
      setShopProducts(formatted);
    } catch (err) {
      showToast(err.message || 'โหลดข้อมูลสินค้าไม่สำเร็จ', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) fetchMyProducts();
  }, [user]);

  // ฟังก์ชันลบสินค้า
  const handleDelete = async (productId) => {
    if (window.confirm('คุณต้องการนำสินค้านี้ออกจากร้านใช่หรือไม่?')) {
      try {
        if (!shopId) throw new Error('ไม่พบรหัสร้านค้า');
        
        // ยิง API จริง
        await shopService.deleteProductFromShop(shopId, productId);
        
        // ลบแถวออกจาก UI
        setShopProducts(prev => prev.filter(p => p.id !== productId));
        showToast('นำสินค้าออกจากร้านสำเร็จ');
      } catch (err) {
        showToast(err.message || 'เกิดข้อผิดพลาดในการนำสินค้าออก', 'error');
      }
    }
  };

  const handleEdit = (product) => {
    showToast('กำลังพัฒนาระบบอัปเดตราคา', 'info');
  };

  if (loading) return <Loading />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">สินค้าในร้านของฉัน</h2>
        <a href="/reseller/catalog" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow transition font-medium">
          ไปที่คลังสินค้า
        </a>
      </div>

      <ProductTable 
        products={shopProducts} 
        role="RESELLER" 
        onEdit={handleEdit} 
        onDelete={handleDelete} 
      />
    </div>
  );
};

export default ResellerMyProducts;