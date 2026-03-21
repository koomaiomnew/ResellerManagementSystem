import React, { useState, useEffect } from 'react';
import { resellerService } from '../../services/resellerService';
import Loading from '../../components/Loading';
import { showToast } from '../../components/Toast';

const AdminResellers = () => {
  const [resellers, setResellers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchResellers = async () => {
    setLoading(true);
    try {
      const data = await resellerService.getAllResellers();
      setResellers(data);
    } catch (err) {
      showToast('Failed to load resellers', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchResellers(); 
  }, []);

  const handleApprove = async (id) => {
    if (!id) return showToast('User ID is missing', 'error');
    
    try {
      await resellerService.approveReseller(id);
      showToast('Reseller approved successfully!', 'success');
      fetchResellers(); // ดึงข้อมูลใหม่หลังจากอนุมัติเสร็จ
    } catch (err) { 
      showToast(err.message || 'Operation failed', 'error'); 
    }
  };

  const handleReject = async (id) => {
    if (!id) return showToast('User ID is missing', 'error');

    if(window.confirm('Are you sure you want to reject this reseller?')) {
      try {
        await resellerService.rejectReseller(id);
        showToast('Reseller rejected', 'success');
        fetchResellers(); // ดึงข้อมูลใหม่
      } catch (err) { 
        showToast(err.message || 'Operation failed', 'error'); 
      }
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Manage Resellers</h2>
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-800 uppercase text-xs font-semibold">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Shop Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium">
              {resellers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    No resellers found.
                  </td>
                </tr>
              ) : (
                resellers.map(reseller => {
                  // เช็กว่า Backend ส่ง id หรือ userId มา
                  const rowId = reseller.userId || reseller.id; 
                  const currentStatus = reseller.status ? reseller.status.toLowerCase() : 'pending';

                  return (
                    <tr key={rowId} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-bold text-gray-900">{reseller.name}</td>
                      <td className="px-6 py-4 text-gray-900">{reseller.shopName || '-'}</td>
                      <td className="px-6 py-4 text-gray-500">{reseller.email}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase
                          ${currentStatus === 'approved' ? 'bg-green-100 text-green-800' : 
                            currentStatus === 'rejected' ? 'bg-red-100 text-red-800' : 
                            'bg-yellow-100 text-yellow-800'}
                        `}>
                          {currentStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 flex justify-end gap-3">
                        {/* โชว์ปุ่มเฉพาะตอนที่สถานะยังเป็น pending */}
                        {(currentStatus === 'pending') && (
                          <>
                            <button 
                              onClick={() => handleApprove(rowId)} 
                              className="text-green-600 hover:text-green-800 font-bold px-2 py-1 rounded hover:bg-green-50 transition-colors"
                            >
                              Approve
                            </button>
                            <button 
                              onClick={() => handleReject(rowId)} 
                              className="text-red-600 hover:text-red-800 font-bold px-2 py-1 rounded hover:bg-red-50 transition-colors"
                            >
                              Reject
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminResellers;