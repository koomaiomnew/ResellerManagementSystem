import { getDB, setDB } from '../utils/mockData';
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

};