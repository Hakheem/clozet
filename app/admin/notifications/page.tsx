import AdminNotificationList from "@/components/admin/AdminNotificationList";

export const metadata = {
  title: "Notifications | Admin | Lukuu",
};

export default function AdminNotificationsPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: "#1C1A17" }}>
          Notifications
        </h1>
        <p className="text-sm mt-1" style={{ color: "#8A857D" }}>
          All platform notifications across users, sellers, and admins.
        </p>
      </div>

      <AdminNotificationList />
    </div>
  );
}
