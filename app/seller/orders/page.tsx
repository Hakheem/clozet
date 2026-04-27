import SellerOrdersList from "@/components/seller/SellerOrdersList";

export const metadata = {
  title: "My Store Orders | Seller | Lukuu",
};

export default function SellerOrdersPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: "#1C1A17" }}>
          Orders
        </h1>
        <p className="text-sm mt-1" style={{ color: "#8A857D" }}>
          Manage your incoming orders and track their fulfillment status.
        </p>
      </div>

      <SellerOrdersList />
    </div>
  );
}
