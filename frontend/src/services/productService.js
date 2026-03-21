import api from './api'; // 🌟 นำเข้า Axios instance ที่เราตั้งค่าไว้

export const productService = {
  // 1. ดึงสินค้าทั้งหมด (GET /api/products)
  getAllProducts: async () => {
    try {
      const response = await api.get('/products');
      console.log("🔥 getAllProducts response:", response.data);
      return response.data;
      
    } catch (error) {
      throw new Error(error.response?.data?.message || 'ดึงข้อมูลสินค้าไม่สำเร็จ');
    }
  },

  // 2. เพิ่มสินค้าใหม่ (POST /api/products)
  createProduct: async (productData) => {
    try {
      // แปลงพวกราคาและสต๊อกให้เป็นตัวเลข (Number) เพื่อความชัวร์ก่อนส่งไป Java
      const payload = {
        ...productData,
        costPrice: Number(productData.costPrice),
        minPrice: Number(productData.minPrice),
        stock: Number(productData.stock)
      };
      
      const response = await api.post('/products', payload);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'เพิ่มสินค้าไม่สำเร็จ');
    }
  },

  // 3. แก้ไขข้อมูลสินค้า (PUT /api/products/{id})
  updateProduct: async (id, data) => {
    try {
      const response = await api.put(`/products/${id}`, data);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'แก้ไขสินค้าไม่สำเร็จ');
    }
  },

  // 4. ลบสินค้า (DELETE /api/products/{id})
  deleteProduct: async (id) => {
    try {
      await api.delete(`/products/${id}`);
      return true;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'ลบสินค้าไม่สำเร็จ');
    }
  }
};