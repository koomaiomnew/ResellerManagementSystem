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
      try {
        const data = await orderService.getResellerOrders(user.id);
        data.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
        setOrders(data);
      } catch (err) {
        showToast('Failed to load orders', 'error');
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchOrders();
  }, [user]);

  if (loading) return <Loading />;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">My Orders</h2>
      <OrderTable 
        orders={orders} 
        role="RESELLER" 
      />
    </div>
  );
};

export default ResellerOrders;
