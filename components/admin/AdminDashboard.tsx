"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Users,
  Store,
  Package,
  ShoppingBag,
  TrendingUp,
  DollarSign,
  Activity,
  AlertCircle,
  Search,
} from "lucide-react";
import Link from "next/link";
import { useState, useMemo } from "react";
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
  Legend,
  BarChart,
  Bar
} from "recharts";

const COLORS = ['#BFA47A', '#22C55E', '#8A857D', '#E4E0D9', '#1C1A17', '#EF4444'];

export default function AdminDashboard({ stats }: { stats: any }) {
  const [orderSearch, setOrderSearch] = useState("");

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

  // Filter recent orders
  const filteredOrders = useMemo(() => {
    return (stats.recentOrders || []).filter((order: any) =>
      order.buyer.name.toLowerCase().includes(orderSearch.toLowerCase()) ||
      order.buyer.email.toLowerCase().includes(orderSearch.toLowerCase()) ||
      order.id.toLowerCase().includes(orderSearch.toLowerCase())
    );
  }, [orderSearch, stats.recentOrders]);

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
                    <stop offset="5%" stopColor="#BFA47A" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#BFA47A" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E4E0D9" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#8A857D', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#8A857D', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ borderRadius: '8px', border: '1px solid #E4E0D9', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                  labelStyle={{ fontWeight: 'bold', color: '#1C1A17' }}
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

      {/* Recent Orders Table */}
      <Card className="p-4">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" style={{ color: "#BFA47A" }} />
            Recent Orders
          </CardTitle>
          <div className="mt-4 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by order ID, customer name, or email..."
              value={orderSearch}
              onChange={(e) => setOrderSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: "1px solid #E4E0D9" }}>
                  <th className="text-left py-3 px-4 font-semibold" style={{ color: "#8A857D" }}>Order ID</th>
                  <th className="text-left py-3 px-4 font-semibold" style={{ color: "#8A857D" }}>Customer</th>
                  <th className="text-left py-3 px-4 font-semibold" style={{ color: "#8A857D" }}>Items</th>
                  <th className="text-left py-3 px-4 font-semibold" style={{ color: "#8A857D" }}>Status</th>
                  <th className="text-left py-3 px-4 font-semibold" style={{ color: "#8A857D" }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.slice(0, 8).map((order: any) => (
                  <tr key={order.id} style={{ borderBottom: "1px solid #E4E0D9" }}>
                    <td className="py-3 px-4">
                      <Link href={`/admin/orders`} className="text-[#BFA47A] hover:underline font-medium">
                        {order.id.slice(0, 8)}...
                      </Link>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p style={{ color: "#1C1A17" }}>{order.buyer.name}</p>
                        <p style={{ color: "#8A857D" }} className="text-xs">{order.buyer.email}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-xs space-y-1">
                        {order.items.slice(0, 2).map((item: any) => (
                          <div key={item.product.name} style={{ color: "#1C1A17" }}>
                            {item.product.name} x {item.quantity}
                          </div>
                        ))}
                        {order.items.length > 2 && (
                          <div style={{ color: "#8A857D" }}>+{order.items.length - 2} more</div>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge style={{ background: order.status === "DELIVERED" ? "#22C55E" : "#BFA47A", color: "white" }}>
                        {order.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 font-medium" style={{ color: "#1C1A17" }}>
                      KES {order.total.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Best Selling Products */}
      <Card className="p-4">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <TrendingUp className="h-5 w-5" style={{ color: "#BFA47A" }} />
            Best-Selling Products
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {(stats.bestSellingProducts || []).slice(0, 5).map((product: any) => (
              <Link key={product.id} href={`/shop?product=${product.id}`}>
                <div className="group cursor-pointer">
                  <div className="mb-3 rounded-lg overflow-hidden h-32 bg-gray-100">
                    {product.images?.[0] && (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    )}
                  </div>
                  <h4 className="font-semibold text-sm truncate" style={{ color: "#1C1A17" }}>
                    {product.name}
                  </h4>
                  <p className="text-xs mb-2" style={{ color: "#8A857D" }}>
                    {product.seller?.shopName || "Unknown Seller"}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="font-bold" style={{ color: "#BFA47A" }}>
                      {product.quantitySold} sold
                    </span>
                    <span className="text-xs" style={{ color: "#8A857D" }}>
                      KES {product.totalRevenue.toLocaleString()}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
