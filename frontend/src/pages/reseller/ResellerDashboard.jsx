import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { walletService } from '../../services/walletService';
import { orderService } from '../../services/orderService';
import { formatCurrency } from '../../utils/formatter';
import Loading from '../../components/Loading';

const ResellerDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [wallet, orders] = await Promise.all([
          walletService.getWalletDetails(user.id),
          orderService.getResellerOrders(user.id)
        ]);

        const validOrders = orders.filter(o => o.status !== 'CANCELLED');

        setStats({
          balance: wallet.balance,
          totalProfit: validOrders.reduce((sum, o) => sum + o.profit, 0),
          totalOrders: validOrders.length,
          recentOrders: validOrders.slice(0, 5)
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchStats();
  }, [user]);

  if (loading) return <Loading />;

  const statCards = [
    { label: 'Wallet Balance', value: formatCurrency(stats.balance), color: 'bg-green-500' },
    { label: 'Total Profit', value: formatCurrency(stats.totalProfit), color: 'bg-blue-500' },
    { label: 'Total Orders', value: stats.totalOrders, color: 'bg-purple-500' },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Reseller Dashboard</h2>
      
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
        <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Orders Activity</h3>
        <div className="space-y-4">
          {stats.recentOrders.length === 0 ? (
            <p className="text-gray-500">No recent orders.</p>
          ) : (
            stats.recentOrders.map(order => (
              <div key={order.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-bold text-gray-900">{order.orderNumber}</div>
                  <div className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-green-600">+{formatCurrency(order.profit)}</div>
                  <div className="text-sm text-gray-500">{order.status}</div>
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
