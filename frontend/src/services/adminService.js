import api from './api'; // หรือ path ที่คุณ config axios ไว้

export const adminService = {
  getDashboardStats: async () => {
    const response = await api.get('/admin/dashboard');
    return response.data;
  }
};