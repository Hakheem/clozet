import SellersTable from "@/components/admin/SellersTable";

export const metadata = {
  title: "Registered Sellers | Admin | Lukuu",
};

export default function AdminSellersPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: "#1C1A17" }}>
          Seller Management
        </h1>
        <p className="text-sm mt-1" style={{ color: "#8A857D" }}>
          Monitor active sellers, their shop details, and performance.
        </p>
      </div>

      <SellersTable />
    </div>
  );
}
