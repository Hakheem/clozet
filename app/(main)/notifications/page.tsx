import Container from "@/components/layout/Container";
import NotificationList from "@/components/general/NotificationList";

export const metadata = {
  title: "Notifications | Lukuu",
  description: "Stay updated with your latest activities on Lukuu.",
};

export default function NotificationsPage() {
  return (
    <div className="py-12 bg-[#F7F5F2] min-h-screen">
      <Container className="max-w-3xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold" style={{ color: "#1C1A17" }}>
            Notifications
          </h1>
          <p className="text-gray-500 mt-2">
            Updates on your orders, payouts, and account activity.
          </p>
        </div>

        <NotificationList />
      </Container>
    </div>
  );
}
