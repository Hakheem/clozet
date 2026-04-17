import Container from "@/components/layout/Container";

export default function SellerDashboard() {
  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="bg-white border-b border-zinc-200">
        <Container className="flex items-center justify-between h-16">
          <h2 className="text-xl font-bold font-title text-zinc-900">Seller Hub</h2>
        </Container>
      </header>

      <Container className="py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-white border border-zinc-200 rounded-xl shadow-sm text-center">
                <p className="text-sm text-zinc-500 font-medium">Your Earnings</p>
                <h3 className="text-3xl font-bold font-title mt-2">$0.00</h3>
            </div>
            <div className="p-6 bg-white border border-zinc-200 rounded-xl shadow-sm text-center">
                <p className="text-sm text-zinc-500 font-medium">Active Products</p>
                <h3 className="text-3xl font-bold font-title mt-2">0</h3>
            </div>
            <div className="p-6 bg-white border border-zinc-200 rounded-xl shadow-sm text-center">
                <p className="text-sm text-zinc-500 font-medium">Recent Orders</p>
                <h3 className="text-3xl font-bold font-title mt-2">0</h3>
            </div>
        </div>

        <div className="mt-10 p-6 bg-white border border-zinc-200 rounded-xl min-h-[400px]">
            <p className="text-zinc-500 text-sm">Manage your inventory and track sales here.</p>
        </div>
      </Container>
    </div>
  );
}
