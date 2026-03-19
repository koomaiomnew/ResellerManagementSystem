// import api from './api';

// export const shopService = {

//   getMyShop: async (userId) => {
//     try {
//       console.log("🔥 send userId:", userId);

//       if (!userId) throw new Error("userId is required");

//       const response = await api.get(`/shops/me/${userId}`);
//       return response.data;

//     } catch (error) {
//       console.error("❌ getMyShop error:", error);
//       throw new Error(error.response?.data || 'ไม่พบร้านค้า');
//     }
//   },

//   getShopProductsBySlug: async (shopSlug) => {
//     try {
//       const response = await api.get(`/shops/${shopSlug}`);
//       return response.data;
//     } catch (error) {
//       throw new Error(error.response?.data || 'ไม่พบข้อมูลร้านค้า');
//     }
//   },

//   addProductToShop: async (shopId, productData) => {
//     try {
//       const response = await api.post(`/shops/${shopId}/products`, productData);
//       return response.data;
//     } catch (error) {
//       throw new Error(error.response?.data || 'เพิ่มสินค้าไม่สำเร็จ');
//     }
//   },

//   deleteProductFromShop: async (id) => {
//     try {
//       const response = await api.delete(`/shops/${id}`);
//       return response.data;
//     } catch (error) {
//       throw new Error(error.response?.data || 'ลบสินค้าไม่สำเร็จ');
//     }
//   }
// };
import api from './api';

export const shopService = {

  getMyShop: async (userId) => {
    try {
      if (!userId) throw new Error("userId is required");
      const response = await api.get(`/shops/me/${userId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data || 'ไม่พบร้านค้า');
    }
  },

  getShopProductsBySlug: async (shopSlug) => {
    try {
      const response = await api.get(`/shops/slug/${shopSlug}`); // 🔥 เพิ่ม /slug/ ตาม controller ของคุณ
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data || 'ไม่พบข้อมูลร้านค้า');
    }
  },

  addProductToShop: async (shopId, productData) => {
    try {
      const response = await api.post(`/shops/${shopId}/products`, productData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data || 'เพิ่มสินค้าไม่สำเร็จ');
    }
  },

  // 🔥 อัปเดต Path ให้ตรงกับ Backend
  deleteProductFromShop: async (shopId, productId) => {
    try {
      const response = await api.delete(`/shops/${shopId}/products/${productId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data || 'ลบสินค้าไม่สำเร็จ');
    }
  }
};