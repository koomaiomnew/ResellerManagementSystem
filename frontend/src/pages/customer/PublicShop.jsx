import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProductCard from '../../components/ProductCard';
import Loading from '../../components/Loading';
import { showToast } from '../../components/Toast';
import { formatCurrency } from '../../utils/formatter';

const PublicShop = () => {
  const { shopSlug } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // 🛒 1. State สำหรับตะกร้าสินค้า
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const fetchShopProducts = async () => {
      try {
        setLoading(true);
        // 🟢 เรียก API GET ดึงสินค้าจากร้าน
        const response = await fetch(`https://bootcamp04.duckdns.org/api/shops/${shopSlug}`);
        if (!response.ok) throw new Error('Network response was not ok');
        
        const productsData = await response.json();
        setProducts(productsData);
      } catch (err) {
        console.error("Fetch Error:", err);
        setError('ไม่พบร้านค้านี้ หรือร้านนี้ยังไม่มีสินค้า');
      } finally {
        setLoading(false);
      }
    };
    
    if (shopSlug) {
      fetchShopProducts();
    }
  }, [shopSlug]);

  // 🛒 2. ฟังก์ชันเพิ่มสินค้าลงตะกร้า
 const handleAddToCart = (product) => {
    // 1. เช็คจาก State 'cart' โดยตรงว่ามีสินค้านี้ในตะกร้าหรือยัง
    const existingItem = cart.find(item => item.shopProductId === product.shopProductID);

    if (existingItem) {
      // 2. ถ้ามีอยู่แล้ว สั่งแสดง Toast แบบเพิ่มจำนวน (เรียกนอก setCart)
      showToast(`เพิ่มจำนวน ${product.name} ในตะกร้าแล้ว`);
      
      // อัปเดต State แค่เพิ่มจำนวน
      setCart(prevCart => prevCart.map(item =>
        item.shopProductId === product.shopProductID
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      // 3. ถ้ายังไม่มี สั่งแสดง Toast แบบเพิ่มสินค้าใหม่ (เรียกนอก setCart)
      showToast(`เพิ่ม ${product.name} ลงตะกร้าแล้ว`, 'success');
      
      // อัปเดต State โดยเพิ่ม Object สินค้าใหม่ต่อท้าย
      setCart(prevCart => [
        ...prevCart, 
        {
          shopProductId: product.shopProductID,
          productId: product.productId,
          name: product.name,
          price: product.sellingPrice,
          image: product.imageUrl,
          quantity: 1
        }
      ]);
    }
  };

  // 🛒 3. ฟังก์ชันส่งไปหน้า Checkout
  const goToCheckout = () => {
    if (cart.length === 0) return;
    
    // ✅ API GET ไม่ได้ส่ง shopId กลับมาใน object สินค้า เลยเซ็ตเป็น 1 ตามรูปแบบใน Postman ไปก่อน
    const currentShopId = 1; 

    navigate('/checkout', { 
      state: { 
        cart: cart, 
        shopName: shopSlug,
        shopId: currentShopId 
      } 
    });
  };

  if (loading) return <Loading />;
  
  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center bg-white p-12 rounded-3xl shadow-xl border border-slate-100">
        <h2 className="text-6xl font-black text-rose-500 mb-4 tracking-tighter">404</h2>
        <p className="text-lg text-slate-600 font-medium">{error}</p>
        <button onClick={() => navigate('/shops')} className="mt-8 px-6 py-3 bg-slate-900 text-white rounded-full font-medium">
          กลับไปหน้ารวมร้านค้า
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50/50 pb-32">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-slate-900 rounded-b-[3rem] shadow-2xl mx-auto mb-16 max-w-[1400px]">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 via-purple-600/20 to-rose-600/20 mix-blend-overlay"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-24 text-center">
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight mb-6 capitalize">
            {shopSlug?.replace(/-/g, ' ')}'s Collection
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-slate-300 font-light">
            เลือกสินค้าที่คุณต้องการเพิ่มลงตะกร้า
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {products.length === 0 ? (
          <div className="text-center py-32 bg-white rounded-[2.5rem] border border-slate-100">
            <h3 className="text-2xl font-bold text-slate-800">Empty Showcase</h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product, index) => (
              <div key={product.shopProductID || index} className="animate-fadeInUp" style={{ animationDelay: `${index * 100}ms` }}>
                <ProductCard 
                  product={product} 
                  isCatalog={false} 
                  onAction={() => handleAddToCart(product)} 
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Floating Cart Button */}
      {cart.length > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4">
          <button 
            onClick={goToCheckout}
            className="w-full bg-slate-900 text-white p-6 rounded-2xl shadow-2xl flex items-center justify-between hover:scale-105 transition-transform active:scale-95"
          >
            <div className="flex items-center gap-4">
              <div className="relative">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <span className="absolute -top-2 -right-2 bg-rose-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center border-2 border-slate-900">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              </div>
              <div className="text-left">
                <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">ชำระเงินค่าสินค้า</p>
                <p className="text-lg font-bold">ดูตะกร้าสินค้าของคุณ</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-black text-emerald-400">
                {formatCurrency(cart.reduce((sum, item) => sum + (item.price * item.quantity), 0))}
              </p>
            </div>
          </button>
        </div>
      )}

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeInUp { animation: fadeInUp 0.6s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default PublicShop;