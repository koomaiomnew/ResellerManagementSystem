// import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { initMockDB } from './utils/mockData';
import Toast from './components/Toast';

// Auth Pages
// import LandingPage from './pages/LandingPage'; // 🌟 เพิ่มบรรทัดนี้เพื่อนำเข้า LandingPage
import Login from './pages/Login';
import Register from './pages/Register';

// Layouts
import AdminLayout from './layouts/AdminLayout';
import ResellerLayout from './layouts/ResellerLayout';
import ShopLayout from './layouts/ShopLayout';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminResellers from './pages/admin/AdminResellers';
import AdminOrders from './pages/admin/AdminOrders';

// Reseller Pages
import ResellerDashboard from './pages/reseller/ResellerDashboard';
import ResellerCatalog from './pages/reseller/ResellerCatalog';
import ResellerMyProducts from './pages/reseller/ResellerMyProducts';
import ResellerOrders from './pages/reseller/ResellerOrders';
import ResellerWallet from './pages/reseller/ResellerWallet';

// Customer Pages
import PublicShop from './pages/customer/PublicShop';
import ShopList from './pages/customer/ShopList';
import Checkout from './pages/customer/Checkout';
import OrderTracking from './pages/customer/OrderTracking';
import React, { useEffect } from 'react';
// Components
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  useEffect(() => {
    initMockDB(); // Initialize mock data on first load
  }, []);

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public / Auth */}
          {/* 🌟 เปลี่ยนจาก Navigate to="/login" เป็นหน้า LandingPage */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Customer / Public Shop */}
          <Route element={<ShopLayout />}>
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-tracking" element={<OrderTracking />} />
            <Route path="/" element={<ShopList />} />
            <Route path="/shop/:shopSlug" element={<PublicShop />} />
          </Route>

          {/* Admin Routes */}
          <Route 
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/admin" element={<Navigate to="/admin/dashboard" />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/products" element={<AdminProducts />} />
            <Route path="/admin/resellers" element={<AdminResellers />} />
            <Route path="/admin/orders" element={<AdminOrders />} />
          </Route>

          {/* Reseller Routes */}
          <Route 
            element={
              <ProtectedRoute allowedRoles={['RESELLER']}>
                <ResellerLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/reseller" element={<Navigate to="/reseller/dashboard" />} />
            <Route path="/reseller/dashboard" element={<ResellerDashboard />} />
            <Route path="/reseller/catalog" element={<ResellerCatalog />} />
            <Route path="/reseller/my-products" element={<ResellerMyProducts />} />
            <Route path="/reseller/orders" element={<ResellerOrders />} />
            <Route path="/reseller/wallet" element={<ResellerWallet />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <Toast />
    </AuthProvider>
  );
}

export default App;