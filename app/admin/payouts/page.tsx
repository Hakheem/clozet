import AdminPayoutsList from "@/components/admin/AdminPayoutsList";

export const metadata = {
  title: "Payout Requests | Admin | Lukuu",
};

export default function AdminPayoutsPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: "#1C1A17" }}>
          Payout Management
        </h1>
        <p className="text-sm mt-1" style={{ color: "#8A857D" }}>
          Review and fulfill withdrawal requests from sellers.
        </p>
      </div>

      <AdminPayoutsList />
    </div>
  );
}
