// import React, { useState, useEffect } from 'react';
// import { shopService } from '../../services/shopService';
// import { useAuth } from '../../context/AuthContext';
// import ProductTable from '../../components/ProductTable';
// import Loading from '../../components/Loading';
// import { showToast } from '../../components/Toast';

// const ResellerMyProducts = () => {
//   const { user } = useAuth();
//   const [shopProducts, setShopProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [shopId, setShopId] = useState(null);
  
//   // 🌟 ย้าย State สองตัวนี้เข้ามาไว้ใน Component
//   const [editingProduct, setEditingProduct] = useState(null); 
//   const [editPrice, setEditPrice] = useState("");

//   // ดึงข้อมูลจริงจาก DB
//   const fetchMyProducts = async () => {
//     try {
//       setLoading(true);
      
//       // 1. ดึงร้านของ User นี้ก่อนเพื่อเอา shopId และ shopSlug
//       const myShop = await shopService.getMyShop(user.id);
      
//       if (!myShop || !myShop.shopSlug) {
//         throw new Error("ไม่พบข้อมูลร้านค้าของคุณ");
//       }
      
//       setShopId(myShop.id); 

//       // 2. ดึงข้อมูลผ่าน shopSlug
//       const products = await shopService.getShopProductsBySlug(myShop.shopSlug);
      
//       // 3. แปลงข้อมูลให้เข้ากับ Props ของ ProductTable
//       const formatted = products.map(p => ({
//         id: p.productId,
//         name: p.name,
//         imageUrl: p.imageUrl,
//         sellingPrice: p.sellingPrice,
//         minPrice: 0 
//       }));
      
//       setShopProducts(formatted);
//     } catch (err) {
//       console.error("Fetch My Products Error:", err);
//       showToast(err.message || 'โหลดข้อมูลสินค้าไม่สำเร็จ', 'error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (user?.id) fetchMyProducts();
//   }, [user]);

//   // ฟังก์ชันลบสินค้า
//   const handleDelete = async (productId) => {
//     if (window.confirm('คุณต้องการนำสินค้านี้ออกจากร้านใช่หรือไม่?')) {
//       try {
//         if (!shopId) throw new Error('ไม่พบรหัสร้านค้า');
        
//         await shopService.deleteProductFromShop(shopId, productId);
        
//         setShopProducts(prev => prev.filter(p => p.id !== productId));
//         showToast('นำสินค้าออกจากร้านสำเร็จ');
//       } catch (err) {
//         showToast(err.message || 'เกิดข้อผิดพลาดในการนำสินค้าออก', 'error');
//       }
//     }
//   };

//   const handleEditClick = (product) => {
//     setEditingProduct(product);
//     setEditPrice(product.sellingPrice || 0);
//   };

//   // ฟังก์ชันบันทึกเมื่อกดตกลงใน Popup
//   const handleSavePrice = async () => {
//     if (!editPrice || isNaN(editPrice) || Number(editPrice) <= 0) {
//       showToast('กรุณากรอกราคาให้ถูกต้อง (มากกว่า 0)', 'error');
//       return;
//     }

//     try {
//       if (!shopId) throw new Error('ไม่พบรหัสร้านค้า');

//       const productData = { sellingPrice: Number(editPrice) };
      
//       // ยิง API อัปเดตราคา
//       await shopService.updateProductInShop(shopId, editingProduct.id, productData);

//       // อัปเดตหน้าจอทันทีโดยไม่ต้องรีเฟรช
//       setShopProducts(prev => 
//         prev.map(p => p.id === editingProduct.id ? { ...p, sellingPrice: Number(editPrice) } : p)
//       );
      
//       showToast('อัปเดตราคาสำเร็จ');
//       setEditingProduct(null); // ปิด Popup
//     } catch (err) {
//       showToast(err.message || 'เกิดข้อผิดพลาดในการอัปเดตสินค้า', 'error');
//     }
//   };

//   if (loading) return <Loading />;

//   return (
//     <div className="space-y-6 relative">
//       <div className="flex justify-between items-center">
//         <h2 className="text-2xl font-bold text-gray-800">สินค้าในร้านของฉัน</h2>
//         <a href="/reseller/catalog" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow transition font-medium">
//           ไปที่คลังสินค้า
//         </a>
//       </div>

//       <ProductTable 
//         products={shopProducts} 
//         role="reseller" 
//         onEdit={handleEditClick} 
//         onDelete={handleDelete} 
//       />

//       {/* 🌟 Modal / Popup สำหรับอัปเดตราคา */}
//       {editingProduct && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-xl shadow-lg p-6 w-96 max-w-[90%]">
//             <h3 className="text-xl font-bold text-gray-800 mb-4">
//               อัปเดตราคาขาย
//             </h3>
            
//             <div className="mb-4">
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 ชื่อสินค้า
//               </label>
//               <p className="text-gray-600 bg-gray-50 p-2 rounded border border-gray-200">
//                 {editingProduct.name}
//               </p>
//             </div>

//             <div className="mb-6">
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 ราคาขายใหม่ (บาท)
//               </label>
//               <input 
//                 type="number" 
//                 value={editPrice}
//                 onChange={(e) => setEditPrice(e.target.value)}
//                 className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
//                 placeholder="กรอกราคาใหม่..."
//               />
//             </div>

//             <div className="flex justify-end gap-3">
//               <button 
//                 onClick={() => setEditingProduct(null)}
//                 className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
//               >
//                 ยกเลิก
//               </button>
//               <button 
//                 onClick={handleSavePrice}
//                 className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
//               >
//                 บันทึกราคา
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ResellerMyProducts;
import React, { useState, useEffect } from 'react';
import { shopService } from '../../services/shopService';
// 🌟 1. อย่าลืม Import Service ที่มีฟังก์ชัน deleteProduct เข้ามา
import { productService } from '../../services/productService'; 
import { useAuth } from '../../context/AuthContext';
import ProductTable from '../../components/ProductTable';
import Loading from '../../components/Loading';
import { showToast } from '../../components/Toast';

const ResellerMyProducts = () => {
  const { user } = useAuth();
  const [shopProducts, setShopProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [shopId, setShopId] = useState(null);
  
  const [editingProduct, setEditingProduct] = useState(null); 
  const [editPrice, setEditPrice] = useState("");

  const fetchMyProducts = async () => {
    try {
      setLoading(true);
      const myShop = await shopService.getMyShop(user.id);
      
      if (!myShop || !myShop.shopSlug) {
        throw new Error("ไม่พบข้อมูลร้านค้าของคุณ");
      }
      
      setShopId(myShop.id); 

      const products = await shopService.getShopProductsBySlug(myShop.shopSlug);
      
      const formatted = products.map(p => ({
        id: p.productId,
        name: p.name,
        imageUrl: p.imageUrl,
        sellingPrice: p.sellingPrice,
        minPrice: 0 
      }));
      
      setShopProducts(formatted);
    } catch (err) {
      console.error("Fetch My Products Error:", err);
      showToast(err.message || 'โหลดข้อมูลสินค้าไม่สำเร็จ', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) fetchMyProducts();
  }, [user]);

  // 🌟 2. แก้ไขฟังก์ชันลบสินค้า ให้เรียกใช้ API ลบสินค้าหลัก
  const handleDelete = async (productId) => {
    if (window.confirm('คุณต้องการนำสินค้านี้ออกจากร้านใช่หรือไม่?')) {
      try {
        if (!shopId) throw new Error('ไม่พบรหัสร้านค้า');
        
        // ใช้ shopService ตัวนี้ถูกต้องแล้วครับ!
        await shopService.deleteProductFromShop(shopId, productId);
        
        setShopProducts(prev => prev.filter(p => p.id !== productId));
        showToast('นำสินค้าออกจากร้านสำเร็จ');
      } catch (err) {
        showToast(err.message || 'เกิดข้อผิดพลาดในการนำสินค้าออก', 'error');
      }
    }
  };

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setEditPrice(product.sellingPrice || 0);
  };

  const handleSavePrice = async () => {
    if (!editPrice || isNaN(editPrice) || Number(editPrice) <= 0) {
      showToast('กรุณากรอกราคาให้ถูกต้อง (มากกว่า 0)', 'error');
      return;
    }

    try {
      if (!shopId) throw new Error('ไม่พบรหัสร้านค้า');

      const productData = { sellingPrice: Number(editPrice) };
      
      await shopService.updateProductInShop(shopId, editingProduct.id, productData);

      setShopProducts(prev => 
        prev.map(p => p.id === editingProduct.id ? { ...p, sellingPrice: Number(editPrice) } : p)
      );
      
      showToast('อัปเดตราคาสำเร็จ');
      setEditingProduct(null); 
    } catch (err) {
      showToast(err.message || 'เกิดข้อผิดพลาดในการอัปเดตสินค้า', 'error');
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="space-y-6 relative">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">สินค้าในร้านของฉัน</h2>
        <a href="/reseller/catalog" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow transition font-medium">
          ไปที่คลังสินค้า
        </a>
      </div>

      {/* ProductTable จะรับฟังก์ชัน handleDelete ไปแสดงเป็นปุ่มลบให้อัตโนมัติ (ถ้าข้างใน Component เขียนปุ่มไว้แล้ว) */}
      <ProductTable 
        products={shopProducts} 
        role="reseller" 
        onEdit={handleEditClick} 
        onDelete={handleDelete} 
      />

      {editingProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-96 max-w-[90%]">
            <h3 className="text-xl font-bold text-gray-800 mb-4">อัปเดตราคาขาย</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อสินค้า</label>
              <p className="text-gray-600 bg-gray-50 p-2 rounded border border-gray-200">{editingProduct.name}</p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">ราคาขายใหม่ (บาท)</label>
              <input 
                type="number" 
                value={editPrice}
                onChange={(e) => setEditPrice(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="กรอกราคาใหม่..."
              />
            </div>

            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setEditingProduct(null)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
              >ยกเลิก</button>
              <button 
                onClick={handleSavePrice}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
              >บันทึกราคา</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResellerMyProducts;