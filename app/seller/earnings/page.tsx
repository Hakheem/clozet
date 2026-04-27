import SellerEarnings from "@/components/seller/SellerEarnings";

export const metadata = {
  title: "Earnings & Payouts | Seller | Lukuu",
};

export default function SellerEarningsPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: "#1C1A17" }}>
          Earnings & Payouts
        </h1>
        <p className="text-sm mt-1" style={{ color: "#8A857D" }}>
          Track your revenue, available balance, and request withdrawals.
        </p>
      </div>

      <SellerEarnings />
    </div>
  );
}
