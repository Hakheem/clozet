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

    </div>
  );
}
