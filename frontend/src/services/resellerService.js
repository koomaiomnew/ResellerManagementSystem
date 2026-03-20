import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { orderService } from '../../services/orderService';
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
        
        // 🚀 เรียก API ใหม่ที่หลังบ้านกรองมาให้เสร็จสรรพแล้ว! (โหลดข้อมูลน้อยลงมหาศาล)
        const activeOrders = await orderService.getActiveOrdersByUser(user.id);

        // จัดเรียงจากใหม่ไปเก่าอย่างเดียวพอ จบเลย
        activeOrders.sort((a, b) => new Date(b.createdAt || b.created_at) - new Date(a.createdAt || a.created_at));
        
        setOrders(activeOrders);
        
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
      
      <OrderTable 
        orders={orders} 
        role="reseller" 
      />
    </div>
  );
};

export default ResellerOrders;