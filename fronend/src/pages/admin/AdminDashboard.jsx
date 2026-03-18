import React, { useState, useEffect } from "react";
import { orderService } from "../../services/orderService";
import { productService } from "../../services/productService";
import { resellerService } from "../../services/resellerService";
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
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const [orders, products, resellers] = await Promise.all([
        orderService.getAllOrders(),
        productService.getAllProducts(),
        resellerService.getAllResellers(),
      ]);

      const validOrders = orders.filter((o) => o.status !== "CANCELLED");

      const totalSales = validOrders.reduce(
        (sum, order) => sum + order.sellingPrice * order.quantity,
        0
      );

      const adminProfit = validOrders.reduce(
        (sum, order) => sum + order.costPrice * order.quantity * 0.2,
        0
      );

      setStats({
        sales: totalSales,
        profit: adminProfit,
        orders: orders.length,
        products: products.length,
        resellers: resellers.length,
      });

      // sort order ล่าสุด
      const sortedOrders = [...orders].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setRecentOrders(sortedOrders.slice(0, 5));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await orderService.updateStatus(orderId, newStatus);
      fetchStats();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <Loading />;

  const statCards = [
    {
      label: "Total Sales (Platform)",
      value: formatCurrency(stats?.sales || 0),
      icon: <Wallet size={20} />,
      color: "text-blue-600",
      iconBg: "bg-blue-200/50",
      cardBg: "bg-blue-50",
      border: "border-b-4 border-blue-400",
    },
    {
      label: "Platform Profit",
      value: formatCurrency(stats?.profit || 0),
      icon: <TrendingUp size={20} />,
      color: "text-emerald-600",
      iconBg: "bg-emerald-200/50",
      cardBg: "bg-emerald-50",
      border: "border-b-4 border-emerald-400",
    },
    {
      label: "Total Orders",
      value: stats?.orders || 0,
      icon: <ShoppingCart size={20} />,
      color: "text-purple-600",
      iconBg: "bg-purple-200/50",
      cardBg: "bg-purple-50",
      border: "border-b-4 border-purple-400",
    },
    {
      label: "Total Products",
      value: stats?.products || 0,
      icon: <Package size={20} />,
      color: "text-orange-600",
      iconBg: "bg-orange-200/50",
      cardBg: "bg-orange-50",
      border: "border-b-4 border-orange-400",
    },
    {
      label: "Total Resellers",
      value: stats?.resellers || 0,
      icon: <Users size={20} />,
      color: "text-indigo-600",
      iconBg: "bg-indigo-200/50",
      cardBg: "bg-indigo-50",
      border: "border-b-4 border-indigo-400",
    },
  ];

  return (
    <div className="min-h-screen bg-white p-6 space-y-8">
      {/* Dashboard Title */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800">
          Dashboard Overview
        </h2>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-5">
        {statCards.map((stat, idx) => (
          <div
            key={idx}
            className={`${stat.cardBg} ${stat.border} rounded-xl p-5 shadow-sm hover:shadow-md transition relative overflow-hidden`}
          >
            {/* background icon pattern */}
            <div className="absolute right-3 top-3 opacity-10 scale-[3]">
              {stat.icon}
            </div>

            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${stat.iconBg} ${stat.color}`}
            >
              {stat.icon}
            </div>

            <p className="text-sm font-medium text-gray-700 mb-1">
              {stat.label}
            </p>

            <h3 className="text-2xl font-bold text-gray-900">
              {stat.value}
            </h3>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          Recent Orders
        </h3>

        <OrderTable
          orders={recentOrders}
          role="ADMIN"
          onUpdateStatus={handleUpdateStatus}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;
