
import {
  getProducts,
  getCategoriesWithCounts,
} from "@/actions/products";
import ProductCard from "@/components/shop/ProductCard";
import ShopFilters from "@/components/shop/ShopFilters";
import { SlidersHorizontal, PackageSearch } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";
import Container from "@/components/layout/Container";


export const metadata: Metadata = {
  title: "Shop — Lukuu",
  description: "Discover exclusive streetwear, bags, shoes and accessories.",
};

const PAGE_SIZE = 24;

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const awaitedSearchParams = await searchParams;
  const page = Number(awaitedSearchParams.page ?? 1);

  const [result, categories] = await Promise.all([
    getProducts({
      categorySlug: awaitedSearchParams.category  || undefined,
      gender:       (awaitedSearchParams.gender as any) || undefined,
      search:       awaitedSearchParams.search    || undefined,
      sortBy:       (awaitedSearchParams.sort as any)   || "featured",
      minPrice:     awaitedSearchParams.min ? Number(awaitedSearchParams.min) : undefined,
      maxPrice:     awaitedSearchParams.max ? Number(awaitedSearchParams.max) : undefined,
      page,
      pageSize: PAGE_SIZE,
    }),
    getCategoriesWithCounts(),
  ]);

  const { products, total, totalPages } = result;

  const hasActiveFilters = !!(
    awaitedSearchParams.category || awaitedSearchParams.gender ||
    awaitedSearchParams.search   || awaitedSearchParams.min    || awaitedSearchParams.max
  );

  // Canonical URL builder for pagination / filter links
  function makeUrl(updates: Record<string, string | undefined>) {
    const p = new URLSearchParams(awaitedSearchParams as Record<string, string>);
    Object.entries(updates).forEach(([k, v]) => {
      if (v === undefined) p.delete(k); else p.set(k, v);
    });
    p.set("page", updates.page ?? "1");
    return `/shop?${p.toString()}`;
  }

  return (
<Container>
    <div style={{ background: "#F7F5F2", minHeight: "100vh" }}>

      {/* ── Page header ──────────────────────────────────────── */}
      <div
        className="px-6 md:px-12 py-10"
        style={{ borderBottom: "1px solid #E4E0D9" }}
      >
        <p className="text-[0.6rem] uppercase tracking-[0.25em] font-semibold mb-1"
          style={{ color: "#BFA47A" }}>
          — Explore
        </p>
        <h1
          className="text-4xl md:text-5xl font-light"
          style={{ fontFamily: "var(--font-cormorant, serif)", color: "#1C1A17" }}
        >
          The Shop
          <span style={{ color: "#BFA47A" }}>.</span>
        </h1>
        <p className="mt-2 text-sm" style={{ color: "#8A857D" }}>
          {total.toLocaleString()} piece{total !== 1 ? "s" : ""} available
        </p>
      </div>

      <div className="flex">

        {/* ── Filter sidebar ───────────────────────────────────── */}
        <ShopFilters
          categories={categories}
          searchParams={awaitedSearchParams}
          makeUrl={makeUrl}
        />

        {/* ── Product grid ─────────────────────────────────────── */}
        <main className="flex-1 px-6 md:px-8 py-8">

          {/* Sort + active filters bar */}
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            {/* Active filter chips */}
            <div className="flex flex-wrap items-center gap-2">
              {awaitedSearchParams.category && (
                <FilterChip label={`Category: ${awaitedSearchParams.category}`} href={makeUrl({ category: undefined })} />
              )}
              {awaitedSearchParams.gender && (
                <FilterChip label={`Gender: ${awaitedSearchParams.gender}`} href={makeUrl({ gender: undefined })} />
              )}
              {awaitedSearchParams.search && (
                <FilterChip label={`"${awaitedSearchParams.search}"`} href={makeUrl({ search: undefined })} />
              )}
              {hasActiveFilters && (
                <Link href="/shop" className="text-xs underline" style={{ color: "#8A857D" }}>
                  Clear all
                </Link>
              )}
            </div>

            {/* Sort select */}
            <SortSelect value={awaitedSearchParams.sort ?? "newest"} makeUrl={makeUrl} />
          </div>

          {products.length === 0 ? (
            <ShopEmptyState hasFilters={hasActiveFilters} />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
              {products.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}

          {/* ── Pagination ──────────────────────────────────────── */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-1.5 mt-12">
              {page > 1 && (
                <PageLink href={makeUrl({ page: String(page - 1) })} label="← Prev" />
              )}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <PageLink
                  key={p}
                  href={makeUrl({ page: String(p) })}
                  label={String(p)}
                  active={p === page}
                />
              ))}
              {page < totalPages && (
                <PageLink href={makeUrl({ page: String(page + 1) })} label="Next →" />
              )}
            </div>
          )}
        </main>
      </div>
    </div>

</Container>
  );
}

// ─── Small helpers 

function FilterChip({ label, href }: { label: string; href: string }) {
  return (
    <Link href={href}>
      <span
        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-colors"
        style={{ background: "rgba(191,164,122,0.1)", border: "1px solid rgba(191,164,122,0.25)", color: "#1C1A17" }}
      >
        {label} <span style={{ color: "#8A857D" }}>×</span>
      </span>
    </Link>
  );
}

function SortSelect({
  value, makeUrl,
}: {
  value: string;
  makeUrl: (u: Record<string, string | undefined>) => string;
}) {
  const options = [
    { value: "newest",     label: "Newest" },
    { value: "oldest",     label: "Oldest" },
    { value: "price_asc",  label: "Price ↑" },
    { value: "price_desc", label: "Price ↓" },
    { value: "featured",   label: "Featured" },
  ];
  return (
    <div className="flex items-center gap-2 text-xs" style={{ color: "#8A857D" }}>
      <span>Sort:</span>
      <div className="flex gap-1">
        {options.map(o => (
          <Link key={o.value} href={makeUrl({ sort: o.value })}>
            <span
              className="px-2.5 py-1 rounded-lg transition-all"
              style={{
                background: value === o.value ? "#1C1A17" : "#FFFFFF",
                color:      value === o.value ? "#F7F5F2" : "#8A857D",
                border: `1px solid ${value === o.value ? "#1C1A17" : "#E4E0D9"}`,
              }}
            >
              {o.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

function ShopEmptyState({ hasFilters }: { hasFilters: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-4"
        style={{ background: "rgba(191,164,122,0.08)", border: "1px solid rgba(191,164,122,0.15)" }}>
        <PackageSearch className="w-6 h-6" style={{ color: "#BFA47A" }} />
      </div>
      <p className="text-base font-medium mb-1" style={{ color: "#1C1A17" }}>
        {hasFilters ? "Nothing matches those filters" : "Nothing here yet"}
      </p>
      <p className="text-sm" style={{ color: "#8A857D" }}>
        {hasFilters ? "Try adjusting or clearing your search." : "Check back soon for new drops."}
      </p>
      {hasFilters && (
        <Link href="/shop" className="mt-4 text-sm underline" style={{ color: "#BFA47A" }}>
          Clear all filters
        </Link>
      )}
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
          color:      active ? "#F7F5F2" : "#8A857D",
          border: `1px solid ${active ? "#1C1A17" : "#E4E0D9"}`,
        }}
      >
        {label}
      </span>
    </Link>
  );
}

