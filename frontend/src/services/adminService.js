import api from './api'; // หรือ path ที่คุณ config axios ไว้

export const adminService = {
  getDashboardStats: async () => {
    const response = await api.get('/admin/dashboard');
    return response.data;
  },
  exportOrdersCSV: async (year, month) => {
    // ใส่ URL เต็มๆ ลงไปเลย
    const url = `https://bootcamp04.duckdns.org/api/admin/export-orders?year=${year}&month=${month}`;
    const response = await fetch(url, { method: 'GET' });
    if (!response.ok) throw new Error('Export failed');
    return await response.blob();
  }
};