// import api from './api';

// export const shopService = {
//   // 1. สร้างร้านค้าใหม่
//   createShop: async (shopData) => {
//     try {
//       const response = await api.post('/shops', shopData);
//       return response.data;
//     } catch (error) {
//       console.error('CREATE SHOP ERROR:', error.response?.data);
//       throw new Error(error.response?.data?.message || 'สร้างร้านค้าไม่สำเร็จ');
//     }
//   },

//   // 2. ดึงสินค้าในร้าน
//   getShopProductsBySlug: async (shopSlug) => {
//     try {
//       const response = await api.get(`/shops/${shopSlug}`);
//       return response.data;
//     } catch (error) {
//       console.error('GET SHOP PRODUCTS ERROR:', error.response?.data);
//       throw new Error(error.response?.data?.message || 'ไม่พบข้อมูลร้านค้านี้');
//     }
//   },

//   // 3. เพิ่มสินค้าเข้าร้าน
//   addProductToShop: async (shopId, productData) => {
//     try {
//       // 🔥 validate ก่อนยิง API
//       if (!shopId) {
//         throw new Error('shopId is required');
//       }

//       if (!productData?.productId) {
//         throw new Error('productId is required');
//       }

//       if (productData?.sellingPrice == null) {
//         throw new Error('sellingPrice is required');
//       }

//       // 🔥 บังคับ format ให้ตรง backend 100%
//       const payload = {
//         productId: Number(productData.productId),
//         sellingPrice: Number(productData.sellingPrice),
//       };

//       console.log('ADD PRODUCT PAYLOAD:', payload);

//       const response = await api.post(
//         `/shops/${shopId}/products`,
//         payload
//       );

//       return response.data;
//     } catch (error) {
//       console.error('ADD PRODUCT ERROR:', error.response?.data || error.message);
//       throw new Error(
//         error.response?.data?.message || error.message || 'เพิ่มสินค้าเข้าร้านไม่สำเร็จ'
//       );
//     }
//   }
// };
import api from './api';

export const shopService = {
  createShop: async (shopData) => {
    const res = await api.post('/shops', shopData);
    return res.data;
  },

  getShopProductsBySlug: async (slug) => {
    const res = await api.get(`/shops/${slug}`);
    return res.data;
  },

  addProductToShop: async (shopId, data) => {
    const payload = {
      productId: Number(data.productId),
      sellingPrice: Number(data.sellingPrice)
    };

    console.log('ADD PRODUCT PAYLOAD:', payload);

    const res = await api.post(`/shops/${shopId}/products`, payload);
    return res.data;
  }
};