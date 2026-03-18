import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { resellerService } from '../../services/resellerService';
import { productService } from '../../services/productService';
import ProductCard from '../../components/ProductCard';
import Loading from '../../components/Loading';

const PublicShop = () => {
  const { shopName } = useParams();
  const navigate = useNavigate();
  const [shop, setShop] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchShop = async () => {
      try {
        const shopData = await resellerService.getShopDetails(shopName);
        setShop(shopData);
        
        const allProducts = await productService.getAllProducts();
        const availableProducts = (shopData.shopProducts || []).map(sp => {
          const base = allProducts.find(p => p.id === sp.productId);
          return base ? { ...base, sellingPrice: sp.sellingPrice } : null;
        }).filter(Boolean);
        
        setProducts(availableProducts);
      } catch (err) {
        setError('Shop not found or currently inactive');
      } finally {
        setLoading(false);
      }
    };
    fetchShop();
  }, [shopName]);

  const handleAddToCart = (product) => {
    navigate('/checkout', { state: { product, shop } });
  };

  if (loading) return <Loading />;
  
  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center bg-white p-12 rounded-3xl shadow-xl border border-slate-100 backdrop-blur-sm bg-white/80">
        <h2 className="text-6xl font-black text-rose-500 mb-4 tracking-tighter">404</h2>
        <p className="text-lg text-slate-600 font-medium">{error}</p>
        <button 
          onClick={() => navigate('/')} 
          className="mt-8 px-6 py-3 bg-slate-900 text-white rounded-full font-medium hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20"
        >
          Return Home
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Premium Hero Section */}
      <div className="relative overflow-hidden bg-slate-900 rounded-b-[3rem] shadow-2xl mx-auto mb-16 max-w-[1400px]">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 via-purple-600/20 to-rose-600/20 mix-blend-overlay"></div>
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-gradient-to-br from-indigo-500/30 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-gradient-to-tr from-rose-500/30 blur-3xl"></div>
        
        <div className="relative max-w-7xl mx-auto px-6 py-24 sm:px-12 lg:px-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-6 shadow-inner">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-sm font-medium text-slate-200 tracking-wide uppercase">Official Reseller</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-400 tracking-tight mb-6 drop-shadow-sm">
            {shop.fullname}'s Collection
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-slate-300 font-light leading-relaxed">
            Curated excellence. Discover premium products carefully selected for you.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[2.5rem] shadow-sm border border-slate-100 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[16px_16px]"></div>
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6 shadow-inner relative z-10">
              <svg className="w-10 h-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2 relative z-10">Empty Showcase</h3>
            <p className="text-slate-500 max-w-md text-center relative z-10">This curated shop hasn't added any products to their collection yet. Check back later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 xl:gap-10">
            {products.map((product, index) => (
              <div 
                key={product.id} 
                className="opacity-0 animate-[fadeInUp_0.6s_ease-out_forwards]"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <ProductCard 
                  product={product} 
                  isCatalog={false} 
                  onAction={handleAddToCart} 
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default PublicShop;

