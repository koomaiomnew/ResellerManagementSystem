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

  useEffect(() => { fetchResellers(); }, []);

  const handleApprove = async (id) => {
    try {
      await resellerService.approveReseller(id);
      showToast('Reseller approved!');
      fetchResellers();
    } catch (err) { showToast('Operation failed', 'error'); }
  };

  const handleReject = async (id) => {
    if(window.confirm('Are you sure you want to reject this reseller?')) {
      try {
        await resellerService.rejectReseller(id);
        showToast('Reseller rejected');
        fetchResellers();
      } catch (err) { showToast('Operation failed', 'error'); }
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
              {resellers.map(reseller => {
                const currentStatus = reseller.status ? reseller.status.toUpperCase() : 'PENDING';
                return (
                  <tr key={reseller.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-gray-900">{reseller.name}</td>
                    <td className="px-6 py-4 text-gray-900">{reseller.shopName || '-'}</td>
                    <td className="px-6 py-4 text-gray-500">{reseller.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold
                        ${currentStatus === 'APPROVED' ? 'bg-green-100 text-green-800' : 
                          currentStatus === 'REJECTED' ? 'bg-red-100 text-red-800' : 
                          'bg-yellow-100 text-yellow-800'}
                      `}>
                        {currentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 flex justify-end gap-3">
                      {(currentStatus === 'PENDING') && (
                        <>
                          <button onClick={() => handleApprove(reseller.id)} className="text-green-600 hover:text-green-800 font-bold">Approve</button>
                          <button onClick={() => handleReject(reseller.id)} className="text-red-600 hover:text-red-800 font-bold">Reject</button>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminResellers;