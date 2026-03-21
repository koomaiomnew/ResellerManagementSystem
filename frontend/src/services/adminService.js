import api from './api';

export const adminService = {
  // ดึงข้อมูล Dashboard
  getDashboardStats: async () => {
    const response = await api.get('/admin/dashboard');
    return response.data;
  },

  // Export CSV (ใช้ Axios แทน fetch เพื่อให้แนบ Token อัตโนมัติ)
  exportOrdersCSV: async (year, month) => {
    const response = await api.get('/admin/export-orders', {
      params: { year, month },
      responseType: 'blob' // บอก Axios ว่าเราจะเอาไฟล์นะ
    });
    return response.data; // จะได้ blob มาใช้งานต่อได้เลย
  }
};