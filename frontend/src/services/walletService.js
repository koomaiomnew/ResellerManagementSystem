import { getDB, setDB } from '../utils/mockData';

export const walletService = {
  getWalletDetails: async (resellerId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const users = getDB('mock_users');
        const reseller = users.find(u => u.id === resellerId);
        
        const orders = getDB('mock_orders').filter(o => o.resellerId === resellerId);
        
        resolve({
          balance: reseller?.wallet || 0,
          transactions: orders.map(o => ({
            id: o.id,
            orderNumber: o.orderNumber,
            profit: o.profit,
            date: o.createdAt
          }))
        });
      }, 300);
    });
  }
};
