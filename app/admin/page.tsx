// ─────────────────────────────────────────────────────────────────────────────
// FILE: app/admin/page.tsx
//
// Admin dashboard page.
// Shows overview stats, recent activity, quick actions.
//
// Related files:
//   app/admin/layout.tsx → provides sidebar + auth
// ─────────────────────────────────────────────────────────────────────────────

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

// ─── Mock data (replace with real data later) ──────────────────────────────────

const stats = [
  {
    title: "Total Users",
    value: "1,234",
    change: "+12%",
    icon: Users,
    href: "/admin/users",
  },
  {
    title: "Active Sellers",
    value: "89",
    change: "+5%",
    icon: Store,
    href: "/admin/sellers",
  },
  {
    title: "Products",
    value: "2,456",
    change: "+23%",
    icon: Package,
    href: "/admin/products",
  },
  {
    title: "Orders",
    value: "567",
    change: "+18%",
    icon: ShoppingBag,
    href: "/admin/orders",
  },
];

const recentActivity = [
  {
    type: "order",
    message: "New order #1234 placed by John Doe",
    time: "2 minutes ago",
    status: "pending",
  },
  {
    type: "user",
    message: "New seller Jane Smith registered",
    time: "15 minutes ago",
    status: "active",
  },
  {
    type: "product",
    message: "Product 'Summer Dress' was updated",
    time: "1 hour ago",
    status: "updated",
  },
  {
    type: "order",
    message: "Order #1230 was fulfilled",
    time: "2 hours ago",
    status: "completed",
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminDashboardPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold" style={{ color: "#1C1A17" }}>
          Dashboard
        </h1>
        <p className="text-sm mt-1" style={{ color: "#8A857D" }}>
          Welcome back! Here's what's happening with your store.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
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
                <div className="flex items-center text-xs" style={{ color: "#22C55E" }}>
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {stat.change} from last month
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" style={{ color: "#BFA47A" }} />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-0">
                <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                  style={{ background: "#BFA47A" }} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm" style={{ color: "#1C1A17" }}>
                    {activity.message}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs" style={{ color: "#8A857D" }}>
                      {activity.time}
                    </span>
                    <Badge
                      variant="outline"
                      className="text-xs"
                      style={{
                        borderColor:
                          activity.status === "pending" ? "#F59E0B" :
                            activity.status === "active" ? "#22C55E" :
                              activity.status === "completed" ? "#22C55E" : "#8A857D",
                        color:
                          activity.status === "pending" ? "#F59E0B" :
                            activity.status === "active" ? "#22C55E" :
                              activity.status === "completed" ? "#22C55E" : "#8A857D",
                      }}
                    >
                      {activity.status}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" style={{ color: "#BFA47A" }} />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link
              href="/admin/products"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Package className="h-4 w-4" style={{ color: "#BFA47A" }} />
              <span className="text-sm font-medium" style={{ color: "#1C1A17" }}>
                Manage Products
              </span>
            </Link>
            <Link
              href="/admin/content"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Store className="h-4 w-4" style={{ color: "#BFA47A" }} />
              <span className="text-sm font-medium" style={{ color: "#1C1A17" }}>
                Update Content
              </span>
            </Link>
            <Link
              href="/admin/users"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Users className="h-4 w-4" style={{ color: "#BFA47A" }} />
              <span className="text-sm font-medium" style={{ color: "#1C1A17" }}>
                View Users
              </span>
            </Link>
            <Link
              href="/admin/orders"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <ShoppingBag className="h-4 w-4" style={{ color: "#BFA47A" }} />
              <span className="text-sm font-medium" style={{ color: "#1C1A17" }}>
                Process Orders
              </span>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

