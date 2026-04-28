import NotificationList from "@/components/general/NotificationList";

export const metadata = {
  title: "Notifications | Seller Hub | Lukuu",
};

export default function SellerNotificationsPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: "#1C1A17" }}>
          Notifications
        </h1>
        <p className="text-sm mt-1" style={{ color: "#8A857D" }}>
          Updates on your orders, payouts, and account activity.
        </p>
      </div>

      <NotificationList />
    </div>
  );
}
