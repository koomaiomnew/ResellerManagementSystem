import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// นำเข้า Layout และ Pages
import AdminLayout from './/layouts/AdminLayout';
import Dashboard from './/pages/admin/Dashboard';
import ProductList from './/pages/admin/ProductList';
import ProductForm from './/pages/admin/ProductForm';
import ResellerList from './/pages/admin/ResellerList';
import OrderList from './/pages/admin/Orderlist';
function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      
      <Routes>
        <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />

        {/* =====================
            ส่วนของ Admin (ผู้ดูแลระบบ)
            ===================== */}
        <Route path="/admin/login" element={<div>หน้า Login ของ Admin</div>} />

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          
          {/* เปลี่ยนตรงนี้ให้เรียกใช้ Component Dashboard ที่เราเพิ่งสร้าง */}
          <Route path="dashboard" element={<Dashboard />} /> 
          
          <Route path="products" element={<ProductList />} />
          <Route path="products/add" element={<ProductForm />} />
          <Route path="products/edit/:id" element={<ProductForm />} />
          <Route path="resellers" element={<ResellerList />} />
          <Route path="orders" element={<OrderList />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;