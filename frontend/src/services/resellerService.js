import api from './api';

export const resellerService = {
  // 1. ดึงรายชื่อตัวแทนจำหน่ายทั้งหมด
  getAllResellers: async () => {
    try {
      // 🌟 ดึง User ทั้งหมดจาก Backend (เพราะ Java มีแค่ GET /api/users)
      const response = await api.get('/users'); 
      // 🌟 กรองเอาเฉพาะคนที่มี role เป็น RESELLER มาแสดง
      const resellers = response.data.filter(user => user.role === 'RESELLER');
      return resellers;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'ดึงข้อมูลตัวแทนจำหน่ายไม่สำเร็จ');
    }
  },

  // 2. อนุมัติ (Approve) ตัวแทนจำหน่าย
  approveReseller: async (id) => {
    try {
      // 🌟 ใช้ api.patch เพราะ Backend คุณใช้ @PatchMapping
      const response = await api.patch(`/users/${id}/status`, { status: 'APPROVED' });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'อนุมัติบัญชีไม่สำเร็จ');
    }
  },

  // 3. ปฏิเสธ (Reject) ตัวแทนจำหน่าย
  rejectReseller: async (id) => {
    try {
      // 🌟 ใช้ api.patch เช่นกัน
      const response = await api.patch(`/users/${id}/status`, { status: 'REJECTED' });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'ปฏิเสธบัญชีไม่สำเร็จ');
    }
  },

  // 4. ดึงข้อมูลหน้าร้านค้าตามชื่อร้าน (Shop Slug)
  getShopDetails: async (shopSlug) => {
    try {
      // 🌟 ตรงกับ @GetMapping("/{shopSlug}") ของ ShopController
      const response = await api.get(`/shops/${shopSlug}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'ไม่พบข้อมูลร้านค้านี้');
    }
  }
};