import React, { useState, useEffect } from 'react';
import { orderService } from '../../services/orderService';
import OrderTable from '../../components/OrderTable';
import Loading from '../../components/Loading';
import { showToast } from '../../components/Toast';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await orderService.getAllOrders();
      // Sort by newest first
      data.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
      setOrders(data);
    } catch (err) {
      showToast('Failed to load orders', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await orderService.updateOrderStatus(id, newStatus);
      showToast(`Order status updated to ${newStatus}`);
      fetchOrders();
    } catch (err) {
      showToast('Failed to update status', 'error');
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Manage Orders</h2>
      <OrderTable 
        orders={orders} 
        role="ADMIN" 
        onUpdateStatus={handleStatusUpdate} 
      />
    </div>
  );
};

export default AdminOrders;
