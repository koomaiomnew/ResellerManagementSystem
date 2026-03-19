import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { walletService } from '../../services/walletService';
import { orderService } from '../../services/orderService'; // ดึงจาก Mock ไปก่อน
import { shopService } from '../../services/shopService'; // 🌟 นำเข้า shopService
import { formatCurrency } from '../../utils/formatter';
import Loading from '../../components/Loading';

const ResellerDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [shop, setShop] = useState(null); // เก็บข้อมูลร้าน
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return;

      try {
        // 🌟 ดึงข้อมูลพร้อมกัน 3 อย่าง: ร้านค้า (จริง), กระเป๋าเงิน (จริง), ออเดอร์ (Mock)
        const [shopData, balance, orders] = await Promise.all([
          shopService.getMyShop(user.id).catch(() => null), // ถ้ายังไม่มีร้านให้ข้ามไปก่อน
          walletService.getWalletBalance(user.id).catch(() => 0), // ถ้าดึงเงินพัง ให้เป็น 0
          orderService.getResellerOrders(user.id) // Mock ข้อมูลไปก่อน
        ]);

        setShop(shopData);

        const validOrders = Array.isArray(orders) 
          ? orders.filter(o => o.status !== 'CANCELLED') 
          : [];

        // สมมติกำไรให้ก่อน (เพราะ mock order อาจจะไม่มีฟิลด์ profit)
        const totalProfit = validOrders.reduce((sum, o) => sum + (o.profit || 100), 0); 

        setStats({
          balance: balance, // 🌟 ใช้ balance จาก Backend จริง
          totalProfit: totalProfit,
          totalOrders: validOrders.length,
          recentOrders: validOrders.slice(0, 5)
        });
      } catch (err) {
        console.error("Dashboard Fetch Error:", err);
        setError("ไม่สามารถโหลดข้อมูล Dashboard ได้ในขณะนี้");
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
    { label: 'Wallet Balance', value: formatCurrency(stats.balance), color: 'bg-green-500' },
    { label: 'Total Profit', value: formatCurrency(stats.totalProfit), color: 'bg-blue-500' },
    { label: 'Total Orders', value: stats.totalOrders, color: 'bg-purple-500' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Reseller Dashboard</h2>
          {/* 🌟 แสดงชื่อร้านถ้าดึงมาจาก Backend ได้ */}
          {shop ? (
            <p className="text-gray-500">ร้าน: {shop.shopName} (@{shop.shopSlug})</p>
          ) : (
            <p className="text-red-400 text-sm">ยังไม่มีข้อมูลร้านค้า</p>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">{stat.label}</p>
              <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 mt-8">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Orders Activity (Mock Data)</h3>
        <div className="space-y-4">
          {stats.recentOrders.length === 0 ? (
            <p className="text-gray-500">No recent orders.</p>
          ) : (
            stats.recentOrders.map((order, index) => (
              <div key={order.id || index} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-bold text-gray-900">{order.orderNumber || `ORD-00${index+1}`}</div>
                  <div className="text-sm text-gray-500">
                    {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-green-600">+{formatCurrency(order.profit || 100)}</div>
                  <div className="text-sm text-gray-500">{order.status || 'PAID'}</div>
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