import api from "./api";

export const walletService = {
  getWalletBalance: async (userId) => {
    try {
      const response = await api.get(`/wallet/${userId}/balance`);
      return response.data.balance;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'ไม่สามารถดึงยอดเงินได้');
    }
  },

  getWalletLog: async (userId) => {
    try {
      const response = await api.get(`/wallet/${userId}/logs`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'ไม่สามารถดึงประวัติการเงินได้');
    }
  }
};
