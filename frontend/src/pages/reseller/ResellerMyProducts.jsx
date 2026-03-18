import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { productService } from '../../services/productService';
import { getDB, setDB } from '../../utils/mockData';
import ProductTable from '../../components/ProductTable';
import Loading from '../../components/Loading';
import { showToast } from '../../components/Toast';

const ResellerMyProducts = () => {
  const { user, login } = useAuth();
  const [shopProducts, setShopProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);

  useEffect(() => {
    const fetchMyProducts = async () => {
      try {
        const allProducts = await productService.getAllProducts();
        const userProducts = user?.shopProducts || [];
        
        const combined = userProducts.map(up => {
          const base = allProducts.find(p => p.id === up.productId);
          return base ? { ...base, sellingPrice: up.sellingPrice } : null;
        }).filter(Boolean);
        
        setShopProducts(combined);
      } catch (err) {
        showToast('Failed to load shop products', 'error');
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchMyProducts();
  }, [user]);

  const handleEdit = (product) => {
    setCurrentProduct(product);
    setIsModalOpen(true);
  };

  const handleSavePrice = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newSellingPrice = Number(formData.get('sellingPrice'));

    if (newSellingPrice < currentProduct.minPrice) {
      showToast(`Minimum allowed price is $${currentProduct.minPrice}`, 'error');
      return;
    }

    try {
      let users = getDB('mock_users');
      const uIndex = users.findIndex(u => u.id === user.id);
      if (uIndex > -1) {
        const pIndex = users[uIndex].shopProducts.findIndex(p => p.productId === currentProduct.id);
        if (pIndex > -1) {
          users[uIndex].shopProducts[pIndex].sellingPrice = newSellingPrice;
          setDB('mock_users', users);
          localStorage.setItem('currentUser', JSON.stringify(users[uIndex]));
          login(users[uIndex].email, users[uIndex].password).catch(()=>{}); // silent refresh
          
          setShopProducts(prev => prev.map(p => p.id === currentProduct.id ? { ...p, sellingPrice: newSellingPrice } : p));
          showToast('Price updated!');
        }
      }
      setIsModalOpen(false);
    } catch (err) {
      showToast('Error updating price', 'error');
    }
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Remove this product from your shop?')) {
      try {
        let users = getDB('mock_users');
        const uIndex = users.findIndex(u => u.id === user.id);
        if (uIndex > -1) {
          users[uIndex].shopProducts = users[uIndex].shopProducts.filter(p => p.productId !== productId);
          setDB('mock_users', users);
          localStorage.setItem('currentUser', JSON.stringify(users[uIndex]));
          login(users[uIndex].email, users[uIndex].password).catch(()=>{}); // silent refresh
          
          setShopProducts(prev => prev.filter(p => p.id !== productId));
          showToast('Product removed');
        }
      } catch (err) {
        showToast('Error removing product', 'error');
      }
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">My Shop Products</h2>
        <a href="/reseller/catalog" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow transition font-medium">
          Browse Catalog
        </a>
      </div>

      <ProductTable 
        products={shopProducts} 
        role="RESELLER" 
        onEdit={handleEdit} 
        onDelete={handleDelete} // Only visible to admin in Table based on Role but wait, table hides Delete if not Admin
      />

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Edit Selling Price</h3>
            <div className="mb-4">
              <p className="font-semibold">{currentProduct.name}</p>
              <p className="text-sm text-gray-500">Min Price: ${currentProduct.minPrice}</p>
            </div>
            <form onSubmit={handleSavePrice} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Selling Price ($)</label>
                <input 
                  required 
                  type="number" 
                  name="sellingPrice" 
                  min={currentProduct.minPrice}
                  defaultValue={currentProduct.sellingPrice}
                  className="w-full border-gray-300 rounded-lg shadow-sm px-4 py-2 border focus:ring-blue-500 focus:border-blue-500" 
                />
              </div>
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg font-medium shadow-sm transition">Update Price</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResellerMyProducts;
