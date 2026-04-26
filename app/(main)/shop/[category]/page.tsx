// ─────────────────────────────────────────────────────────────────────────────
// FILE: app/(shop)/shop/[category]/page.tsx
//
// Category-scoped shop page. URL: /shop/shoes, /shop/bags, etc.
// Reads:
//   params.category  → the category slug
//   searchParams     → gender, sort, price range, page (same as main shop)
//
// Related files:
//   app/(shop)/shop/[category]/[slug]/page.tsx → single product detail (TODO)
//   app/(shop)/shop/page.tsx                   → the parent all-products page
//   lib/actions/products.actions.ts            → getProducts()
// ─────────────────────────────────────────────────────────────────────────────

import { getProducts, getCategoriesWithCounts } from "@/actions/products";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/shop/ProductCard";
import ShopFilters from "@/components/shop/ShopFilters";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";

const PAGE_SIZE = 24;

// ─── Metadata (dynamic per category) ─────────────────────────────────────────

export async function generateMetadata({
  params,
}: { 
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const awaitedParams = await params;
  const cat = await prisma.category.findUnique({
    where: { slug: awaitedParams.category },
    select: { name: true, description: true },
  });
  if (!cat) return { title: "Not found — Lukuu" };
  return {
    title: `${cat.name} — Lukuu`,
    description: cat.description ?? `Shop ${cat.name} on Lukuu`,
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>;
  searchParams: Promise<Record<string, string>>;
}) {
  const awaitedParams = await params;
  const awaitedSearchParams = await searchParams;
  const page = Number(awaitedSearchParams.page ?? 1);

  // Validate category exists
  const categoryMeta = await prisma.category.findUnique({
    where: { slug: awaitedParams.category, isActive: true },
    select: { name: true, description: true, image: true },
  });
  if (!categoryMeta) notFound();

  const [result, categories] = await Promise.all([
    getProducts({
      categorySlug: awaitedParams.category,
      gender: (awaitedSearchParams.gender as any) || undefined,
      sortBy: (awaitedSearchParams.sort as any) || "newest",
      minPrice: awaitedSearchParams.min ? Number(awaitedSearchParams.min) : undefined,
      maxPrice: awaitedSearchParams.max ? Number(awaitedSearchParams.max) : undefined,
      search: awaitedSearchParams.search || undefined,
      page,
      pageSize: PAGE_SIZE,
    }),
    getCategoriesWithCounts(),
  ]);

  const { products, total, totalPages } = result;

  function makeUrl(updates: Record<string, string | undefined>) {
    const p = new URLSearchParams(awaitedSearchParams as Record<string, string>);
    Object.entries(updates).forEach(([k, v]) => {
      if (v === undefined) p.delete(k); else p.set(k, v);
    });
    p.set("page", updates.page ?? "1");
    return `/shop/${awaitedParams.category}?${p.toString()}`;
  }

  return (
    <div className='min-h-screen flex flex-col'>

      {/* Category header */}
      <div
        className="relative px-6 md:px-12 py-12 overflow-hidden"
        style={{
          background: categoryMeta.image
            ? undefined
            : "#1C1A17",
          backgroundImage: categoryMeta.image
            ? `url("${categoryMeta.image}")`
            : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Overlay when image is present */}
        {categoryMeta.image && (
          <div className="absolute inset-0"
            style={{ background: "linear-gradient(to right, rgba(28,26,23,0.85) 50%, rgba(28,26,23,0.35) 100%)" }} />
        )}
        <div className="relative z-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-4 text-xs" style={{ color: "rgba(237,232,223,0.5)" }}>
            <Link href="/shop" className="hover:text-white transition-colors">Shop</Link>
            <span>/</span>
            <span style={{ color: "#BFA47A" }}>{categoryMeta.name}</span>
          </div>
          <p className="text-[0.6rem] uppercase tracking-[0.25em] font-semibold mb-1"
            style={{ color: "#BFA47A" }}>
            — {total} item{total !== 1 ? "s" : ""}
          </p>
          <h1
            className="text-4xl md:text-6xl font-light"
            style={{ fontFamily: "var(--font-cormorant, serif)", color: "#EDE8DF" }}
          >
            {categoryMeta.name}
            <span style={{ color: "#BFA47A" }}>.</span>
          </h1>
          {categoryMeta.description && (
            <p className="mt-2 text-sm max-w-[40ch]" style={{ color: "rgba(237,232,223,0.6)" }}>
              {categoryMeta.description}
            </p>
          )}
        </div>
      </div>

      {/* Body — same filter + grid layout as main shop */}
      <div className="flex">
        <ShopFilters
          categories={categories}
          searchParams={{ ...awaitedSearchParams, category: awaitedParams.category }}
          makeUrl={makeUrl}
        />

        <main className="flex-1 px-6 md:px-8 py-8">
          {/* Gender filter pills — prominent on category page */}
          <div className="flex items-center gap-2 mb-6 flex-wrap">
            {[
              { value: undefined, label: "All" },
              { value: "WOMEN", label: "Women" },
              { value: "MEN", label: "Men" },
              { value: "UNISEX", label: "Unisex" },
            ].map(g => (
              <Link key={g.label} href={makeUrl({ gender: g.value })}>
                <span
                  className="px-4 py-1.5 rounded-full text-sm font-medium transition-all"
                  style={{
                    background: (awaitedSearchParams.gender ?? "") === (g.value ?? "")
                      ? "#1C1A17" : "#FFFFFF",
                    color: (awaitedSearchParams.gender ?? "") === (g.value ?? "")
                      ? "#F7F5F2" : "#8A857D",
                    border: "1px solid #E4E0D9",
                  }}
                >
                  {g.label}
                </span>
              </Link>
            ))}
          </div>

          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <p className="text-base font-medium mb-1" style={{ color: "#1C1A17" }}>
                No products found
              </p>
              <Link href={`/shop/${awaitedParams.category}`} className="mt-3 text-sm underline"
                style={{ color: "#BFA47A" }}>
                Clear filters
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
              {products.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-1.5 mt-12">
              {page > 1 && (
                <PageLink href={makeUrl({ page: String(page - 1) })} label="← Prev" />
              )}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <PageLink key={p} href={makeUrl({ page: String(p) })} label={String(p)} active={p === page} />
              ))}
              {page < totalPages && (
                <PageLink href={makeUrl({ page: String(page + 1) })} label="Next →" />
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function PageLink({ href, label, active }: { href: string; label: string; active?: boolean }) {
  return (
    <Link href={href}>
      <span
        className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-sm font-medium transition-all"
        style={{
          background: active ? "#1C1A17" : "#FFFFFF",
          color: active ? "#F7F5F2" : "#8A857D",
          border: `1px solid ${active ? "#1C1A17" : "#E4E0D9"}`,
        }}
      >
        {label}
      </span>
    </Link>
  );
}

