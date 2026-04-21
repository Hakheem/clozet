"use client";

import { 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight,
  Wallet,
  Calendar,
  Download,
  History,
  CreditCard
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { motion } from "framer-motion";

const monthlyData = [
  { month: 'Jan', amount: 45000 },
  { month: 'Feb', amount: 52000 },
  { month: 'Mar', amount: 48000 },
  { month: 'Apr', amount: 61000 },
  { month: 'May', amount: 55000 },
  { month: 'Jun', amount: 67000 },
];

const COLORS = ['#BFA47A', '#1C1A17', '#8A857D', '#E4E0D9'];

const PayoutStats = [
  { 
    label: "Available for Payout", 
    value: "KES 42,300", 
    icon: Wallet,
    color: "#BFA47A"
  },
  { 
    label: "Pending Clearance", 
    value: "KES 12,800", 
    icon: Calendar,
    color: "#1C1A17"
  },
  { 
    label: "Total Earned", 
    value: "KES 348,000", 
    icon: TrendingUp,
    color: "#8A857D"
  },
];

export default function EarningsPage() {
  return (
    <div className="p-8 space-y-10 min-h-full">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#BFA47A]">
            — Financial Hub
          </p>
          <h1 className="text-4xl font-light text-[#1C1A17] title">
            Earnings & <span className="font-normal">Payouts</span>
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-5 py-2.5 bg-[#1C1A17] text-[#EDE8DF] rounded-full text-xs font-bold uppercase tracking-widest hover:bg-[#2C2A27] transition-all shadow-lg shadow-black/5">
            <Download className="w-3.5 h-3.5" />
            Export Statement
          </button>
        </div>
      </header>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {PayoutStats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-2xl border border-[#E4E0D9] shadow-sm group hover:border-[#BFA47A] transition-all"
          >
            <div className="p-2.5 w-fit rounded-xl bg-[#F7F5F2] mb-4 group-hover:bg-[#BFA47A]/10 transition-colors">
              <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
            </div>
            <p className="text-xs uppercase tracking-widest text-[#8A857D] font-medium">{stat.label}</p>
            <h3 className="text-2xl font-bold text-[#1C1A17] mt-1">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-[#E4E0D9] shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div className="space-y-0.5">
              <h4 className="text-sm font-bold text-[#1C1A17] uppercase tracking-wider">Revenue Growth</h4>
              <p className="text-[10px] text-[#8A857D] uppercase font-medium">Monthly Earnings Overview</p>
            </div>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F0F0" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#8A857D', fontWeight: 600 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#8A857D', fontWeight: 600 }}
                />
                <Tooltip 
                  cursor={{ fill: '#F7F5F2' }}
                  contentStyle={{ 
                    borderRadius: '12px', 
                    border: '1px solid #E4E0D9', 
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                    fontSize: '12px'
                  }} 
                />
                <Bar 
                  dataKey="amount" 
                  fill="#1C1A17" 
                  radius={[4, 4, 0, 0]}
                  barSize={40}
                >
                  {monthlyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === monthlyData.length - 1 ? '#BFA47A' : '#1C1A17'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Payout Info Sidebar */}
        <div className="space-y-6">
          <div className="bg-[#1C1A17] p-8 rounded-3xl text-[#EDE8DF]">
            <div className="flex items-center justify-between mb-8">
              <h4 className="text-sm font-bold uppercase tracking-wider">Payout Method</h4>
              <button className="text-[10px] font-bold text-[#BFA47A] uppercase tracking-widest hover:underline">Edit</button>
            </div>
            
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 mb-8">
              <div className="w-10 h-10 rounded-full bg-[#BFA47A] flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-[#1C1A17]" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-white">Mpesa Number</p>
                <p className="text-xs text-[#8A857D]">+254 712 *** 789</p>
              </div>
            </div>

            <Button className="w-full bg-[#BFA47A] hover:bg-[#B09366] text-[#1C1A17] h-12 text-[10px] font-black uppercase tracking-[0.2em]">
              Request Manual Payout
            </Button>
          </div>

          <div className="bg-[#F7F5F2] p-8 rounded-3xl border border-[#E4E0D9]">
            <h4 className="text-xs font-bold text-[#1C1A17] uppercase tracking-widest mb-4">Payout Schedule</h4>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#BFA47A]" />
                <p className="text-[10px] font-medium text-[#8A857D] uppercase tracking-wider">Payments processed every Monday</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#BFA47A]" />
                <p className="text-[10px] font-medium text-[#8A857D] uppercase tracking-wider">Minimum payout threshold: KES 1,000</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payout History Table */}
      <div className="bg-white rounded-3xl border border-[#E4E0D9] shadow-sm overflow-hidden">
        <div className="p-6 border-b border-[#F7F5F2] flex items-center gap-3 text-[#1C1A17]">
          <History className="w-4 h-4" />
          <h4 className="text-sm font-bold uppercase tracking-wider">Payout History</h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#F7F5F2]/50">
                <th className="px-6 py-4 text-left text-[10px] uppercase tracking-widest text-[#8A857D] font-bold">Transaction ID</th>
                <th className="px-6 py-4 text-left text-[10px] uppercase tracking-widest text-[#8A857D] font-bold">Date</th>
                <th className="px-6 py-4 text-left text-[10px] uppercase tracking-widest text-[#8A857D] font-bold">Method</th>
                <th className="px-6 py-4 text-left text-[10px] uppercase tracking-widest text-[#8A857D] font-bold">Amount</th>
                <th className="px-6 py-4 text-left text-[10px] uppercase tracking-widest text-[#8A857D] font-bold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F7F5F2]">
              {[1, 2, 3].map((payout) => (
                <tr key={payout} className="hover:bg-[#F7F5F2]/30 transition-colors">
                  <td className="px-6 py-4 text-xs font-bold text-[#1C1A17]">TXN-9023{payout}</td>
                  <td className="px-6 py-4 text-xs text-[#8A857D] font-medium">May {15 + payout}, 2024</td>
                  <td className="px-6 py-4 text-xs text-[#1C1A17] font-medium">Mpesa</td>
                  <td className="px-6 py-4 text-xs font-bold text-[#1C1A17]">KES 12,500</td>
                  <td className="px-6 py-4">
                    <span className="inline-block px-2 py-1 rounded bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase tracking-tight">Completed</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
