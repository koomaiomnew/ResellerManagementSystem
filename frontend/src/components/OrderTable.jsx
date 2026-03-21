import React, { useState } from 'react';
import { formatCurrency, formatDate } from '../utils/formatter';
import { CheckCircle, Inbox, Send } from 'lucide-react';

const OrderTable = ({ orders, role, onUpdateStatus }) => {
  // สร้าง State เพื่อเก็บค่าที่เลือกใน dropdown ของแต่ละ Order
  const [selectedStatus, setSelectedStatus] = useState({});

  const getStatusStyle = (status) => {
    const s = status?.toUpperCase() || '';
    if (s === 'PAID' || s === 'ชำระเงินแล้ว') 
      return { bg: 'bg-amber-100 text-amber-800', dot: 'bg-amber-500', borderLeft: 'border-l-amber-400' };
    if (s === 'SHIPPED' || s === 'จัดส่งแล้ว') 
      return { bg: 'bg-emerald-100 text-emerald-800', dot: 'bg-emerald-500', borderLeft: 'border-l-emerald-400' };
    if (s === 'COMPLETED' || s === 'สำเร็จ') 
      return { bg: 'bg-gray-100 text-gray-600', dot: 'bg-gray-400', borderLeft: 'border-l-gray-400' };
    
    return { bg: 'bg-red-100 text-red-800', dot: 'bg-red-500', borderLeft: 'border-l-red-400' };
  };

  const handleDropdownChange = (orderId, value) => {
    setSelectedStatus(prev => ({ ...prev, [orderId]: value }));
  };

  return (
    <div className="bg-gray-50 p-4 sm:p-6 rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-600 whitespace-nowrap border-separate border-spacing-y-3">
          <thead className="text-gray-500 uppercase text-[11px] font-bold tracking-wider">
            <tr>
              <th className="px-6 py-2">Order No</th>
              <th className="px-6 py-2">Address</th>
              <th className="px-6 py-2">Customer</th>
              <th className="px-6 py-2">Total</th>
              <th className="px-6 py-2">Status</th>
              {role === 'ADMIN' && <th className="px-6 py-2 text-center">Actions (Update Status)</th>}
            </tr>
          </thead>

          <tbody>
            {orders.map(order => {
              const style = getStatusStyle(order.status);
              const currentSelected = selectedStatus[order.id] || order.status;

              return (
                <tr key={order.id} className="bg-white shadow-sm hover:shadow-md transition-all duration-200 group">
                  <td className={`px-6 py-4 font-semibold text-gray-900 border-l-4 ${style.borderLeft} rounded-l-xl`}>
                    #{order.orderNumber}
                  </td>

                  <td className="px-6 py-4 text-gray-500">
                    {order.address}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs border border-indigo-100">
                        {order.customerName?.charAt(0).toUpperCase() || '?'}
                      </div>
                      <div className="font-medium text-gray-900">{order.customerName}</div>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-gray-900 font-bold">
                    {formatCurrency(order.totalAmount)}
                  </td>

                  <td className={`px-6 py-4 ${role !== 'ADMIN' ? 'rounded-r-xl' : ''}`}>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${style.bg}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`}></span>
                      {order.status}
                    </span>
                  </td>

                  {role === 'ADMIN' && (
                    <td className="px-6 py-4 rounded-r-xl">
                      <div className="flex items-center justify-center gap-2">
                        {/* 🌟 Dropdown เลือกสถานะ */}
                        <select
                          className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                          value={currentSelected}
                          onChange={(e) => handleDropdownChange(order.id, e.target.value)}
                        >
                          <option value="paid">ชำระเงินแล้ว</option>
                          <option value="shipped">จัดส่งแล้ว</option>
                          <option value="completed">สำเร็จ</option>
                        </select>

                        {/* 🌟 ปุ่มกดยืนยัน (Confirm) */}
                        <button
                          onClick={() => onUpdateStatus(order.id, currentSelected)}
                          disabled={currentSelected === order.status}
                          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm ${
                            currentSelected === order.status
                              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                              : "bg-blue-600 text-white hover:bg-blue-700 active:scale-95"
                          }`}
                        >
                          <Send size={12} />
                          Update
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {orders.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-gray-400">
          <Inbox size={48} className="mb-2 opacity-20" />
          <p>No orders found</p>
        </div>
      )}
    </div>
  );
};

export default OrderTable;