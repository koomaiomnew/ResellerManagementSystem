import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { productService } from '../../services/productService';
import { getDB, setDB } from '../../utils/mockData';
import ProductCard from '../../components/ProductCard';
import Loading from '../../components/Loading';
import { showToast } from '../../components/Toast';

const ResellerCatalog = () => {
  const { user, login } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        const data = await productService.getAllProducts();
        setProducts(data);
      } catch (err) {
        showToast('Failed to load products', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchCatalog();
  }, []);

  const handleAddClick = (product) => {
    const existing = user.shopProducts?.find(p => p.productId === product.id);
    if (existing) {
      showToast('Product is already in your shop. Update price from My Products.', 'error');
      return;
    }
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleSaveToShop = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const sellingPrice = Number(formData.get('sellingPrice'));

    if (sellingPrice < selectedProduct.minPrice) {
      showToast(`Selling price must be at least $${selectedProduct.minPrice}`, 'error');
      return;
    }

    try {
      let users = getDB('mock_users');
      const uIndex = users.findIndex(u => u.id === user.id);
      if (uIndex > -1) {
        if (!users[uIndex].shopProducts) users[uIndex].shopProducts = [];
        users[uIndex].shopProducts.push({
          productId: selectedProduct.id,
          sellingPrice
        });
        setDB('mock_users', users);
        
        // Update current authenticated user state
        // To refresh user state context we can manually patch it, or re-call login internally if needed.
        // We will just patch the localStorage directly and it persists.
        localStorage.setItem('currentUser', JSON.stringify(users[uIndex]));
        login(users[uIndex].email, users[uIndex].password).catch(()=>{}); // silent refresh
        
        showToast('Product added to your shop!');
      }
      setIsModalOpen(false);
    } catch (err) {
      showToast('Error adding product', 'error');
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Global Product Catalog</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map(product => (
          <ProductCard 
            key={product.id} 
            product={product} 
            isCatalog={true} 
            onAction={handleAddClick} 
          />
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Add to Shop</h3>
            <div className="mb-4">
              <p className="font-semibold">{selectedProduct.name}</p>
              <p className="text-sm text-gray-500">Min Price: ${selectedProduct.minPrice}</p>
            </div>
            <form onSubmit={handleSaveToShop} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Selling Price ($)</label>
                <input 
                  required 
                  type="number" 
                  name="sellingPrice" 
                  min={selectedProduct.minPrice}
                  defaultValue={selectedProduct.minPrice}
                  className="w-full border-gray-300 rounded-lg shadow-sm px-4 py-2 border focus:ring-blue-500 focus:border-blue-500" 
                />
              </div>
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg font-medium shadow-sm transition">Add Product</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResellerCatalog;
