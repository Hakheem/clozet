"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Store,
  Package,
  ShoppingBag,
  TrendingUp,
  DollarSign,
  Activity,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";

const COLORS = ['#BFA47A', '#1C1A17', '#8A857D', '#E4E0D9', '#22C55E', '#EF4444'];

export default function AdminDashboard({ stats }: { stats: any }) {
  const summaryStats = [
    {
      title: "Total Revenue",
      value: `KES ${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      href: "/admin/payouts",
    },
    {
      title: "Active Sellers",
      value: stats.totalSellers.toString(),
      icon: Store,
      href: "/admin/sellers",
    },
    {
      title: "Total Products",
      value: stats.totalProducts.toString(),
      icon: Package,
      href: "/admin/products",
    },
    {
      title: "Orders",
      value: stats.totalOrders.toString(),
      icon: ShoppingBag,
      href: "/admin/orders",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryStats.map((stat) => (
          <Link key={stat.title} href={stat.href}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium" style={{ color: "#8A857D" }}>
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4" style={{ color: "#BFA47A" }} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" style={{ color: "#1C1A17" }}>
                  {stat.value}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Area Chart */}
        <Card className="p-4">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <TrendingUp className="h-5 w-5" style={{ color: "#BFA47A" }} />
              Revenue Growth (Last 7 Days)
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#BFA47A" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#BFA47A" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E4E0D9" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#8A857D', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#8A857D', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{borderRadius: '8px', border: '1px solid #E4E0D9', boxShadow: '0 4px 12px rgba(0,0,0,0.05)'}}
                  labelStyle={{fontWeight: 'bold', color: '#1C1A17'}}
                />
                <Area type="monotone" dataKey="revenue" stroke="#BFA47A" fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Order Distribution Pie Chart */}
        <Card className="p-4">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Activity className="h-5 w-5" style={{ color: "#BFA47A" }} />
              Order Status Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.orderDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {stats.orderDistribution.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend layout="vertical" align="right" verticalAlign="middle" iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions and Activity could be added back here if desired */}
    </div>
  );
}
