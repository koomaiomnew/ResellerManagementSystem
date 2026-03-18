import { getDB, setDB } from '../utils/mockData';

export const resellerService = {
  getAllResellers: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const users = getDB('mock_users');
        resolve(users.filter(u => u.role === 'RESELLER'));
      }, 300);
    });
  },

  approveReseller: async (id) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let users = getDB('mock_users');
        const index = users.findIndex(u => u.id === id);
        if (index > -1) {
          users[index].status = 'APPROVED';
          setDB('mock_users', users);
          resolve(users[index]);
        }
      }, 300);
    });
  },

  rejectReseller: async (id) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let users = getDB('mock_users');
        const index = users.findIndex(u => u.id === id);
        if (index > -1) {
          users[index].status = 'REJECTED';
          setDB('mock_users', users);
          resolve(users[index]);
        }
      }, 300);
    });
  },

  getShopDetails: async (shopName) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = getDB('mock_users');
        const shop = users.find(u => u.shopName === shopName && u.role === 'RESELLER' && u.status === 'APPROVED');
        if (shop) {
          resolve(shop);
        } else {
          reject(new Error('Shop not found'));
        }
      }, 300);
    });
  }
};
