import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// 🌟 เปลี่ยนการ Import ให้ตรงกับไฟล์ที่มีอยู่จริง
import { shopService } from '../../services/shopService'; 
import Loading from '../../components/Loading';

const ShopList = () => {
  const navigate = useNavigate();
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchShops = async () => {
      try {
        setLoading(true);
        // 🌟 เรียกใช้ผ่าน shopService แทน
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

  if (loading) return <Loading />;
  if (error) return <div className="text-center text-rose-500 p-10">{error}</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-black text-slate-800 mb-8 text-center">🌟 เลือกร้านค้าที่คุณสนใจ</h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {shops.map((shop) => (
            <div key={shop.id} className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all border border-slate-100 flex flex-col items-center">
              <div className="w-16 h-16 bg-gradient-to-tr from-indigo-500 to-rose-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4">
                {shop.shopName?.charAt(0) || '?'}
              </div>
              <h2 className="text-xl font-bold text-slate-800 mb-2">{shop.shopName}</h2>
              <p className="text-sm text-slate-500 mb-6">@{shop.shopSlug}</p>
              
              <button 
                onClick={() => navigate(`/shop/${shop.shopSlug}`)}
                className="w-full py-2 bg-slate-900 text-white rounded-full font-medium hover:bg-slate-800 transition-colors"
              >
                เยี่ยมชมร้านค้า
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShopList;