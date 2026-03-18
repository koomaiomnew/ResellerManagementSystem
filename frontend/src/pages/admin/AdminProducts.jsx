import React, { useState, useEffect } from 'react';
import { productService } from '../../services/productService';
import ProductTable from '../../components/ProductTable';
import Loading from '../../components/Loading';
import { showToast } from '../../components/Toast';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await productService.getAllProducts();
      setProducts(data);
    } catch (err) {
      showToast('Failed to load products', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const productData = Object.fromEntries(formData.entries());

    try {
      if (currentProduct) {
        await productService.updateProduct(currentProduct.id, productData);
        showToast('Product updated successfully!');
      } else {
        await productService.createProduct(productData);
        showToast('Product created successfully!');
      }
      setIsModalOpen(false);
      fetchProducts();
    } catch (err) {
      showToast('Operation failed', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productService.deleteProduct(id);
        showToast('Product deleted successfully');
        fetchProducts();
      } catch (err) {
        showToast('Failed to delete', 'error');
      }
    }
  };

  const openEditModal = (product) => {
    setCurrentProduct(product);
    setIsModalOpen(true);
  };

  const openCreateModal = () => {
    setCurrentProduct(null);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Manage Products</h2>
        <button 
          onClick={openCreateModal}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow transition font-medium"
        >
          + Add New Product
        </button>
      </div>

      {loading ? <Loading /> : (
        <ProductTable 
          products={products} 
          role="ADMIN" 
          onEdit={openEditModal} 
          onDelete={handleDelete} 
        />
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-lg">
            <h3 className="text-xl font-bold mb-4">{currentProduct ? 'Edit Product' : 'Add New Product'}</h3>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input required name="name" defaultValue={currentProduct?.name} className="w-full border-gray-300 rounded-lg shadow-sm px-4 py-2 border focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <input name="image" defaultValue={currentProduct?.image} className="w-full border-gray-300 rounded-lg shadow-sm px-4 py-2 border focus:ring-blue-500 focus:border-blue-500" placeholder="https://..." />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cost Price</label>
                  <input required type="number" name="costPrice" defaultValue={currentProduct?.costPrice} className="w-full border-gray-300 rounded-lg shadow-sm px-4 py-2 border" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Min Price</label>
                  <input required type="number" name="minPrice" defaultValue={currentProduct?.minPrice} className="w-full border-gray-300 rounded-lg shadow-sm px-4 py-2 border" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                  <input required type="number" name="stock" defaultValue={currentProduct?.stock} className="w-full border-gray-300 rounded-lg shadow-sm px-4 py-2 border" />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg font-medium shadow-sm transition">Save Product</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
