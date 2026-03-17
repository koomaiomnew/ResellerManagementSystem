import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Layouts
import AdminLayout from './layouts/AdminLayout';
import ResellerLayout from './layouts/ResellerLayout'; 

// Pages (Admin)
import Dashboard from './pages/admin/Dashboard';
import ProductList from './pages/admin/ProductList';
import ProductForm from './pages/admin/ProductForm';
import ResellerList from './pages/admin/ResellerList';
import OrderList from './pages/admin/OrderList';
// Pages (Reseller)
import ResellerDashboard from './pages/reseller/ResellerDashboard';
import Catalog from './pages/reseller/Catalog';
import Wallet from './pages/reseller/Wallet';
import MyProducts from './pages/reseller/MyProducts';
import ResellerOrders from './pages/reseller/ResellerOrders';
// Pages (Customer)
import Shop from './pages/customer/Shop';
import Checkout from './pages/customer/Checkout';
import Payment from './pages/customer/Payment';
import TrackOrder from './pages/customer/TrackOrder';
// Pages (auth)
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* =====================
            ส่วนของ Admin
            ===================== */}
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} /> 
          <Route path="products" element={<ProductList />} />
          <Route path="products/add" element={<ProductForm />} />
          <Route path="products/edit/:id" element={<ProductForm />} />
          <Route path="resellers" element={<ResellerList />} />
          <Route path="orders" element={<OrderList />} />
        </Route>

        {/* =====================
            ส่วนของ Reseller (ตัวแทนขาย)
            ===================== */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route path="/reseller" element={<ResellerLayout />}>
          <Route index element={<Navigate to="/reseller/dashboard" replace />} />
          <Route path="dashboard" element={<ResellerDashboard />} />
          <Route path="catalog" element={<Catalog />} />
          <Route path="my-products" element={<MyProducts />} />
          <Route path="orders" element={<ResellerOrders />} />
          <Route path="wallet" element={<Wallet />} />
        </Route>

        {/* =====================
            ส่วนของ Customer (ลูกค้า)
            ===================== */}
        {/* หน้าร้านค้า (แสดงสินค้า) */}
        <Route path="/shop/:slug" element={<Shop />} />
        
        {/* หน้าสั่งซื้อ และ ชำระเงิน (เดี๋ยวเรามาสร้างต่อ) */}
        <Route path="/shop/:slug/checkout" element={<Checkout />} />
        <Route path="/shop/:slug/payment/:id" element={<Payment />} />
        <Route path="/track-order" element={<TrackOrder />} />

      </Routes>
    </Router>
  );
}

export default App;