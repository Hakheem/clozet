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
  Clock,
  CheckCircle,
  Wallet,
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
} from "recharts";

export default function SellerDashboard({ stats }: { stats: any }) {
  const [orderSearch, setOrderSearch] = useState("");

  const summaryStats = [
    {
      title: "Lifetime Earnings",
      value: `KES ${(stats.lifetimeEarnings || 0).toLocaleString()}`,
      icon: DollarSign,
      href: "/seller/earnings",
    },
    {
      title: "Available Balance",
      value: `KES ${(stats.availableBalance || 0).toLocaleString()}`,
      icon: Wallet,
      href: "/seller/earnings",
      subtitle: stats.availableBalance < 700
        ? `KES ${(700 - (stats.availableBalance || 0)).toLocaleString()} more to withdraw`
        : "Ready to withdraw",
    },
    {
      title: "Orders Received",
      value: stats.ordersCount.toString(),
      icon: ShoppingBag,
      href: "/seller/orders",
    },
    {
      title: "My Products",
      value: stats.myProductsCount.toString(),
      icon: Package,
      href: "/seller/products",
    },
  ];

  // Filter recent orders
  const filteredOrders = useMemo(() => {
    return (stats.recentSellerOrders || []).filter((order: any) =>
      order.buyer.name.toLowerCase().includes(orderSearch.toLowerCase()) ||
      order.buyer.email.toLowerCase().includes(orderSearch.toLowerCase()) ||
      order.buyer.phoneNumber?.toLowerCase().includes(orderSearch.toLowerCase()) ||
      order.id.toLowerCase().includes(orderSearch.toLowerCase())
    );
  }, [orderSearch, stats.recentSellerOrders]);

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
                {stat.subtitle && (
                  <p className="text-[10px] text-orange-500 mt-1">{stat.subtitle}</p>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Recent Orders Table */}
      <Card className="p-4">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" style={{ color: "#BFA47A" }} />
            Recent Orders from Your Customers
          </CardTitle>
          <div className="mt-4 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by order ID, customer name, email, or phone..."
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
                  <th className="text-left py-3 px-4 font-semibold" style={{ color: "#8A857D" }}>Phone</th>
                  <th className="text-left py-3 px-4 font-semibold" style={{ color: "#8A857D" }}>Products</th>
                  <th className="text-left py-3 px-4 font-semibold" style={{ color: "#8A857D" }}>Location</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.slice(0, 8).map((order: any) => (
                  <tr key={order.id} style={{ borderBottom: "1px solid #E4E0D9" }}>
                    <td className="py-3 px-4">
                      <Link href={`/seller/orders`} className="text-[#BFA47A] hover:underline font-medium">
                        {order.id.slice(0, 8)}...
                      </Link>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p style={{ color: "#1C1A17" }}>{order.buyer.name}</p>
                        <p style={{ color: "#8A857D" }} className="text-xs">{order.buyer.email}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4" style={{ color: "#1C1A17" }}>
                      {order.buyer.phoneNumber || "—"}
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
                    <td className="py-3 px-4 text-xs" style={{ color: "#8A857D" }}>
                      {order.deliveryAddress?.city || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Charts Row: Earnings Chart (3) + Best Selling Products (1) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Earnings Chart - spans 3 */}
        <Card className="px-2 py-4 lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <TrendingUp className="h-5 w-5" style={{ color: "#BFA47A" }} />
              Earnings from Completed Orders (Last 7 Days)
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.salesData}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
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
                <Area type="monotone" dataKey="sales" stroke="#BFA47A" fillOpacity={1} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Best Selling Products Table - spans 1 */}
        <Card className=" py-4 lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <TrendingUp className="h-5 w-5" style={{ color: "#BFA47A" }} />
              Top Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {(stats.bestSellingSellerProducts || []).slice(0, 5).map((product: any, index: number) => (
                <Link key={product.id} href={`/seller/products/${product.id}`}>
                  <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors group">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      {product.images?.[0] && (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-xs truncate" style={{ color: "#1C1A17" }}>
                        {product.name}
                      </p>
                      <p className="text-xs font-bold" style={{ color: "#BFA47A" }}>
                        {product.quantitySold} sold
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Clock className="h-5 w-5" style={{ color: "#BFA47A" }} />
              Payout Policy
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-gray-600 space-y-2">
            <p>• Funds are held for <strong>48 hours</strong> after delivery is confirmed to ensure buyer satisfaction.</p>
            <p>• Minimum withdrawal amount is <strong>KES 700</strong>.</p>
            <p>• Make sure your payout details are up to date in settings.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <CheckCircle className="h-5 w-5" style={{ color: "#BFA47A" }} />
              Quick Tips
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-gray-600 space-y-2">
            <p>• Mark orders as <strong>Shipped</strong> as soon as you dispatch them.</p>
            <p>• Good customer service leads to fewer disputes and faster payouts.</p>
            <p>• Keep your inventory updated to avoid cancellations.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

