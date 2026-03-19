import React, { useState, useEffect } from "react";
import { adminService } from "../../services/adminService"; 
import { orderService } from "../../services/orderService"; 
import { formatCurrency } from "../../utils/formatter";
import Loading from "../../components/Loading";
import OrderTable from "../../components/OrderTable";

import {
  Wallet,
  TrendingUp,
  ShoppingCart,
  Package,
  Users,
} from "lucide-react";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalSales: 0,
    totalProfit: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalResellers: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    setLoading(true);

    // 🌟 1. ดึงสถิติ (อ้างอิงตาม JSON จาก Postman ที่คุณส่งมา)
    try {
      const statsData = await adminService.getDashboardStats();
      if (statsData) {
        setStats({
          totalSales: statsData.totalSales || 0,
          totalProfit: statsData.totalProfit || 0,
          totalOrders: statsData.totalOrders || 0,
          totalProducts: statsData.totalProducts || 0, 
          totalResellers: statsData.totalResellers || 0,
        });
      }
    } catch (statsErr) {
      console.error("❌ ดึงสถิติพัง Error:", statsErr);
    }

    // 🌟 2. ดึงรายการ Orders (ใช้ getActiveOrders ตามชื่อใน Service ของคุณ)
    try {
      const ordersData = await orderService.getActiveOrders();
      
      if (Array.isArray(ordersData)) {
        // กรองสถานะที่ไม่ต้องการแสดง
        const hiddenStatuses = ['COMPLETED', 'FAILED', 'CANCELLED', 'FALSE'];
        
        const activeOrders = ordersData.filter(order => {
          const currentStatus = order.status ? order.status.toUpperCase() : '';
          return !hiddenStatuses.includes(currentStatus);
        });

        // 🚀 จัดการเรียงลำดับ และป้องกัน Error กรณี createdAt เป็น null
        const sortedOrders = [...activeOrders].sort((a, b) => {
          const dateA = a.createdAt || a.created_at;
          const dateB = b.createdAt || b.created_at;
          
          // ถ้าวันที่เป็น null ให้ค่าเป็น 0 เพื่อไม่ให้ฟังก์ชัน sort พัง
          const timeA = dateA ? new Date(dateA).getTime() : 0;
          const timeB = dateB ? new Date(dateB).getTime() : 0;
          
          return timeB - timeA;
        });
        
        setRecentOrders(sortedOrders);
      }
    } catch (orderErr) {
      console.error("❌ ดึง Orders พัง (เรียก getActiveOrders):", orderErr);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      // ตรวจสอบว่าใน orderService มี updateStatus หรือยัง
      await orderService.updateStatus(orderId, newStatus);
      fetchDashboardData(); 
    } catch (err) {
      console.error("Update Status Error:", err);
    }
  };

  if (loading) return <Loading />;

  const statCards = [
    {
      label: "Total Sales", 
      value: formatCurrency(stats.totalSales), 
      icon: <Wallet size={18} />,
      color: "text-blue-600",
      iconBg: "bg-blue-200/50",
      cardBg: "bg-blue-50",
      border: "border-b-4 border-blue-400",
    },
    {
      label: "Platform Profit",
      value: formatCurrency(stats.totalProfit), 
      icon: <TrendingUp size={18} />,
      color: "text-emerald-600",
      iconBg: "bg-emerald-200/50",
      cardBg: "bg-emerald-50",
      border: "border-b-4 border-emerald-400",
    },
    {
      label: "Total Orders",
      value: stats.totalOrders.toLocaleString(), 
      icon: <ShoppingCart size={18} />,
      color: "text-purple-600",
      iconBg: "bg-purple-200/50",
      cardBg: "bg-purple-50",
      border: "border-b-4 border-purple-400",
    },
    {
      label: "Total Products",
      value: stats.totalProducts.toLocaleString(), 
      icon: <Package size={18} />,
      color: "text-orange-600",
      iconBg: "bg-orange-200/50",
      cardBg: "bg-orange-50",
      border: "border-b-4 border-orange-400",
    },
    {
      label: "Total Resellers",
      value: stats.totalResellers.toLocaleString(), 
      icon: <Users size={18} />,
      color: "text-indigo-600",
      iconBg: "bg-indigo-200/50",
      cardBg: "bg-indigo-50",
      border: "border-b-4 border-indigo-400",
    },
  ];

  return (
    <div className="min-h-screen bg-white p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">
          Dashboard Overview
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
        {statCards.map((stat, idx) => (
          <div
            key={idx}
            className={`${stat.cardBg} ${stat.border} rounded-xl p-4 shadow-sm hover:shadow-md transition relative overflow-hidden`}
          >
            <div className="absolute right-2 top-2 opacity-10 scale-[2]">
              {stat.icon}
            </div>
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 ${stat.iconBg} ${stat.color}`}
            >
              {stat.icon}
            </div>
            <p className="text-xs font-semibold text-gray-600 mb-1">
              {stat.label}
            </p>
            <h3 className="text-xl font-bold text-gray-900 truncate">
              {stat.value}
            </h3>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          Active Orders 
        </h3>
        {recentOrders.length > 0 ? (
          <OrderTable
            orders={recentOrders}
            role="ADMIN"
            onUpdateStatus={handleUpdateStatus}
          />
        ) : (
          <div className="text-center py-10 text-gray-500">
            ไม่มีรายการออเดอร์ที่กำลังดำเนินการ
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;