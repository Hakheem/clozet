"use client";

import { useSession } from "@/lib/auth-client";
import { 
  TrendingUp, 
  ShoppingBag, 
  Users, 
  ArrowUpRight, 
  ArrowDownRight,
  Plus,
  Package,
  Layers,
  ExternalLink
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import Link from "next/link";
import { motion } from "framer-motion";

const data = [
  { name: 'Mon', sales: 4000 },
  { name: 'Tue', sales: 3000 },
  { name: 'Wed', sales: 5000 },
  { name: 'Thu', sales: 2780 },
  { name: 'Fri', sales: 1890 },
  { name: 'Sat', sales: 2390 },
  { name: 'Sun', sales: 3490 },
];

const stats = [
  { 
    label: "Gross Revenue", 
    value: "KES 124,500", 
    change: "+12.5%", 
    trend: "up", 
    icon: TrendingUp,
    color: "#BFA47A"
  },
  { 
    label: "Total Orders", 
    value: "48", 
    change: "+4.2%", 
    trend: "up", 
    icon: ShoppingBag,
    color: "#1C1A17"
  },
  { 
    label: "Shop Visits", 
    value: "1,204", 
    change: "-2.1%", 
    trend: "down", 
    icon: Users,
    color: "#8A857D"
  },
];

export default function SellerDashboard() {
  const { data: session } = useSession();
  const userName = session?.user?.name || "Seller";

  return (
    <div className="p-8 space-y-10 min-h-full">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#BFA47A]">
            — Merchant Overview
          </p>
          <h1 className="text-4xl font-light text-[#1C1A17] title">
            Welcome back, <span className="font-normal">{userName}</span>
          </h1>
        </div>
        <div className="flex items-center gap-3">
           <Link 
            href="/seller/products/new"
            className="flex items-center gap-2 px-5 py-2.5 bg-[#1C1A17] text-[#EDE8DF] rounded-full text-xs font-bold uppercase tracking-widest hover:bg-[#2C2A27] transition-all shadow-lg shadow-black/5"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Product
          </Link>
          <button className="p-2.5 border border-[#E4E0D9] rounded-full hover:bg-white transition-colors">
            <ExternalLink className="w-4 h-4 text-[#8A857D]" />
          </button>
        </div>
      </header>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-2xl border border-[#E4E0D9] shadow-sm group hover:border-[#BFA47A] transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-2.5 rounded-xl bg-[#F7F5F2] group-hover:bg-[#BFA47A]/10 transition-colors">
                <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
              </div>
              <div className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full ${stat.trend === "up" ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"}`}>
                {stat.trend === "up" ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {stat.change}
              </div>
            </div>
            <p className="text-xs uppercase tracking-widest text-[#8A857D] font-medium">{stat.label}</p>
            <h3 className="text-2xl font-bold text-[#1C1A17] mt-1">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      {/* Visualizations Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sales Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-[#E4E0D9] shadow-sm overflow-hidden relative">
           <div className="flex items-center justify-between mb-8">
            <div className="space-y-0.5">
              <h4 className="text-sm font-bold text-[#1C1A17] uppercase tracking-wider">Sales Analytics</h4>
              <p className="text-[10px] text-[#8A857D] uppercase font-medium">Performance over last 7 days</p>
            </div>
            <select className="text-[10px] uppercase font-bold tracking-widest bg-transparent border-none focus:outline-none text-[#BFA47A] cursor-pointer">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#BFA47A" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#BFA47A" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F0F0" />
                <XAxis 
                  dataKey="name" 
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
                  contentStyle={{ 
                    borderRadius: '12px', 
                    border: '1px solid #E4E0D9', 
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                    fontSize: '12px'
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="sales" 
                  stroke="#BFA47A" 
                  strokeWidth={2.5}
                  fillOpacity={1} 
                  fill="url(#colorSales)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Actions / Recent Activity */}
        <div className="bg-[#1C1A17] p-8 rounded-3xl shadow-xl shadow-black/10 flex flex-col justify-between">
          <div className="space-y-6">
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-[#EDE8DF] uppercase tracking-wider">Inventory Status</h4>
              <p className="text-[10px] text-[#8A857D] uppercase font-medium">Quick Health Check</p>
            </div>

            <div className="space-y-4">
              {[
                { label: "Active Listings", count: "24", icon: Package },
                { label: "Low Stock Alert", count: "3", icon: Layers, warn: true },
                { label: "Pending Orders", count: "5", icon: ShoppingBag },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 group hover:bg-white/10 transition-all">
                  <div className="flex items-center gap-3">
                    <item.icon className={`w-4 h-4 ${item.warn ? "text-amber-500" : "text-[#BFA47A]"}`} />
                    <span className="text-[10px] font-bold text-[#EDE8DF] uppercase tracking-widest">{item.label}</span>
                  </div>
                  <span className={`text-xs font-bold ${item.warn ? "text-amber-500" : "text-white"}`}>{item.count}</span>
                </div>
              ))}
            </div>
          </div>

          <Link 
            href="/seller/products"
            className="w-full py-4 mt-8 bg-[#BFA47A] text-[#1C1A17] rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-center hover:bg-[#B09366] transition-all"
          >
            Manage All Inventory
          </Link>
        </div>
      </div>

      {/* Recent Orders Table Skeleton */}
      <div className="bg-white rounded-3xl border border-[#E4E0D9] shadow-sm overflow-hidden">
        <div className="p-6 border-b border-[#F7F5F2] flex items-center justify-between">
          <h4 className="text-sm font-bold text-[#1C1A17] uppercase tracking-wider">Recent Orders</h4>
          <Link href="/seller/orders" className="text-[10px] font-bold text-[#BFA47A] uppercase tracking-widest hover:underline">View All</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#F7F5F2]/50">
                <th className="px-6 py-4 text-left text-[10px] uppercase tracking-widest text-[#8A857D] font-bold">Order ID</th>
                <th className="px-6 py-4 text-left text-[10px] uppercase tracking-widest text-[#8A857D] font-bold">Customer</th>
                <th className="px-6 py-4 text-left text-[10px] uppercase tracking-widest text-[#8A857D] font-bold">Status</th>
                <th className="px-6 py-4 text-left text-[10px] uppercase tracking-widest text-[#8A857D] font-bold">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F7F5F2]">
              {[1, 2, 3].map((order) => (
                <tr key={order} className="hover:bg-[#F7F5F2]/30 transition-colors">
                  <td className="px-6 py-4 text-xs font-bold text-[#1C1A17]">#LUK-{1000 + order}</td>
                  <td className="px-6 py-4 text-xs text-[#8A857D] font-medium">Customer Name</td>
                  <td className="px-6 py-4 line-clamp-1">
                    <span className="inline-block px-2 py-1 rounded bg-amber-50 text-amber-600 text-[10px] font-bold uppercase tracking-tight">Pending</span>
                  </td>
                  <td className="px-6 py-4 text-xs font-bold text-[#1C1A17]">KES 4,500</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
