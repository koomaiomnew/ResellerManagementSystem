// import React from 'react';
// import { formatCurrency, formatDate } from '../utils/formatter';

// const OrderTable = ({ orders, role, onUpdateStatus }) => {
//   const getStatusColor = (status) => {
//     switch (status) {
//       case 'PAID': return 'bg-yellow-100 text-yellow-800';
//       case 'WAITING_SHIPMENT': return 'bg-blue-100 text-blue-800';
//       case 'SHIPPED': return 'bg-green-100 text-green-800';
//       default: return 'bg-gray-100 text-gray-800';
//     }
//   };

//   return (
//     <div className="bg-red rounded-xl shadow-md overflow-hidden">
//       <div className="overflow-x-auto">
//         <table className="w-full text-left text-sm text-gray-600">
//           <thead className="bg-gray-50 text-gray-800 uppercase text-xs font-semibold">
//             <tr>
//               <th className="px-6 py-4">Order No</th>
//               <th className="px-6 py-4">Date</th>
//               <th className="px-6 py-4">Customer</th>
//               <th className="px-6 py-4">Subtotal</th>
//               <th className="px-6 py-4">Status</th>
//               {role === 'ADMIN' && <th className="px-6 py-4 text-right">Actions</th>}
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-gray-100 font-medium">
//             {orders.map(order => (
//               <tr key={order.id} className="hover:bg-gray-50 transition-colors">
//                 <td className="px-6 py-4 font-bold text-gray-900">{order.orderNumber}</td>
//                 <td className="px-6 py-4">{formatDate(order.createdAt)}</td>
//                 <td className="px-6 py-4 text-gray-500">
//                   <div>{order.customerName}</div>
//                   <div className="text-xs">{order.customerPhone}</div>
//                 </td>
//                 <td className="px-6 py-4 text-gray-900 font-bold">{formatCurrency(order.totalAmount || (order.sellingPrice * order.quantity))}</td>
//                 <td className="px-6 py-4">
//                   <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
//                     {order.status}
//                   </span>
//                 </td>
//                 {role === 'ADMIN' && (
//                   <td className="px-6 py-4 flex justify-end gap-2">
//                     {order.status === 'PAID' && (
//                       <button onClick={() => onUpdateStatus(order.id, 'WAITING_SHIPMENT')} className="text-blue-600 hover:text-blue-800 text-xs font-bold uppercase transition">
//                         Pack
//                       </button>
//                     )}
//                     {order.status === 'WAITING_SHIPMENT' && (
//                       <button onClick={() => onUpdateStatus(order.id, 'SHIPPED')} className="text-green-600 hover:text-green-800 text-xs font-bold uppercase transition">
//                         Ship
//                       </button>
//                     )}
//                   </td>
//                 )}
//               </tr>
//             ))}
//             {orders.length === 0 && (
//               <tr>
//                 <td colSpan={role === 'ADMIN' ? 6 : 5} className="px-6 py-12 text-center text-gray-500">
//                   No orders found.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default OrderTable;


//002
// import React from 'react';
// import { formatCurrency, formatDate } from '../utils/formatter';
// // สมมติว่าใช้ lucide-react สำหรับไอคอน (สามารถเปลี่ยนเป็น Heroicons หรืออื่นๆ ได้)
// import { Package, Truck, Inbox } from 'lucide-react';

// const OrderTable = ({ orders, role, onUpdateStatus }) => {
//   // ฟังก์ชันสีของ Badge
//   const getStatusStyle = (status) => {
//     switch (status) {
//       case 'PAID':
//         return { bg: 'bg-amber-100 text-amber-800', dot: 'bg-amber-500' };
//       case 'WAITING_SHIPMENT':
//         return { bg: 'bg-blue-100 text-blue-800', dot: 'bg-blue-500' };
//       case 'SHIPPED':
//         return { bg: 'bg-emerald-100 text-emerald-800', dot: 'bg-emerald-500' };
//       default:
//         return { bg: 'bg-gray-100 text-gray-800', dot: 'bg-gray-500' };
//     }
//   };

//   // ดึงตัวอักษรตัวแรกของชื่อมาทำ Avatar
//   const getInitial = (name) => name ? name.charAt(0).toUpperCase() : '?';

//   return (
//     <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
//       <div className="overflow-x-auto">
//         <table className="w-full text-left text-sm text-gray-600 whitespace-nowrap">
//           <thead className="bg-gray-50/50 text-gray-500 uppercase text-[11px] font-bold tracking-wider">
//             <tr>
//               <th className="px-6 py-4 border-b border-gray-100">Order No</th>
//               <th className="px-6 py-4 border-b border-gray-100">Date</th>
//               <th className="px-6 py-4 border-b border-gray-100">Customer</th>
//               <th className="px-6 py-4 border-b border-gray-100">Subtotal</th>
//               <th className="px-6 py-4 border-b border-gray-100">Status</th>
//               {role === 'ADMIN' && <th className="px-6 py-4 border-b border-gray-100 text-right">Actions</th>}
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-gray-50">
//             {orders.map(order => {
//               const statusStyle = getStatusStyle(order.status);

//               return (
//                 <tr key={order.id} className="hover:bg-gray-50/80 transition-all duration-200 group">
//                   {/* Order No */}
//                   <td className="px-6 py-4 font-semibold text-gray-900">
//                     #{order.orderNumber}
//                   </td>

//                   {/* Date */}
//                   <td className="px-6 py-4 text-gray-500">
//                     {formatDate(order.createdAt)}
//                   </td>

//                   {/* Customer with Avatar */}
//                   <td className="px-6 py-4">
//                     <div className="flex items-center gap-3">
//                       <div className="h-9 w-9 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs shrink-0 border border-indigo-100">
//                         {getInitial(order.customerName)}
//                       </div>
//                       <div>
//                         <div className="font-semibold text-gray-900">{order.customerName}</div>
//                         <div className="text-xs text-gray-500 mt-0.5">{order.customerPhone}</div>
//                       </div>
//                     </div>
//                   </td>

//                   {/* Subtotal */}
//                   <td className="px-6 py-4 text-gray-900 font-semibold">
//                     {formatCurrency(order.totalAmount || (order.sellingPrice * order.quantity))}
//                   </td>

//                   {/* Status Badge with Dot Indicator */}
//                   <td className="px-6 py-4">
//                     <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${statusStyle.bg}`}>
//                       <span className={`h-1.5 w-1.5 rounded-full ${statusStyle.dot}`}></span>
//                       {order.status.replace('_', ' ')}
//                     </span>
//                   </td>

//                   {/* Actions (Admin Only) */}
//                   {role === 'ADMIN' && (
//                     <td className="px-6 py-4">
//                       <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
//                         {order.status === 'PAID' && (
//                           <button
//                             onClick={() => onUpdateStatus(order.id, 'WAITING_SHIPMENT')}
//                             className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 rounded-lg text-xs font-bold transition-colors"
//                           >
//                             <Package size={14} />
//                             <span>PACK</span>
//                           </button>
//                         )}
//                         {order.status === 'WAITING_SHIPMENT' && (
//                           <button
//                             onClick={() => onUpdateStatus(order.id, 'SHIPPED')}
//                             className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 hover:text-emerald-700 rounded-lg text-xs font-bold transition-colors"
//                           >
//                             <Truck size={14} />
//                             <span>SHIP</span>
//                           </button>
//                         )}
//                       </div>
//                     </td>
//                   )}
//                 </tr>
//               );
//             })}

//             {/* Empty State */}
//             {orders.length === 0 && (
//               <tr>
//                 <td colSpan={role === 'ADMIN' ? 6 : 5} className="px-6 py-16">
//                   <div className="flex flex-col items-center justify-center text-center">
//                     <div className="bg-gray-50 p-4 rounded-full mb-3 text-gray-400">
//                       <Inbox size={32} />
//                     </div>
//                     <h3 className="text-sm font-semibold text-gray-900 mb-1">No orders yet</h3>
//                     <p className="text-sm text-gray-500">When you receive new orders, they will show up here.</p>
//                   </div>
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default OrderTable;


//003
import React from 'react';
import { formatCurrency, formatDate } from '../utils/formatter';
import { Package, Truck, Inbox } from 'lucide-react';

const OrderTable = ({ orders, role, onUpdateStatus }) => {
  // ฟังก์ชันสีของ Status และ "แถบสีด้านหน้าบล็อก (borderLeft)"
  const getStatusStyle = (status) => {
    switch (status) {
      case 'PAID':
        return { bg: 'bg-amber-100 text-amber-800', dot: 'bg-amber-500', borderLeft: 'border-l-amber-400' };
      case 'WAITING_SHIPMENT':
        return { bg: 'bg-blue-100 text-blue-800', dot: 'bg-blue-500', borderLeft: 'border-l-blue-400' };
      case 'SHIPPED':
        return { bg: 'bg-emerald-100 text-emerald-800', dot: 'bg-emerald-500', borderLeft: 'border-l-emerald-400' };
      default:
        return { bg: 'bg-gray-100 text-gray-800', dot: 'bg-gray-500', borderLeft: 'border-l-gray-300' };
    }
  };

  const getInitial = (name) => name ? name.charAt(0).toUpperCase() : '?';

  return (
    // เปลี่ยนพื้นหลังหลักเป็นสีเทาอ่อน เพื่อให้บล็อกสีขาวลอยโดดเด่นขึ้นมา
    <div className="bg-gray-50 p-4 sm:p-6 rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        {/* ใช้ border-separate และ border-spacing-y-3 เพื่อเว้นระยะห่างระหว่างแถวให้เป็นบล็อก */}
        <table className="w-full text-left text-sm text-gray-600 whitespace-nowrap border-separate border-spacing-y-3">
          <thead className="text-gray-500 uppercase text-[11px] font-bold tracking-wider">
            <tr>
              <th className="px-6 py-2">Order No</th>
              <th className="px-6 py-2">Date</th>
              <th className="px-6 py-2">Customer</th>
              <th className="px-6 py-2">Subtotal</th>
              <th className="px-6 py-2">Status</th>
              {role === 'ADMIN' && <th className="px-6 py-2 text-right">Actions</th>}
            </tr>
          </thead>

          <tbody>
            {orders.map(order => {
              const statusStyle = getStatusStyle(order.status);

              return (
                <tr
                  key={order.id}
                  // ทำพื้นหลังสีขาว มีเงา และเมื่อเอาเมาส์ชี้ เงาจะเข้มขึ้น
                  className="bg-white shadow-sm hover:shadow-md transition-shadow duration-200 group"
                >
                  {/* คอลัมน์แรก: ใส่ขอบมนด้านซ้าย และแถบสี (border-l-4) */}
                  <td className={`px-6 py-4 font-semibold text-gray-900 border-l-4 ${statusStyle.borderLeft} rounded-l-xl`}>
                    #{order.orderNumber}
                  </td>

                  <td className="px-6 py-4 text-gray-500">
                    {formatDate(order.createdAt)}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs shrink-0 border border-indigo-100">
                        {getInitial(order.customerName)}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{order.customerName}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{order.customerPhone}</div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-gray-900 font-semibold">
                    {formatCurrency(order.totalAmount || (order.sellingPrice * order.quantity))}
                  </td>

                  {/* คอลัมน์สถานะ: ถ้าไม่ใช่แอดมิน ให้ใส่ขอบมนด้านขวาที่คอลัมน์นี้ */}
                  <td className={`px-6 py-4 ${role !== 'ADMIN' ? 'rounded-r-xl' : ''}`}>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${statusStyle.bg}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${statusStyle.dot}`}></span>
                      {order.status.replace('_', ' ')}
                    </span>
                  </td>

                  {/* คอลัมน์แอดมิน: ใส่ขอบมนด้านขวาที่คอลัมน์นี้ */}
                  {role === 'ADMIN' && (
                    <td className="px-6 py-4 rounded-r-xl">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        {order.status === 'PAID' && (
                          <button
                            onClick={() => onUpdateStatus(order.id, 'WAITING_SHIPMENT')}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 rounded-lg text-xs font-bold transition-colors shadow-sm"
                          >
                            <Package size={14} />
                            <span>PACK</span>
                          </button>
                        )}
                        {order.status === 'WAITING_SHIPMENT' && (
                          <button
                            onClick={() => onUpdateStatus(order.id, 'SHIPPED')}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 hover:text-emerald-700 rounded-lg text-xs font-bold transition-colors shadow-sm"
                          >
                            <Truck size={14} />
                            <span>SHIP</span>
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              );
            })}

            {/* Empty State */}
            {orders.length === 0 && (
              <tr>
                <td colSpan={role === 'ADMIN' ? 6 : 5} className="px-6 py-16 bg-white rounded-xl shadow-sm border border-gray-100">
                  <div className="flex flex-col items-center justify-center text-center">
                    <div className="bg-gray-50 p-4 rounded-full mb-3 text-gray-400">
                      <Inbox size={32} />
                    </div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-1">No orders yet</h3>
                    <p className="text-sm text-gray-500">When you receive new orders, they will show up here.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderTable;