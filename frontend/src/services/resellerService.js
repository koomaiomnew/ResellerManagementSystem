import api from './api';

export const resellerService = {

  getAllResellers: async () => {
    try {
      const response = await api.get('/admin/resellers');
      // ตรวจสอบว่า response.data เป็น array ก่อน
      const data = Array.isArray(response.data) ? response.data : [];
      
      return data
        .filter(user => user.role === 'reseller' || user.role === 'RESELLER') // เผื่อ Backend ส่งมาเป็นตัวใหญ่
        .sort((a, b) => b.userId - a.userId); 
    } catch (error) {
      console.error("Error fetching resellers:", error);
      throw error;
    }
  },

  // อนุมัติ (Approve)
  approveReseller: async (id) => {
    try {
  
      const response = await api.patch(`/admin/resellers/${id}/status`, { status: 'approved' });
      return response.data;
    
    } catch (error) {
      console.error("Approve error:", error);
      throw new Error(error.response?.data?.message || 'อนุมัติบัญชีไม่สำเร็จ');
    }
  },

  // ปฏิเสธ (Reject)
  rejectReseller: async (id) => {
    try {
      // ส่งสถานะไปอัปเดตผ่าน PATCH (เปลี่ยน path ให้ตรงกับ Backend ของคุณ)
      const response = await api.patch(`/admin/resellers/${id}/status`, { status: 'rejected' });
      return response.data;


    } catch (error) {
      console.error("Reject error:", error);
      throw new Error(error.response?.data?.message || 'ปฏิเสธบัญชีไม่สำเร็จ');
    }
  }

};