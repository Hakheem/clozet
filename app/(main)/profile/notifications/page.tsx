import Container from "@/components/layout/Container";
import NotificationList from "@/components/general/NotificationList";

export const metadata = {
  title: "Notifications | Lukuu",
  description: "Stay updated with your latest activities on Lukuu.",
};

export default function NotificationsPage() {
  return (
    <div className="">
      <Container className="max-w-4xl">
        <NotificationList />
      </Container>
    </div>
  );
}
