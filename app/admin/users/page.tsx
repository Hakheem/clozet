import UsersTable from "@/components/admin/UsersTable";

export const metadata = {
  title: "Manage Users | Admin | Lukuu",
};

export default function AdminUsersPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: "#1C1A17" }}>
          User Management
        </h1>
        <p className="text-sm mt-1" style={{ color: "#8A857D" }}>
          View, edit roles, and manage all registered users on the platform.
        </p>
      </div>

      <UsersTable />
    </div>
  );
}
