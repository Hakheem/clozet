import { getSellerDashboardStats } from "@/actions/dashboard";
import SellerDashboard from "@/components/seller/SellerDashboard";
import { AlertCircle, Package, Store, ShoppingBag } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export const metadata = {
  title: "Seller Hub | Lukuu",
};

export default async function SellerDashboardPage() {
  const result = await getSellerDashboardStats();

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
          Seller Hub
        </h1>
        <p className="text-sm mt-1" style={{ color: "#8A857D" }}>
          Track your sales, manage orders, and grow your business.
        </p>
      </div>

      <SellerDashboard stats={stats} />

      {/* Main Content Grid for secondary info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Quick Actions */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-md">
              <AlertCircle className="h-5 w-5" style={{ color: "#BFA47A" }} />
              Seller Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link
              href="/seller/products/new"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-[#E4E0D9]"
            >
              <Package className="h-4 w-4" style={{ color: "#BFA47A" }} />
              <span className="text-sm font-medium" style={{ color: "#1C1A17" }}>
                Add New Product
              </span>
            </Link>
            <Link
              href="/seller/products"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-[#E4E0D9]"
            >
              <Package className="h-4 w-4" style={{ color: "#BFA47A" }} />
              <span className="text-sm font-medium" style={{ color: "#1C1A17" }}>
                Manage My Products
              </span>
            </Link>
            <Link
              href="/seller/orders"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-[#E4E0D9]"
            >
              <ShoppingBag className="h-4 w-4" style={{ color: "#BFA47A" }} />
              <span className="text-sm font-medium" style={{ color: "#1C1A17" }}>
                Track My Orders
              </span>
            </Link>
            <Link
              href="/seller/earnings"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-[#E4E0D9]"
            >
              <Store className="h-4 w-4" style={{ color: "#BFA47A" }} />
              <span className="text-sm font-medium" style={{ color: "#1C1A17" }}>
                Earnings & Payouts
              </span>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
