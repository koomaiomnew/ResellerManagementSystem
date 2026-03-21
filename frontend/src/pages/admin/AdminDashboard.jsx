import React, { useState, useEffect } from "react";
import { adminService } from "../../services/adminService"; 
import { orderService } from "../../services/orderService"; 
import { formatCurrency } from "../../utils/formatter";
import Loading from "../../components/Loading";
import OrderTable from "../../components/OrderTable";
import { showToast } from "../../components/Toast"; 
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line
} from "recharts";

import { Wallet, TrendingUp, ShoppingCart, Package, Users } from "lucide-react";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalSales: 0,
    totalProfit: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalResellers: 0
  });
  
  // 🌟 เพิ่ม State สำหรับเก็บข้อมูลกราฟ
  const [chartData, setChartData] = useState([]);
  
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- ฟังก์ชันดึงข้อมูล Dashboard ---
  const fetchDashboardData = async () => {
    try {
      // 1. ดึงสถิติ Dashboard
      const statsData = await adminService.getDashboardStats();
      if (statsData) {
        setStats({
          totalSales: statsData.totalSales || 0,
          totalProfit: statsData.totalProfit || 0,
          totalOrders: statsData.totalOrders || 0,
          totalProducts: statsData.totalProducts || 0, 
          totalResellers: statsData.totalResellers || 0,
        });

        // 🌟 ดึงข้อมูลกราฟจาก API (รอ Backend อัปเดตให้ส่ง chartData มา)
        if (statsData.chartData && Array.isArray(statsData.chartData)) {
          setChartData(statsData.chartData);
        } else {
          setChartData([]); // ถ้า API ยังไม่ส่งมา ให้กราฟว่างไว้
        }
      }

      // 2. ดึงรายการออเดอร์
      const ordersData = await orderService.getActiveOrders();
      if (Array.isArray(ordersData)) {
        const hiddenStatuses = ['COMPLETED', 'FAILED', 'CANCELLED', 'FALSE', 'สำเร็จ', 'ยกเลิก'];
        const activeOrders = ordersData.filter(order => {
          const currentStatus = order.status ? order.status : '';
          return !hiddenStatuses.includes(currentStatus) && !hiddenStatuses.includes(currentStatus.toUpperCase());
        });

        const sortedOrders = [...activeOrders].sort((a, b) => {
          const dateA = a.createdAt || a.created_at;
          const dateB = b.createdAt || b.created_at;
          return (dateB ? new Date(dateB).getTime() : 0) - (dateA ? new Date(dateA).getTime() : 0);
        });
        setRecentOrders(sortedOrders);
      }
    } catch (err) {
      console.error("❌ Dashboard Error:", err);
      if (typeof showToast === 'function' && loading) {
        showToast("ไม่สามารถโหลดข้อมูลได้", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await orderService.updateStatus(orderId, newStatus);
      if (typeof showToast === 'function') {
        showToast(`อัปเดตออเดอร์ #${orderId} เป็น '${newStatus}' เรียบร้อย`, "success");
      } else {
        alert(`อัปเดตออเดอร์ #${orderId} เป็น '${newStatus}' เรียบร้อย`);
      }
      fetchDashboardData(); 
    } catch (err) {
      console.error("Update Status Error:", err);
      if (typeof showToast === 'function') {
        showToast("อัปเดตสถานะไม่สำเร็จ กรุณาลองใหม่", "error");
      } else {
        alert("อัปเดตสถานะไม่สำเร็จ");
      }
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchDashboardData();
  }, []);

  if (loading) return <Loading />;

  const statCards = [
    { label: "Total Sales", value: formatCurrency(stats.totalSales), icon: <Wallet size={18} />, color: "text-blue-600", iconBg: "bg-blue-100", cardBg: "bg-white", border: "border-b-4 border-blue-500" },
    { label: "Platform Profit", value: formatCurrency(stats.totalProfit), icon: <TrendingUp size={18} />, color: "text-emerald-600", iconBg: "bg-emerald-100", cardBg: "bg-white", border: "border-b-4 border-emerald-500" },
    { label: "Total Orders", value: stats.totalOrders.toLocaleString(), icon: <ShoppingCart size={18} />, color: "text-purple-600", iconBg: "bg-purple-100", cardBg: "bg-white", border: "border-b-4 border-purple-500" },
    { label: "Total Products", value: stats.totalProducts.toLocaleString(), icon: <Package size={18} />, color: "text-orange-600", iconBg: "bg-orange-100", cardBg: "bg-white", border: "border-b-4 border-orange-500" },
    { label: "Total Resellers", value: stats.totalResellers.toLocaleString(), icon: <Users size={18} />, color: "text-indigo-600", iconBg: "bg-indigo-100", cardBg: "bg-white", border: "border-b-4 border-indigo-500" },
  ];

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 space-y-8">
      <div>
        <h2 className="text-2xl font-black text-gray-800 tracking-tight">ADMIN DASHBOARD</h2>
        <p className="text-gray-500 text-sm">ภาพรวมระบบและรายการที่ต้องจัดการ</p>
      </div>

      {/* สถิติ 5 กล่อง */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {statCards.map((stat, idx) => (
          <div key={idx} className={`${stat.cardBg} ${stat.border} rounded-2xl p-5 shadow-sm hover:shadow-md transition-all relative overflow-hidden group`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${stat.iconBg} ${stat.color} group-hover:scale-110 transition-transform`}>
              {stat.icon}
            </div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <h3 className="text-xl font-black text-gray-900 truncate">{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* ส่วนแสดงกราฟ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-6">ยอดขายและกำไร (รายเดือน)</h3>
          <div className="h-72 w-full">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} cursor={{fill: '#f9fafb'}} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
                  <Bar dataKey="sales" name="ยอดขาย" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={20} />
                  <Bar dataKey="profit" name="กำไร" fill="#10b981" radius={[4, 4, 0, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
               <div className="h-full flex items-center justify-center text-gray-400 text-sm">ยังไม่มีข้อมูลกราฟรายเดือน</div>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-6">แนวโน้มการเติบโต</h3>
          <div className="h-72 w-full">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
                  <Line type="monotone" dataKey="sales" name="ยอดขาย" stroke="#3b82f6" strokeWidth={3} dot={{r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff'}} activeDot={{r: 6}} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
               <div className="h-full flex items-center justify-center text-gray-400 text-sm">ยังไม่มีข้อมูลกราฟรายเดือน</div>
            )}
          </div>
        </div>
      </div>

      {/* ตารางออเดอร์ */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-8 py-6 border-b border-gray-50 flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-800">
            Active Orders <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-600 rounded-lg text-xs">{recentOrders.length}</span>
          </h3>
          <button onClick={fetchDashboardData} className="text-xs font-bold text-blue-600 hover:text-blue-700 underline">Refresh Data</button>
        </div>
        <div className="p-2">
          {recentOrders.length > 0 ? (
            <OrderTable orders={recentOrders} role="ADMIN" onUpdateStatus={handleUpdateStatus} />
          ) : (
            <div className="text-center py-20">
              <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="text-gray-300" size={32} />
              </div>
              <p className="text-gray-400 font-medium">ไม่มีรายการออเดอร์ที่ค้างอยู่</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;