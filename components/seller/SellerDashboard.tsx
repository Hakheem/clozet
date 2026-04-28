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
  Clock,
  CheckCircle,
  Wallet,
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
} from "recharts";

export default function SellerDashboard({ stats }: { stats: any }) {
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

      {/* Chart */}
      <Card className="p-4">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <TrendingUp className="h-5 w-5" style={{ color: "#BFA47A" }} />
            Earnings from Completed Orders (Last 7 Days)
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={stats.salesData}>
              <defs>
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
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
              <Area type="monotone" dataKey="sales" stroke="#BFA47A" fillOpacity={1} fill="url(#colorSales)" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

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
