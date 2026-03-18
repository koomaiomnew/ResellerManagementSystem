import React, { useEffect, useState } from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';

const OrderSuccess = () => {
  const location = useLocation();
  const { orderNumber } = location.state || {};
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 300);
    return () => clearTimeout(timer);
  }, []);

  if (!orderNumber) {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden bg-slate-50">
      {/* Background Ornaments */}
      <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-emerald-200/30 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-indigo-200/30 blur-[120px] pointer-events-none"></div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-float"
            style={{
              width: `${Math.random() * 8 + 4}px`,
              height: `${Math.random() * 8 + 4}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              backgroundColor: ['#818cf8', '#34d399', '#a78bfa', '#60a5fa', '#f472b6'][Math.floor(Math.random() * 5)],
              opacity: 0.4,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 10 + 8}s`,
            }}
          ></div>
        ))}
      </div>

      <div className={`relative z-10 max-w-lg w-full transition-all duration-700 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        {/* Main Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl shadow-slate-200/60 border border-white/60 p-10 sm:p-14 text-center">
          
          {/* Animated Checkmark */}
          <div className="relative mx-auto w-24 h-24 mb-8">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 animate-pulse opacity-20 scale-125"></div>
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-xl shadow-emerald-500/30 flex items-center justify-center">
              <svg className="w-12 h-12 text-white animate-checkmark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-slate-800 tracking-tight mb-3">
            Order Confirmed!
          </h2>
          <p className="text-slate-500 text-lg mb-10 leading-relaxed max-w-sm mx-auto">
            Thank you for your purchase. Your order has been successfully processed.
          </p>
          
          {/* Order Number Card */}
          <div className="bg-slate-900 rounded-2xl p-6 mb-10 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 to-purple-600/20 mix-blend-overlay"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-[40px]"></div>
            <div className="relative">
              <p className="text-xs font-medium text-slate-400 uppercase tracking-[0.2em] mb-2">Order Number</p>
              <p className="text-2xl sm:text-3xl font-black text-white font-mono tracking-wider">{orderNumber}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <Link 
              to="/order-tracking" 
              state={{ orderNumber }}
              className="group block w-full relative overflow-hidden rounded-xl p-[2px] transition-all hover:shadow-2xl hover:shadow-indigo-500/20"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-rose-500 opacity-80 group-hover:opacity-100 blur-[1px] transition-opacity"></span>
              <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-[10px] py-4 px-6 flex items-center justify-center gap-3 transition-colors">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span className="font-bold text-white text-lg">Track Order</span>
              </div>
            </Link>
            
            <Link 
              to="/" 
              className="block w-full py-4 px-6 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-lg transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes checkmark {
          0% { stroke-dashoffset: 24; opacity: 0; }
          50% { opacity: 1; }
          100% { stroke-dashoffset: 0; opacity: 1; }
        }
        .animate-checkmark {
          stroke-dasharray: 24;
          animation: checkmark 0.6s ease-out 0.5s both;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.4; }
          25% { transform: translateY(-30px) rotate(90deg); opacity: 0.6; }
          50% { transform: translateY(-15px) rotate(180deg); opacity: 0.3; }
          75% { transform: translateY(-40px) rotate(270deg); opacity: 0.5; }
        }
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default OrderSuccess;
