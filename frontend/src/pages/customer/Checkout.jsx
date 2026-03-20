import React, { useState } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { formatCurrency } from '../../utils/formatter';
import { showToast } from '../../components/Toast';

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [cart, setCart] = useState(location.state?.cart || []);
  const { shopId, shopName } = location.state || {};

  // ตรวจสอบความปลอดภัยของข้อมูล
  if (!cart.length || !shopId) {
    return <Navigate to="/shops" />;
  }

  const totalCartAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleUpdateQuantity = (shopProductId, delta) => {
    setCart(prev => prev.map(item => 
      item.shopProductId === shopProductId 
        ? { ...item, quantity: Math.max(1, item.quantity + delta) }
        : item
    ));
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.target);
    
    const orderData = {
      // ✅ ใช้ค่า shopId ที่ส่งมาจากหน้า PublicShop (ค่า 58)
      shopId: Number(shopId), 
      customerName: formData.get('name'),
      address: formData.get('address'),
      phone: formData.get('phone'),
      items: cart.map(item => ({
        shopProductId: item.shopProductId,
        quantity: item.quantity
      }))
    };

    try {
      const response = await fetch('https://bootcamp04.duckdns.org/api/orders/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      if (!response.ok) throw new Error('การสั่งซื้อล้มเหลว');

      const responseData = await response.json();
      showToast('สั่งซื้อสำเร็จ!', 'success');
      
      // ✅ ส่งไปหน้า Tracking พร้อมเลข Order ล่าสุด
      navigate('/order-tracking', { state: { orderNumber: responseData.orderNumber } });
      
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 lg:p-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* ตะกร้าสินค้า */}
        <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl">
          <h2 className="text-3xl font-bold mb-8">My Cart</h2>
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
            {cart.map((item) => (
              <div key={item.shopProductId} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-4">
                <img src={item.image || 'https://via.placeholder.com/150'} alt={item.name} className="w-16 h-16 rounded-lg object-cover" />
                <div className="flex-1">
                  <h3 className="font-medium line-clamp-1">{item.name}</h3>
                  <p className="text-emerald-400 font-bold">{formatCurrency(item.price)}</p>
                </div>
                <div className="flex items-center gap-3 bg-black/20 rounded-full px-3 py-1">
                  <button type="button" onClick={() => handleUpdateQuantity(item.shopProductId, -1)} className="text-white hover:text-indigo-400">−</button>
                  <span className="w-4 text-center font-bold">{item.quantity}</span>
                  <button type="button" onClick={() => handleUpdateQuantity(item.shopProductId, 1)} className="text-white hover:text-indigo-400">+</button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10 pt-6 border-t border-white/10 flex justify-between items-end">
            <span className="text-slate-400">ราคารวมทั้งหมด</span>
            <span className="text-4xl font-black text-emerald-400">{formatCurrency(totalCartAmount)}</span>
          </div>
        </div>

        {/* ฟอร์มลูกค้า */}
        <div className="bg-white rounded-[2.5rem] p-8 shadow-xl">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">ที่อยู่จัดส่ง</h2>
          <form onSubmit={handlePayment} className="space-y-5">
            <input required name="name" placeholder="ชื่อ-นามสกุล" className="w-full bg-slate-50 px-5 py-3 rounded-xl border border-slate-200" />
            <input required name="phone" type="tel" placeholder="เบอร์โทรศัพท์" className="w-full bg-slate-50 px-5 py-3 rounded-xl border border-slate-200" />
            <textarea required name="address" rows="3" placeholder="ที่อยู่ในการจัดส่งสินค้า" className="w-full bg-slate-50 px-5 py-3 rounded-xl border border-slate-200 resize-none"></textarea>
            <button type="submit" disabled={loading} className="w-full bg-slate-900 text-white rounded-xl py-4 font-bold disabled:opacity-50">
              {loading ? 'กำลังประมวลผล...' : `ยืนยันการสั่งซื้อ (${formatCurrency(totalCartAmount)})`}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Checkout;