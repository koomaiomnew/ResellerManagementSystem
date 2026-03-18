import { getDB, setDB } from '../utils/mockData';

export const orderService = {
  getAllOrders: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(getDB('mock_orders'));
      }, 300);
    });
  },

  getResellerOrders: async (resellerId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const orders = getDB('mock_orders');
        resolve(orders.filter(o => o.resellerId === resellerId));
      }, 300);
    });
  },

  createOrder: async (orderData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const orders = getDB('mock_orders');
        const newOrder = {
          id: Date.now(),
          orderNumber: 'ORD-' + Math.floor(Math.random() * 1000000),
          status: 'PAID',
          createdAt: new Date().toISOString(),
          ...orderData
        };
        
        // reduce stock
        let products = getDB('mock_products');
        const pIndex = products.findIndex(p => p.id === orderData.productId);
        if (pIndex > -1) {
          products[pIndex].stock -= orderData.quantity;
          setDB('mock_products', products);
        }

        // Add profit to wallet locally
        let users = getDB('mock_users');
        const uIndex = users.findIndex(u => u.id === orderData.resellerId);
        if (uIndex > -1) {
          users[uIndex].wallet += orderData.profit;
          setDB('mock_users', users);
        }

        orders.push(newOrder);
        setDB('mock_orders', orders);
        resolve(newOrder);
      }, 500);
    });
  },

  updateOrderStatus: async (id, status) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let orders = getDB('mock_orders');
        const index = orders.findIndex(o => o.id === id);
        if (index > -1) {
          orders[index].status = status;
          setDB('mock_orders', orders);
          resolve(orders[index]);
        }
      }, 300);
    });
  },

  trackOrder: async (orderNumber) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const orders = getDB('mock_orders');
        const order = orders.find(o => o.orderNumber === orderNumber);
        if (order) {
          resolve(order);
        } else {
          reject(new Error('Order not found'));
        }
      }, 300);
    });
  }
};
