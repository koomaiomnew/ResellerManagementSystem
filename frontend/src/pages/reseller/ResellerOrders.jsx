import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { orderService } from '../../services/orderService';
import { shopService } from '../../services/shopService'; // 🌟 นำเข้า shopService
import OrderTable from '../../components/OrderTable';
import Loading from '../../components/Loading';
import { showToast } from '../../components/Toast';

const ResellerOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.id) return;

      try {
        setLoading(true);
        // 1. ดึงข้อมูลร้านค้าเพื่อเอา shopId
        const shop = await shopService.getMyShop(user.id);

        if (shop && shop.id) {
          // 2. ดึงออเดอร์ทั้งหมดของร้านนี้ (API จริง)
          const data = await orderService.getOrdersByShop(shop.id);
          
          // 3. 🌟 กรองเอาเฉพาะออเดอร์ที่สถานะ "ไม่ใช่ COMPLETED"
          // ใช้ toUpperCase() เพื่อกันพลาดเรื่องตัวพิมพ์เล็ก/ใหญ่
          const activeOrders = data.filter(
            order => order.status?.toLowerCase() !== 'completed'
          );

          // 4. เรียงลำดับจากออเดอร์ใหม่สุดไปเก่าสุด
          activeOrders.sort((a, b) => new Date(b.createdAt || b.created_at) - new Date(a.createdAt || a.created_at));
          
          setOrders(activeOrders);
        }
      } catch (err) {
        console.error("Error fetching active orders:", err);
        showToast('ไม่สามารถโหลดข้อมูลออเดอร์ได้', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  if (loading) return <Loading />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">ออเดอร์ที่ต้องดำเนินการ (Active Orders)</h2>
      </div>
      
      {/* โยน orders ที่ถูกกรองแล้วไปให้ Component OrderTable จัดการต่อ */}
      <OrderTable 
        orders={orders} 
        role="reseller" 
      />
    </div>
  );
};

export default ResellerOrders;