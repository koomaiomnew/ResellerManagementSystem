import api from './api';

export const resellerService = {

  getAllResellers: async () => {
    const response = await api.get('/users');
    return response.data
      .filter(user => user.role === 'reseller')
      .sort((a, b) => b.id - a.id); // 🌟 เพิ่มบรรทัดนี้เพื่อเรียง id จากมากไปน้อย
  },

  approveReseller: async (id) => {
    try {
      // 1. ดึง user เดิมมาก่อน
      const userRes = await api.get(`/users/${id}`);
      const user = userRes.data;

      // 2. แก้ status
      const updatedUser = {
        ...user,
        status: 'approved'
      };

      // 3. ส่ง PUT
      const response = await api.put(`/users/${id}`, updatedUser);
      return response.data;

    } catch (error) {
      throw new Error(error.response?.data?.message || 'อนุมัติบัญชีไม่สำเร็จ');
    }
  },

  rejectReseller: async (id) => {
    try {
      const userRes = await api.get(`/users/${id}`);
      const user = userRes.data;

      const updatedUser = {
        ...user,
        status: 'rejected'
      };

      const response = await api.put(`/users/${id}`, updatedUser);
      return response.data;

    } catch (error) {
      throw new Error(error.response?.data?.message || 'ปฏิเสธบัญชีไม่สำเร็จ');
    }
  }

};