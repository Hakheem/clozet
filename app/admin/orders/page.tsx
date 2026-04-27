import AdminOrdersList from "@/components/admin/AdminOrdersList";

export const metadata = {
  title: "Platform Orders | Admin | Lukuu",
};

export default function AdminOrdersPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: "#1C1A17" }}>
          Order Management
        </h1>
        <p className="text-sm mt-1" style={{ color: "#8A857D" }}>
          Monitor and update statuses for all orders across the platform.
        </p>
      </div>

      <AdminOrdersList />
    </div>
  );
}
