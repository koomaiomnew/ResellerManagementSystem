import React from 'react';
import { formatCurrency } from '../utils/formatter';

const ProductTable = ({ products, onEdit, onDelete, role }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="bg-gray-50 text-gray-800 uppercase text-xs font-semibold">
            <tr>
              <th className="px-6 py-4">Image</th>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Stock</th>
              {role === 'ADMIN' && <th className="px-6 py-4">Cost Price</th>}
              <th className="px-6 py-4">{role === 'ADMIN' ? 'Min Price' : 'Selling Price'}</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 font-medium">
            {products.map(product => (
              <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <img src={product.image || 'https://via.placeholder.com/40'} alt={product.name} className="h-10 w-10 rounded-md object-cover border border-gray-200" />
                </td>
                <td className="px-6 py-4">{product.name}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${product.stock < 10 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                    {product.stock} units
                  </span>
                </td>
                {role === 'ADMIN' && <td className="px-6 py-4">{formatCurrency(product.costPrice)}</td>}
                <td className="px-6 py-4">{formatCurrency(role === 'ADMIN' ? product.minPrice : (product.sellingPrice || product.minPrice))}</td>
                <td className="px-6 py-4 flex justify-end gap-3">
                  
                  {/* ปุ่ม Edit: เช็คว่ามีฟังก์ชัน onEdit ส่งมาไหม */}
                  {onEdit && (
                    <button onClick={() => onEdit(product)} className="text-blue-600 hover:text-blue-800 font-medium transition-colors">
                      Edit
                    </button>
                  )}
                  
                  {/* 🌟 ปุ่ม Delete: แก้ไขเอา role === 'ADMIN' ออกแล้ว */}
                  {onDelete && (
                    <button onClick={() => onDelete(product.id)} className="text-red-600 hover:text-red-800 font-medium transition-colors">
                      Delete
                    </button>
                  )}
                  
                </td>
              </tr>
            ))}
            
            {/* ส่วนแสดงผลกรณีที่ข้อมูลว่างเปล่า */}
            {products.length === 0 && (
              <tr>
                <td colSpan={role === 'ADMIN' ? 6 : 5} className="px-6 py-12 text-center text-gray-500">
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductTable;