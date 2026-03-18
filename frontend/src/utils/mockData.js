// Initial Seed Data
const defaultUsers = [
  { id: 1, role: 'ADMIN', email: 'admin@admin.com', password: 'password', fullname: 'Super Admin' },
  { id: 2, role: 'RESELLER', email: 'reseller@test.com', password: 'password', fullname: 'John Reseller', shopName: 'johnshop', phone: '1234567890', status: 'APPROVED', wallet: 0, shopProducts: [{ productId: 1, sellingPrice: 250 }, { productId: 2, sellingPrice: 950 }] }
];

const defaultProducts = [
  { id: 1, name: 'Wireless Mouse', minPrice: 200, costPrice: 150, stock: 50, image: 'https://images.unsplash.com/photo-1527814050087-379381547969?auto=format&fit=crop&q=80&w=300' },
  { id: 2, name: 'Mechanical Keyboard', minPrice: 800, costPrice: 600, stock: 30, image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&q=80&w=300' },
];

const defaultOrders = [];

export const initMockDB = () => {
  if (!localStorage.getItem('mock_users')) {
    localStorage.setItem('mock_users', JSON.stringify(defaultUsers));
  }
  if (!localStorage.getItem('mock_products')) {
    localStorage.setItem('mock_products', JSON.stringify(defaultProducts));
  }
  if (!localStorage.getItem('mock_orders')) {
    localStorage.setItem('mock_orders', JSON.stringify(defaultOrders));
  }
};

export const getDB = (key) => JSON.parse(localStorage.getItem(key) || '[]');
export const setDB = (key, data) => localStorage.setItem(key, JSON.stringify(data));
