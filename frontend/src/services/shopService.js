import api from './api';

export const shopService = {

  getMyShop: async (userId) => {
    try {
      if (!userId) throw new Error("userId is required");
      const response = await api.get(`/shops/me/${userId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.response?.data || 'ไม่พบร้านค้า');
    }
  },

  // 🔥 แก้ไข Path เอา /slug/ ออกให้ตรงกับ Backend
  getShopProductsBySlug: async (shopSlug) => {
    try {
      const response = await api.get(`/shops/slug/${shopSlug}`); 
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.response?.data || 'ไม่พบข้อมูลร้านค้า');
    }
  },

  addProductToShop: async (shopId, productData) => {
    try {
      const response = await api.post(`/shops/${shopId}/products`, productData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.response?.data || 'เพิ่มสินค้าไม่สำเร็จ');
    }
  },

  updateProductInShop: async (shopId, productId, productData) => {
    try {
      // 🌟 ประกอบร่าง JSON ให้เหมือนตอนที่คุณยิงใน Postman
      const payload = {
        shopId: shopId,
        productId: productId,
        sellingPrice: productData.sellingPrice // ดึงแค่ราคาขายส่งไป
      };

      // 🌟 ลบเครื่องหมาย } ที่เกินมาตรง /products ออก
      const response = await api.put(`/shops/${shopId}/products`, payload);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.response?.data || 'แก้ไขสินค้าไม่สำเร็จ');
    }
  },

  deleteProductFromShop: async (shopId, productId) => {
    try {
      const response = await api.delete(`/shops/${shopId}/products/${productId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.response?.data || 'ลบสินค้าไม่สำเร็จ');
    }
  }
};