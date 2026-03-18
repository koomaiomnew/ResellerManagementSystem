import React, { useState } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { orderService } from '../../services/orderService';
import { formatCurrency } from '../../utils/formatter';
import { showToast } from '../../components/Toast';

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const { product, shop } = location.state || {};

  if (!product || !shop) {
    return <Navigate to="/" />;
  }

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.target);
    const customerData = {
      customerName: formData.get('name'),
      customerPhone: formData.get('phone'),
      customerAddress: formData.get('address')
    };

    const profitPerItem = product.sellingPrice - product.costPrice;
    const totalProfit = profitPerItem * quantity;

    const orderData = {
      ...customerData,
      resellerId: shop.id,
      shopName: shop.shopName,
      productId: product.id,
      productName: product.name,
      quantity,
      costPrice: product.costPrice,
      sellingPrice: product.sellingPrice,
      totalAmount: product.sellingPrice * quantity,
      profit: totalProfit // Reseller's profit
    };

    try {
      const order = await orderService.createOrder(orderData);
      navigate('/order-success', { state: { orderNumber: order.orderNumber } });
    } catch (err) {
      showToast('Payment failed', 'error');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans relative overflow-hidden">
      {/* Background Ornaments */}
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-indigo-200/40 blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-rose-200/40 blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-6xl bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/60 overflow-hidden flex flex-col lg:flex-row relative z-10 border border-white/50 backdrop-blur-xl">
        
        {/* Left Side: Order Summary (Dark Mode Glassmorphism) */}
        <div className="lg:w-[45%] lg:min-h-[700px] relative p-8 lg:p-12 text-white overflow-hidden flex flex-col justify-between">
          <div className="absolute inset-0 bg-slate-900"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 to-purple-800/40 mix-blend-overlay"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/30 rounded-full blur-[80px]"></div>
          
          <div className="relative z-10">
            <button onClick={() => navigate(-1)} className="flex items-center text-slate-300 hover:text-white transition-colors mb-10 group">
              <svg className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
              <span>Back to Shop</span>
            </button>

            <h2 className="text-3xl font-bold tracking-tight mb-8 text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-300">
              Secure Checkout
            </h2>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-2xl mb-8">
              <div className="flex gap-6 items-center">
                <div className="w-28 h-28 rounded-xl overflow-hidden bg-white/5 border border-white/10 flex-shrink-0 shadow-inner relative group">
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10"></div>
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="flex-1">
                  <span className="inline-block px-3 py-1 bg-white/10 rounded-full text-xs font-medium tracking-wide text-indigo-200 mb-2 border border-white/5">
                    Sold by {shop.fullname}
                  </span>
                  <h3 className="font-semibold text-xl text-white leading-tight mb-2">{product.name}</h3>
                  <div className="font-bold text-2xl text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-emerald-100">
                    {formatCurrency(product.sellingPrice)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 bg-black/20 rounded-2xl p-6 border border-white/5 backdrop-blur-sm mt-8">
             <div className="flex justify-between items-center mb-6">
              <span className="text-slate-300 font-medium">Quantity</span>
              <div className="flex items-center gap-4 bg-white/5 p-1 rounded-full border border-white/10">
                <button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 hover:scale-105 active:scale-95 transition-all text-white border border-white/5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 12H4" /></svg>
                </button>
                <span className="font-bold text-lg w-4 text-center">{quantity}</span>
                <button type="button" onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 hover:scale-105 active:scale-95 transition-all text-white border border-white/5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
                </button>
              </div>
            </div>
            <div className="border-t border-white/10 pt-6 flex justify-between items-end">
              <div>
                <span className="block text-slate-400 text-sm mb-1">Total Due</span>
                <span className="block text-slate-500 text-xs">Including all taxes and fees</span>
              </div>
              <span className="text-4xl font-black tracking-tighter text-white">
                {formatCurrency(product.sellingPrice * quantity)}
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Interactive Form */}
        <div className="lg:w-[55%] p-8 lg:p-14 bg-white/60">
          <div className="max-w-md mx-auto h-full flex flex-col justify-center">
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Shipping Details</h2>
              <p className="text-slate-500">Please enter your delivery information.</p>
            </div>

            <form onSubmit={handlePayment} className="space-y-6">
              <div className="group relative">
                <input required name="name" type="text" id="name" placeholder=" " className="peer w-full bg-slate-50 px-5 pt-8 pb-3 rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors" />
                <label htmlFor="name" className="absolute text-slate-400 text-sm duration-300 transform -translate-y-1 scale-75 top-4 left-5 z-10 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-3 peer-focus:scale-75 peer-focus:-translate-y-1 peer-focus:text-indigo-600">Full Name</label>
              </div>

              <div className="group relative">
                <input required name="phone" type="tel" id="phone" placeholder=" " className="peer w-full bg-slate-50 px-5 pt-8 pb-3 rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors" />
                <label htmlFor="phone" className="absolute text-slate-400 text-sm duration-300 transform -translate-y-1 scale-75 top-4 left-5 z-10 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-3 peer-focus:scale-75 peer-focus:-translate-y-1 peer-focus:text-indigo-600">Phone Number</label>
              </div>

              <div className="group relative">
                <textarea required name="address" id="address" rows="3" placeholder=" " className="peer w-full bg-slate-50 px-5 pt-8 pb-3 rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors resize-none"></textarea>
                <label htmlFor="address" className="absolute text-slate-400 text-sm duration-300 transform -translate-y-1 scale-75 top-4 left-5 z-10 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-3 peer-focus:scale-75 peer-focus:-translate-y-1 peer-focus:text-indigo-600">Complete Delivery Address</label>
              </div>
              
              <div className="bg-indigo-50/50 p-5 rounded-2xl border border-indigo-100/50 flex gap-4 items-start shadow-sm mt-8">
                <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600 shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-800 mb-1">Simulated Transaction</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">No real charges will be applied. Confirming this order will generate a tracking number for demonstration purposes.</p>
                </div>
              </div>

              <div className="pt-4">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full relative group overflow-hidden bg-slate-900 rounded-xl p-[2px] transition-all disabled:opacity-70 disabled:cursor-not-allowed hover:shadow-2xl hover:shadow-indigo-500/30"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-rose-500 opacity-70 group-hover:opacity-100 blur-sm transition-opacity duration-500"></span>
                  <div className="relative bg-slate-900 hover:bg-slate-800 transition-colors rounded-[10px] py-4 px-6 flex items-center justify-center">
                    {loading ? (
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    ) : (
                      <>
                        <span className="font-bold text-white text-lg tracking-wide mr-2">Confirm Payment</span>
                        <svg className="w-5 h-5 text-white transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                      </>
                    )}
                  </div>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
