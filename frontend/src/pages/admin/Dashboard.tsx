import { 
  DollarSign, 
  TrendingUp, 
  ShoppingCart, 
  Users, 
  Clock, 
  UserPlus 
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

// ข้อมูลจำลองสำหรับวาดกราฟยอดขาย 7 วันย้อนหลัง
const salesData = [
  { name: 'จันทร์', sales: 4000, profit: 2400 },
  { name: 'อังคาร', sales: 3000, profit: 1398 },
  { name: 'พุธ', sales: 2000, profit: 9800 },
  { name: 'พฤหัส', sales: 2780, profit: 3908 },
  { name: 'ศุกร์', sales: 1890, profit: 4800 },
  { name: 'เสาร์', sales: 2390, profit: 3800 },
  { name: 'อาทิตย์', sales: 3490, profit: 4300 },
];

export default function Dashboard() {
  // ข้อมูลสรุปตัวเลขตามที่เอกสาร BA กำหนด
  const summaryCards = [
    { title: 'ยอดขายรวม (บาท)', value: '฿124,500', icon: <DollarSign size={24} />, color: 'text-indigo-600', bg: 'bg-indigo-100 dark:bg-indigo-900/30' },
    { title: 'กำไรรวมที่จ่ายตัวแทน', value: '฿42,800', icon: <TrendingUp size={24} />, color: 'text-emerald-600', bg: 'bg-emerald-100 dark:bg-emerald-900/30' },
    { title: 'ออเดอร์ทั้งหมด', value: '1,245', icon: <ShoppingCart size={24} />, color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/30' },
    { title: 'ออเดอร์รอดำเนินการ', value: '18', icon: <Clock size={24} />, color: 'text-orange-600', bg: 'bg-orange-100 dark:bg-orange-900/30' },
    { title: 'จำนวนตัวแทนทั้งหมด', value: '142', icon: <Users size={24} />, color: 'text-purple-600', bg: 'bg-purple-100 dark:bg-purple-900/30' },
    { title: 'ตัวแทนรออนุมัติ', value: '5', icon: <UserPlus size={24} />, color: 'text-pink-600', bg: 'bg-pink-100 dark:bg-pink-900/30' },
  ];

  return (
    <div className="space-y-6">
      {/* ส่วน Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">ภาพรวมระบบ (Dashboard)</h1>
        <p className="text-gray-500 dark:text-gray-400">สรุปข้อมูลยอดขายและตัวแทนจำหน่ายทั้งหมด</p>
      </div>

      {/* Grid สำหรับการ์ดสรุปผล 6 ใบ */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {summaryCards.map((card, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 flex items-center gap-4">
            <div className={`p-4 rounded-lg ${card.bg} ${card.color}`}>
              {card.icon}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{card.title}</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{card.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* ส่วนของกราฟ Recharts */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">สถิติยอดขายย้อนหลัง 7 วัน</h3>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={salesData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
              <XAxis dataKey="name" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `฿${value}`} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1f2937', color: '#f3f4f6', borderRadius: '8px', border: 'none' }}
                itemStyle={{ color: '#f3f4f6' }}
              />
              <Line type="monotone" dataKey="sales" name="ยอดขาย" stroke="#4F46E5" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="profit" name="กำไร" stroke="#10B981" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}