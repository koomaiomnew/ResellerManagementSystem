import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Store, Package, ShoppingCart, Wallet, LogOut, Moon, Sun } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function ResellerLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // ฟังก์ชันออกจากระบบของตัวแทน
  const handleLogout = () => {
    toast.success('ออกจากระบบเรียบร้อยแล้ว แล้วพบกันใหม่!');
    navigate('/login');
  };

  const menuItems = [
    { name: 'ภาพรวมร้านค้า', path: '/reseller/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'เลือกสินค้าเข้าร้าน', path: '/reseller/catalog', icon: <Store size={20} /> },
    { name: 'สินค้าในร้านฉัน', path: '/reseller/my-products', icon: <Package size={20} /> },
    { name: 'ออเดอร์ร้านฉัน', path: '/reseller/orders', icon: <ShoppingCart size={20} /> },
    { name: 'กระเป๋าเงิน (Wallet)', path: '/reseller/wallet', icon: <Wallet size={20} /> },
  ];

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      
      <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        <div className="h-16 flex flex-col items-center justify-center border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-xl font-bold text-secondary dark:text-emerald-400">Reseller Panel</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">ร้าน: มินนี่ช็อป</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = location.pathname.includes(item.path);
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-secondary text-white' 
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {item.icon}
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* ปุ่ม Logout ที่ผูกฟังก์ชันแล้ว */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium">ออกจากระบบ</span>
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
            {menuItems.find(m => location.pathname.includes(m.path))?.name || 'Reseller'}
          </h2>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1.5 rounded-full border border-emerald-100 dark:border-emerald-800">
              <Wallet size={16} className="text-emerald-600 dark:text-emerald-400" />
              <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">฿4,500.00</span>
            </div>

            <button 
              onClick={toggleDarkMode}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:ring-2 ring-secondary transition-all"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 text-gray-800 dark:text-gray-200">
          <Outlet /> 
        </main>
      </div>
    </div>
  );
}