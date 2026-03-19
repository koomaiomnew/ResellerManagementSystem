import React, { useState, useEffect } from 'react';
import { orderService } from '../../services/orderService';
import OrderTable from '../../components/OrderTable';
import Loading from '../../components/Loading';
import { showToast } from '../../components/Toast';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  // 🌟 เพิ่มโหมดสำหรับเลือกดู: 'active' (กำลังทำ) หรือ 'all' (ทั้งหมด)
  const [viewMode, setViewMode] = useState('active'); 

  const fetchOrders = async () => {
    setLoading(true);
    try {
      // 🚀 เลือกดึงข้อมูลตามโหมด
      const data = (viewMode === 'active') 
        ? await orderService.getActiveOrders() 
        : await orderService.getAllOrders();

      if (Array.isArray(data)) {
        let filteredData = [...data];

        // 🌟 ถ้าเป็นโหมด Active ให้ใช้ Logic กรองเหมือนหน้า Dashboard
        if (viewMode === 'active') {
          const hiddenStatuses = ['COMPLETED', 'FAILED', 'CANCELLED', 'FALSE', 'completed', 'false'];
          filteredData = data.filter(order => {
            const currentStatus = order.status ? order.status.toUpperCase() : '';
            return !hiddenStatuses.includes(currentStatus);
          });
        }

        // 🚀 เรียงลำดับจากใหม่ไปเก่า (ป้องกัน Error กรณีวันที่เป็น null แบบใน Dashboard)
        filteredData.sort((a, b) => {
          const dateA = a.createdAt || a.created_at;
          const dateB = b.createdAt || b.created_at;
          const timeA = dateA ? new Date(dateA).getTime() : 0;
          const timeB = dateB ? new Date(dateB).getTime() : 0;
          return timeB - timeA;
        });

        setOrders(filteredData);
      }
    } catch (err) {
      console.error("Fetch Error:", err);
      showToast('ไม่สามารถโหลดข้อมูลออเดอร์ได้', 'error');
    } finally {
      setLoading(false);
    }
  };

  // โหลดข้อมูลใหม่ทุกครั้งที่เปลี่ยน viewMode
  useEffect(() => {
    fetchOrders();
  }, [viewMode]);

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await orderService.updateStatus(id, newStatus);
      showToast(`อัปเดตสถานะเป็น ${newStatus} สำเร็จ`);
      fetchOrders(); // รีโหลดข้อมูลใหม่
    } catch (err) {
      showToast('อัปเดตสถานะไม่สำเร็จ', 'error');
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-white p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Manage Orders</h2>
          <p className="text-sm text-gray-500">จัดการรายการสั่งซื้อทั้งหมดในระบบ</p>
        </div>

        {/* 🌟ปุ่ม Filter สไตล์ Tabs กะทัดรัด */}
        <div className="inline-flex p-1 bg-gray-100 rounded-xl border border-gray-200">
          <button
            onClick={() => setViewMode('active')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              viewMode === 'active'
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Active Orders
          </button>
          <button
            onClick={() => setViewMode('all')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              viewMode === 'all'
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            All Orders
          </button>
        </div>
      </div>

      {/* 🌟 ส่วนแสดงตาราง */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">
          {viewMode === 'active' ? "รายการที่ต้องดำเนินการ" : "รายการสั่งซื้อทั้งหมด"}
        </h3>
        
        {orders.length > 0 ? (
          <OrderTable 
            orders={orders} 
            role="ADMIN" 
            onUpdateStatus={handleStatusUpdate} 
          />
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
             <ShoppingCart size={48} className="mb-2 opacity-20" />
             <p>ไม่มีรายการออเดอร์ในหมวดนี้</p>
          </div>
        )}
      </div>
    </div>
  );
};

// เพิ่ม ShoppingCart icon สำหรับหน้าว่าง
import { ShoppingCart } from "lucide-react";

export default AdminOrders;