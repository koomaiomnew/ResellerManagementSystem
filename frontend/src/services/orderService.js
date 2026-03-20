import api from './api'; // 🌟 อย่าลืม import api ด้วยนะครับ

export const orderService = {
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