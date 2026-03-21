
import api from './api'; // 🌟 อย่าลืม import api ด้วยนะครับ

export const orderService = {
 createOrder: async (orderData) => {
    try {
      console.log("🚀 Sending Order Data:", orderData);
      
      // ยิงไปที่ Endpoint: /orders/checkout ตามภาพ Postman
      const response = await api.post('/orders/checkout', orderData);
      
      return response.data;
    } catch (error) {
      console.error("❌ Order Service Error:", error.response?.data || error.message);
      throw error;
    }
  },
  OrderTracking: async (trackingNumber) => {
    try {
      const response = await api.get(`/orders/track/${trackingNumber}`);
      return response.data;
    } catch (error) {
      console.error("❌ Tracking Error:", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'ไม่พบข้อมูลการติดตาม');
    }
  },
  getOrdersByShop: async (shopId) => {
    try {
      // ยิงไปที่ Controller: @GetMapping("/orders?shopId=...")
      const response = await api.get(`/orders?shopId=${shopId}`);
      return response.data;
    } catch (error) {
      console.error("Fetch Orders Error:", error);
      throw new Error(error.response?.data?.message || 'ไม่สามารถดึงข้อมูลออเดอร์ได้');
    }
  },
  getActiveOrders: async () => {
    // เรียก API เส้นใหม่ที่เราเพิ่งสร้าง
    const response = await api.get('/orders/active');
    return response.data;
  }
  ,
  updateStatus: async (orderId, newStatus) => {
    try {
      const response = await api.patch(`/admin/orders/${orderId}/status`, {
        status: newStatus
      });
      return response.data;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  },
  getOrdersByUser: async (userId) => {
    const response = await api.get(`/orders/user/${userId}`);
    return response.data;
  },
  getActiveOrdersByUser: async (userId) => {
    const response = await api.get(`/orders/user/${userId}/active`);
    return response.data;
  }
};