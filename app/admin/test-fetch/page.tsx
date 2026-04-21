import { getProducts } from "@/actions/products";
import ProductCard from "@/components/shop/ProductCard";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function TestFetchPage() {
  const { products } = await getProducts({ isActive: undefined, pageSize: 20 });

  return (
    <div className="min-h-screen bg-[#F7F5F2] p-10">
      <header className="mb-10 flex items-center justify-between">
        <div>
          <Link href="/admin/products" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#8A857D] hover:text-[#1C1A17] transition-colors mb-4">
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-[#1C1A17]">Product Preview</h1>
          <p className="text-sm text-[#8A857D] mt-1">Verification of card layout, status badges, and pricing logic.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-20 bg-white rounded-3xl border border-[#E4E0D9]">
          <p className="text-sm text-[#8A857D]">No products found. Go create some!</p>
        </div>
      )}
    </div>
  );
}
