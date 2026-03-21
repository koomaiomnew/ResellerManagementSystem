import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { shopService } from '../../services/shopService'; 
import Loading from '../../components/Loading';

const ShopList = () => {
  const navigate = useNavigate();
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // 1. เพิ่ม State สำหรับเก็บคำค้นหา
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchShops = async () => {
      try {
        setLoading(true);
        const data = await shopService.getAllShops(); 
        setShops(data);
      } catch (err) {
        console.error("Fetch Error:", err);
        setError('ไม่สามารถโหลดข้อมูลร้านค้าได้');
      } finally {
        setLoading(false);
      }
    };
    fetchShops();
  }, []);

  // 2. กรองข้อมูลร้านค้า (ค้นหาได้ทั้งชื่อร้าน และ Slug)
  const filteredShops = shops.filter(shop => {
    const searchLower = searchTerm.toLowerCase();
    const nameMatch = shop.shopName?.toLowerCase().includes(searchLower);
    const slugMatch = shop.shopSlug?.toLowerCase().includes(searchLower);
    return nameMatch || slugMatch;
  });

  if (loading) return <Loading />;
  if (error) return <div className="text-center text-rose-500 p-10">{error}</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-black text-slate-800 mb-6 text-center">🌟 เลือกร้านค้าที่คุณสนใจ</h1>
        
        {/* 3. เพิ่มกล่องค้นหาร้านค้า */}
        <div className="max-w-md mx-auto mb-10 relative">
          <input
            type="text"
            placeholder="ค้นหาชื่อร้าน หรือ @slug..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-full shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-slate-700"
          />
          <svg 
            className="w-6 h-6 text-slate-400 absolute left-4 top-3" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        
        {/* 4. แสดงผลร้านค้าที่ผ่านการกรองแล้ว */}
        {filteredShops.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
            <div className="text-6xl mb-4">🏪</div>
            <p className="text-xl text-slate-500 font-medium">
              {shops.length === 0 ? 'ยังไม่มีร้านค้าในระบบ' : 'ไม่พบร้านค้าที่คุณค้นหา'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredShops.map((shop) => (
              <div key={shop.id} className="bg-white p-6 rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-slate-100 flex flex-col items-center group">
                <div className="w-20 h-20 bg-gradient-to-tr from-indigo-500 to-rose-500 rounded-2xl rotate-3 group-hover:rotate-6 transition-transform flex items-center justify-center text-white text-3xl font-bold mb-5 shadow-inner">
                  {shop.shopName?.charAt(0)?.toUpperCase() || '?'}
                </div>
                <h2 className="text-xl font-bold text-slate-800 mb-1 text-center line-clamp-1 w-full">{shop.shopName}</h2>
                <p className="text-sm text-slate-400 mb-6 font-medium">@{shop.shopSlug}</p>
                
                <button 
                  onClick={() => navigate(`/shop/${shop.shopSlug}`, { state: { shopId: shop.id } })}
                  className="w-full py-2.5 bg-slate-900 text-white rounded-xl font-medium hover:bg-indigo-600 hover:shadow-lg hover:shadow-indigo-500/30 transition-all active:scale-95"
                >
                  เยี่ยมชมร้านค้า
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopList;