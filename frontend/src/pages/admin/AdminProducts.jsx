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
  
  // 1. เพิ่ม State สำหรับเก็บคำค้นหา
  const [searchTerm, setSearchTerm] = useState('');

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

  // 2. กรองข้อมูลสินค้าตามคำค้นหา (ค้นหาจากชื่อสินค้า เล็ก-ใหญ่ได้หมด)
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* 3. ปรับ Layout ส่วนหัวให้มีช่องค้นหา */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Manage Products</h2>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          {/* ช่อง Input สำหรับค้นหา */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
            <svg 
              className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <button 
            onClick={openCreateModal}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow transition font-medium whitespace-nowrap"
          >
            + Add New Product
          </button>
        </div>
      </div>

      {loading ? <Loading /> : (
        <ProductTable 
          products={filteredProducts} // 4. ส่งข้อมูลที่ถูกกรองแล้วไปที่ Table
          role="ADMIN" 
          onEdit={openEditModal} 
          onDelete={handleDelete} 
        />
      )}

      {/* Modal (คงเดิม) */}
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