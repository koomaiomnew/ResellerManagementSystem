import api from './api';

export const shopService = {
  // 1. สร้างร้านค้าใหม่ (เมื่อ Reseller ได้รับการอนุมัติ หรือ ล็อกอินครั้งแรก)
  createShop: async (shopData) => {
    try {
      // shopData ควรมี { userId, shopName, shopSlug }
      const response = await api.post('/shops', shopData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'สร้างร้านค้าไม่สำเร็จ');
    }
  },

  // 2. ดึงข้อมูลสินค้าในร้าน (สำหรับโชว์หน้าร้านลูกค้า)
  getShopProductsBySlug: async (shopSlug) => {
    try {
      const response = await api.get(`/shops/${shopSlug}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'ไม่พบข้อมูลร้านค้านี้');
    }
  },

  // 3. เพิ่มสินค้าเข้าสู่ร้านค้าของ Reseller
  addProductToShop: async (shopId, productData) => {
    try {
      // productData ควรมี { productId, sellingPrice } ตามที่ Java (ShopProductReq) รอรับ
      const response = await api.post(`/shops/${shopId}/products`, productData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'เพิ่มสินค้าเข้าร้านไม่สำเร็จ');
    }
  }
};