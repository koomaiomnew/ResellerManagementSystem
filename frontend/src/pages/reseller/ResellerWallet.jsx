import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
// 🌟 Import walletService ที่คุณเพิ่งสร้างมาใช้งาน
import { walletService } from '../../services/walletService';
import { formatCurrency, formatDate } from '../../utils/formatter';
import Loading from '../../components/Loading';

const ResellerWallet = () => {
  const { user } = useAuth();
  // ตั้งค่าเริ่มต้นให้ wallet เป็น object ที่มีโครงสร้างรอไว้เลย
  const [wallet, setWallet] = useState({ balance: 0, transactions: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWallet = async () => {
      try {
        setLoading(true);
        
        // 🌟 1. ยิง API 2 เส้นพร้อมกันเพื่อความรวดเร็ว
        const [balance, logData] = await Promise.all([
          walletService.getWalletBalance(user.id),
          walletService.getWalletLog(user.id)
        ]);

        // 🌟 2. นำข้อมูลประวัติมาเรียงลำดับจากใหม่ไปเก่า (เช็คเผื่อกรณี logData ไม่ใช่ Array ด้วย)
        const transactions = Array.isArray(logData) ? logData : [];
        const sortedTransactions = transactions.sort(
          (a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt)
        );

        // 🌟 3. อัปเดต State
        setWallet({
          balance: balance,
          transactions: sortedTransactions
        });

      } catch (err) {
        console.error("Fetch Wallet Error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) fetchWallet();
  }, [user]);

  if (loading) return <Loading />;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">My Wallet</h2>
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl shadow-lg p-8 text-white flex justify-between items-center">
          <div>
            <p className="text-blue-100 mb-2 font-medium">Available Balance</p>
            {/* แสดงยอดเงิน */}
            <h3 className="text-5xl font-bold tracking-tight">{formatCurrency(wallet.balance)}</h3>
          </div>
          <div className="hidden md:block opacity-75">
            <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-800">Transaction History</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {wallet.transactions.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No transactions yet.</div>
          ) : (
            wallet.transactions.map(tx => (
              <div key={tx.id} className="p-6 flex justify-between items-center hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18"></path></svg>
                  </div>
                  <div>
                    {/* 💡 เช็คชื่อตัวแปรที่รับมาจาก Backend ตรงนี้ด้วยนะครับ */}
                    <p className="font-bold text-gray-900">Profit from Order {tx.orderNumber || tx.orderId || tx.referenceId}</p>
                    <p className="text-sm text-gray-500">{formatDate(tx.date || tx.createdAt)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-green-600 text-lg">+{formatCurrency(tx.profit || tx.amount)}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ResellerWallet;