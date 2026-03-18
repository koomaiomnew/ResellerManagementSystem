import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { orderService } from '../../services/orderService';
import { showToast } from '../../components/Toast';
import { formatCurrency, formatDate } from '../../utils/formatter';

const OrderTracking = () => {
  const location = useLocation();
  const [orderQuery, setOrderQuery] = useState(location.state?.orderNumber || '');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const handleSearch = async (e) => {
    e?.preventDefault();
    if (!orderQuery.trim()) return;
    
    setLoading(true);
    setShowResult(false);
    try {
      const data = await orderService.trackOrder(orderQuery);
      setOrder(data);
      setTimeout(() => setShowResult(true), 100);
    } catch (err) {
      showToast('Order not found', 'error');
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderQuery) {
      handleSearch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const steps = [
    { key: 'PAID', label: 'Payment Confirmed', icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    )},
    { key: 'WAITING_SHIPMENT', label: 'Processing', icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
    )},
    { key: 'SHIPPED', label: 'Shipped', icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
    )}
  ];
  const currentStepIdx = order ? steps.findIndex(s => s.key === order.status) : -1;

  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-50">
      {/* Hero Section */}
      <div className="relative bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 via-purple-600/10 to-transparent"></div>
        <div className="absolute top-0 right-0 -mr-40 -mt-40 w-96 h-96 rounded-full bg-indigo-500/20 blur-[100px]"></div>
        <div className="absolute bottom-0 left-0 -ml-40 -mb-40 w-80 h-80 rounded-full bg-purple-500/20 blur-[100px]"></div>

        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/10 mb-6">
            <svg className="w-4 h-4 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span className="text-sm font-medium text-slate-300 tracking-wide">Order Tracking</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-400 tracking-tight mb-4">
            Track Your Order
          </h1>
          <p className="text-slate-400 text-lg max-w-lg mx-auto mb-10">
            Enter your order number to see the current shipping status.
          </p>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="max-w-xl mx-auto flex gap-3">
            <div className="flex-1 relative">
              <input 
                type="text" 
                value={orderQuery}
                onChange={(e) => setOrderQuery(e.target.value)}
                placeholder="e.g. ORD-123456"
                className="w-full bg-white/10 backdrop-blur-md border border-white/15 text-white placeholder-slate-500 rounded-xl px-6 py-4 text-lg font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400/50 transition-all"
              />
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all disabled:opacity-60 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
            >
              {loading ? (
                <svg className="animate-spin w-6 h-6" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : 'Track'}
            </button>
          </form>
        </div>
      </div>

      {/* Results Section */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 pb-20 relative z-10">
        {order && (
          <div className={`transition-all duration-500 ${showResult ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            {/* Status Card */}
            <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-2xl shadow-slate-200/50 border border-white/60 overflow-hidden">
              
              {/* Order Header */}
              <div className="bg-slate-900 p-6 sm:p-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 to-purple-600/10"></div>
                <div className="relative flex flex-wrap justify-between items-center gap-4">
                  <div>
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-[0.15em] mb-1">Order Number</p>
                    <div className="font-mono text-2xl font-black text-white tracking-wider">{order.orderNumber}</div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-[0.15em] mb-1">Total Amount</p>
                    <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-emerald-100">
                      {formatCurrency(order.totalAmount)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress Steps */}
              <div className="p-6 sm:p-10">
                <div className="relative flex justify-between items-center mb-4">
                  {/* Background Line */}
                  <div className="absolute left-[16%] right-[16%] top-1/2 -translate-y-1/2 h-1 bg-slate-200 rounded-full"></div>
                  {/* Active Line */}
                  <div 
                    className="absolute left-[16%] top-1/2 -translate-y-1/2 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-700 ease-out"
                    style={{ width: currentStepIdx === 0 ? '0%' : currentStepIdx === 1 ? '34%' : '68%' }}
                  ></div>
                  
                  {steps.map((step, idx) => (
                    <div key={step.key} className="relative flex flex-col items-center z-10" style={{ width: '33.33%' }}>
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 shadow-lg ${
                        idx <= currentStepIdx 
                          ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-indigo-500/30 scale-100' 
                          : 'bg-white text-slate-300 border-2 border-slate-200 shadow-slate-200/50 scale-90'
                      }`}>
                        {idx < currentStepIdx ? (
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          step.icon
                        )}
                      </div>
                      <span className={`mt-3 text-xs sm:text-sm font-semibold text-center transition-colors ${
                        idx <= currentStepIdx ? 'text-slate-800' : 'text-slate-400'
                      }`}>
                        {step.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Details */}
              <div className="px-6 sm:px-10 pb-8">
                <div className="bg-slate-50/80 rounded-2xl p-6 border border-slate-100">
                  <h4 className="font-bold text-slate-800 mb-5 flex items-center gap-2">
                    <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Order Details
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm">
                    <div className="bg-white rounded-xl p-4 border border-slate-100">
                      <span className="block text-xs text-slate-400 uppercase tracking-wider mb-1 font-medium">Item</span>
                      <span className="font-semibold text-slate-800">{order.productName} <span className="text-slate-400">(x{order.quantity})</span></span>
                    </div>
                    <div className="bg-white rounded-xl p-4 border border-slate-100">
                      <span className="block text-xs text-slate-400 uppercase tracking-wider mb-1 font-medium">Order Date</span>
                      <span className="font-semibold text-slate-800">{formatDate(order.createdAt)}</span>
                    </div>
                    <div className="sm:col-span-2 bg-white rounded-xl p-4 border border-slate-100">
                      <span className="block text-xs text-slate-400 uppercase tracking-wider mb-2 font-medium">Shipping To</span>
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <svg className="w-4 h-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                        <div>
                          <span className="font-semibold text-slate-800 block">{order.customerName}</span>
                          <span className="text-slate-500 block">{order.customerPhone}</span>
                          <span className="text-slate-500 block mt-1">{order.customerAddress}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!order && !loading && orderQuery === '' && (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-5">
              <svg className="w-9 h-9 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <p className="text-slate-400 text-lg">Enter your order number above to get started</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderTracking;
