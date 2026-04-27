import { getAdminDashboardStats } from "@/actions/dashboard";
import AdminDashboard from "@/components/admin/AdminDashboard";
import { AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Package, Store, Users, ShoppingBag } from "lucide-react";

export const metadata = {
  title: "Admin Dashboard | Lukuu",
};

export default async function AdminDashboardPage() {
  const result = await getAdminDashboardStats();

  if (!result.success || !result.stats) {
    return (
      <div className="p-6">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          <p>Error loading dashboard: {result.error}</p>
        </div>
      </div>
    );
  }

  const { stats } = result;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold" style={{ color: "#1C1A17" }}>
          Dashboard
        </h1>
        <p className="text-sm mt-1" style={{ color: "#8A857D" }}>
          Welcome back! Here's what's happening across the platform.
        </p>
      </div>

      <AdminDashboard stats={stats} />

      {/* Main Content Grid for secondary info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" style={{ color: "#BFA47A" }} />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link
              href="/admin/products"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-[#E4E0D9]"
            >
              <Package className="h-4 w-4" style={{ color: "#BFA47A" }} />
              <span className="text-sm font-medium" style={{ color: "#1C1A17" }}>
                Manage Products
              </span>
            </Link>
            <Link
              href="/admin/content"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-[#E4E0D9]"
            >
              <Store className="h-4 w-4" style={{ color: "#BFA47A" }} />
              <span className="text-sm font-medium" style={{ color: "#1C1A17" }}>
                Update Content
              </span>
            </Link>
            <Link
              href="/admin/users"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-[#E4E0D9]"
            >
              <Users className="h-4 w-4" style={{ color: "#BFA47A" }} />
              <span className="text-sm font-medium" style={{ color: "#1C1A17" }}>
                View Users
              </span>
            </Link>
            <Link
              href="/admin/orders"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-[#E4E0D9]"
            >
              <ShoppingBag className="h-4 w-4" style={{ color: "#BFA47A" }} />
              <span className="text-sm font-medium" style={{ color: "#1C1A17" }}>
                Process Orders
              </span>
            </Link>
          </CardContent>
        </Card>

        {/* Note from user: User pages, sellers, orders, payouts and all, even settings with dynamic data and CRUD */}
        <Card className="lg:col-span-2">
            <CardHeader>
                <CardTitle className="text-lg font-semibold">Platform Health</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div className="p-4 rounded-xl bg-[#F7F5F2]">
                        <p className="text-xs text-gray-500 uppercase tracking-wider">Total Users</p>
                        <p className="text-xl font-bold mt-1">{stats.totalUsers}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-[#F7F5F2]">
                        <p className="text-xs text-gray-500 uppercase tracking-wider">Sellers</p>
                        <p className="text-xl font-bold mt-1">{stats.totalSellers}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-[#F7F5F2]">
                        <p className="text-xs text-gray-500 uppercase tracking-wider">Total Orders</p>
                        <p className="text-xl font-bold mt-1">{stats.totalOrders}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-[#F7F5F2]">
                        <p className="text-xs text-gray-500 uppercase tracking-wider">Platform Conversion</p>
                        <p className="text-xl font-bold mt-1">{(stats.totalOrders / (stats.totalUsers || 1) * 100).toFixed(1)}%</p>
                    </div>
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}

