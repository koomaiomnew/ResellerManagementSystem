import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { walletService } from '../../services/walletService';
import { shopService } from '../../services/shopService';
import { orderService } from '../../services/orderService'; 
import { formatCurrency } from '../../utils/formatter';
import Loading from '../../components/Loading';

const ResellerDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return;

      try {
        setLoading(true);

        // 🚀 ยิง API พร้อมกัน 3 เส้นรวดเดียวเลย! (ไม่มี Waterfall แล้ว)
        const [shopData, balance, allOrders] = await Promise.all([
          shopService.getMyShop(user.id).catch(() => null),
          walletService.getWalletBalance(user.id).catch(() => 0),
          orderService.getOrdersByUser(user.id).catch(() => []) // 🌟 ใช้ API ใหม่ตรงนี้!
        ]);

        setShop(shopData);

        // 🌟 นำออเดอร์ทั้งหมดมากรองเฉพาะที่กำลังดำเนินการ (Active)
        const hiddenStatuses = ['COMPLETED', 'FAILED', 'CANCELLED', 'FALSE', 'สำเร็จ', 'ยกเลิก', 'โยนทิ้ง'];
        const activeOrders = allOrders.filter(order => {
            const currentStatus = order.status ? order.status : '';
            return !hiddenStatuses.includes(currentStatus) && !hiddenStatuses.includes(currentStatus.toUpperCase());
        });

        // เรียงลำดับจากใหม่ไปเก่า
        const sortedOrders = activeOrders.sort(
          (a, b) => new Date(b.createdAt || b.created_at) - new Date(a.createdAt || a.created_at)
        );

        setStats({
          balance: balance,
          totalOrders: activeOrders.length, // นับเฉพาะที่ค้างอยู่
          recentActivity: sortedOrders.slice(0, 5) 
        });

      } catch (err) {
        console.error("Dashboard Fetch Error:", err);
        setError("ไม่สามารถโหลดข้อมูล Dashboard ได้");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (loading) return <Loading />;

  if (error) {
    return (
      <div className="p-6 text-center text-red-500 bg-red-50 rounded-lg mt-6">
        <p className="font-bold">{error}</p>
      </div>
    );
  }

  if (!stats) return null;

  const statCards = [
    { 
      label: 'ยอดเงินคงเหลือ', 
      value: formatCurrency(stats.balance), 
      color: 'text-blue-600',
      subLabel: 'Wallet Balance' 
    },
    { 
      // เปลี่ยน Label ให้ชัดเจน
      label: 'ออเดอร์ที่กำลังดำเนินการ', 
      value: stats.totalOrders, 
      color: 'text-purple-600',
      subLabel: 'Active Orders' 
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Reseller Dashboard</h2>
          {shop && (
            <p className="text-gray-500 text-sm">ร้าน: {shop.shopName} (@{shop.shopSlug})</p>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {statCards.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100 flex flex-col justify-center hover:shadow-md transition-shadow h-40">
            <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">{stat.label}</p>
            <h3 className={`text-4xl font-black ${stat.color}`}>{stat.value}</h3>
            <p className="text-xs text-gray-400 mt-1">{stat.subLabel}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 mt-8">
        <h3 className="text-lg font-bold text-gray-800 mb-4">ออเดอร์ล่าสุดที่ต้องจัดการ (Active Orders)</h3>
        <div className="space-y-4">
          {stats.recentActivity.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-2">ไม่มีออเดอร์ที่ค้างอยู่</p>
              <p className="text-xs text-gray-400">ออเดอร์ที่สำเร็จหรือยกเลิกแล้วจะไม่แสดงที่นี่</p>
            </div>
          ) : (
            stats.recentActivity.map((activity, index) => (
              <div key={activity.id || index} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0 mt-1">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                  </div>
                  <div className="overflow-hidden">
                    <div className="font-bold text-gray-900">
                      ออเดอร์ {activity.orderNumber || activity.order_number || `#${index+1}`}
                    </div>
                    {/* ข้อมูลลูกค้า เบอร์โทร */}
                    <div className="text-sm text-gray-600 mt-0.5">
                      👤 {activity.customerName || activity.customer_name || 'ลูกค้าทั่วไป'} 
                      <span className="text-gray-500 ml-1">({activity.phone || 'ไม่มีเบอร์โทร'})</span>
                    </div>
                    {/* ข้อมูลที่อยู่ */}
                    <div className="text-xs text-gray-500 mt-1 max-w-md truncate" title={activity.address}>
                      📍 {activity.address || 'ไม่มีข้อมูลที่อยู่'}
                    </div>
                    {/* วันที่ */}
                    <div className="text-xs text-gray-400 mt-1">
                      📅 {activity.createdAt || activity.created_at ? new Date(activity.createdAt || activity.created_at).toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'N/A'}
                    </div>
                  </div>
                </div>
                <div className="text-right shrink-0 ml-4">
                  <div className="font-bold text-green-600 text-lg">
                    +{formatCurrency(activity.resellerProfit || activity.reseller_profit || 0)}
                  </div>
                  <div className="text-xs font-semibold text-gray-500 mt-1 bg-gray-200 px-2 py-1 rounded-full inline-block">
                    {activity.status || 'PAID'}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ResellerDashboard;