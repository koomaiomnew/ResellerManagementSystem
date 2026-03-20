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
  
  // 🌟 เพิ่ม State สำหรับเก็บคำค้นหา
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.id) return;

      try {
        setLoading(true);
        
        // 🚀 เรียก API ใหม่ที่หลังบ้านกรองมาให้เสร็จสรรพแล้ว!
        const activeOrders = await orderService.getActiveOrdersByUser(user.id);

        // จัดเรียงจากใหม่ไปเก่า
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

  // 🌟 ฟังก์ชันกรองข้อมูลลูกค้าจากคำค้นหา (ค้นได้ทั้ง ชื่อลูกค้า, เบอร์โทร, เลขออเดอร์)
  const filteredOrders = orders.filter(order => {
    const searchLower = searchTerm.toLowerCase();
    const customerName = (order.customerName || order.customer_name || '').toLowerCase();
    const phone = (order.phone || '').toLowerCase();
    const orderNum = (order.orderNumber || order.order_number || '').toLowerCase();

    return customerName.includes(searchLower) || 
           phone.includes(searchLower) || 
           orderNum.includes(searchLower);
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">ออเดอร์ที่ต้องดำเนินการ</h2>
          <p className="text-gray-500 text-sm mt-1">
            มีออเดอร์ค้างอยู่ทั้งหมด {orders.length} รายการ
          </p>
        </div>

        {/* 🌟 ช่องค้นหาข้อมูลลูกค้า */}
        <div className="w-full sm:w-72 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="ค้นหาชื่อลูกค้า, เบอร์, เลขออเดอร์..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-all"
          />
        </div>
      </div>
      
      {/* โยน orders ที่ถูกกรองจากการค้นหาไปให้ Table */}
      <OrderTable 
        orders={filteredOrders} 
        role="reseller" 
      />
    </div>
  );
};

export default ResellerOrders;