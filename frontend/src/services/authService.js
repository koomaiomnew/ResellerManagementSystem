import { getDB, setDB } from '../utils/mockData';

export const authService = {
  login: async (email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = getDB('mock_users');
        const user = users.find(u => u.email === email && u.password === password);
        
        if (!user) {
          return reject(new Error('Invalid credentials'));
        }
        
        if (user.role === 'RESELLER' && user.status !== 'APPROVED') {
          return reject(new Error('Account pending approval or rejected'));
        }
        
        // Exclude password from the returned object
        const { password: _, ...userInfo } = user;
        resolve(userInfo);
      }, 500);
    });
  },

  registerReseller: async (data) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = getDB('mock_users');
        if (users.find(u => u.email === data.email)) {
          return reject(new Error('Email already exists'));
        }
        if (users.find(u => u.shopName === data.shopName)) {
          return reject(new Error('Shop name already taken'));
        }
        
        const newUser = {
          id: Date.now(),
          ...data,
          role: 'RESELLER',
          status: 'PENDING_APPROVAL',
          wallet: 0
        };
        
        users.push(newUser);
        setDB('mock_users', users);
        resolve({ message: 'Registration successful! Waiting for admin approval.' });
      }, 500);
    });
  }
};
