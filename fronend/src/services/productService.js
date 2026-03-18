import { getDB, setDB } from '../utils/mockData';

export const productService = {
  getAllProducts: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(getDB('mock_products'));
      }, 300);
    });
  },

  createProduct: async (productData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const products = getDB('mock_products');
        const newProduct = {
          id: Date.now(),
          ...productData,
          costPrice: Number(productData.costPrice),
          minPrice: Number(productData.minPrice),
          stock: Number(productData.stock)
        };
        products.push(newProduct);
        setDB('mock_products', products);
        resolve(newProduct);
      }, 300);
    });
  },

  updateProduct: async (id, data) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let products = getDB('mock_products');
        const index = products.findIndex(p => p.id === id);
        if (index > -1) {
          products[index] = { ...products[index], ...data };
          setDB('mock_products', products);
          resolve(products[index]);
        }
      }, 300);
    });
  },

  deleteProduct: async (id) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let products = getDB('mock_products');
        products = products.filter(p => p.id !== id);
        setDB('mock_products', products);
        resolve(true);
      }, 300);
    });
  }
};
