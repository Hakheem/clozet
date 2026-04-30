
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
import { makeShopUrl } from "@/lib/shop-url-builder";


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
      categorySlug: awaitedSearchParams.category || undefined,
      gender: (awaitedSearchParams.gender as any) || undefined,
      search: awaitedSearchParams.search || undefined,
      sortBy: (awaitedSearchParams.sort as any) || "featured",
      minPrice: awaitedSearchParams.min ? Number(awaitedSearchParams.min) : undefined,
      maxPrice: awaitedSearchParams.max ? Number(awaitedSearchParams.max) : undefined,
      page,
      pageSize: PAGE_SIZE,
    }),
    getCategoriesWithCounts(),
  ]);

  const { products, total, totalPages } = result;

  const hasActiveFilters = !!(
    awaitedSearchParams.category || awaitedSearchParams.gender ||
    awaitedSearchParams.search || awaitedSearchParams.min || awaitedSearchParams.max
  );

  return (
    <Container className="mx-auto " >

      {/* ── Page header ──────────────────────────────────────── */}
      <div
        className="py-8 border-b border-border"
      >
        <p className="text-[0.6rem] uppercase tracking-[0.25em] font-semibold mb-1 text-accent">
          — Explore
        </p>
        <h1
          className="text-4xl md:text-5xl font-light title"
        >
          The Shop
          <span className='text-gold'>.</span>
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {total.toLocaleString()} item{total !== 1 ? "s" : ""} available
        </p>
      </div>

      <div className="flex min-h-[60vh]">

        {/* ── Filter sidebar ───────────────────────────────────── */}
        <ShopFilters
          categories={categories}
          searchParams={awaitedSearchParams}
          baseUrl="/shop"
        />

        {/* ── Product grid ─────────────────────────────────────── */}
        <main className="flex-1 w-full px-0 md:px-4 py-8 min-h-[400px]">

          {/* Sort + active filters bar */}
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            {/* Active filter chips */}
            <div className="flex flex-wrap items-center gap-2">
              {awaitedSearchParams.category && (
                <FilterChip label={`Category: ${awaitedSearchParams.category}`} href={makeShopUrl("/shop", awaitedSearchParams, { category: undefined })} />
              )}
              {awaitedSearchParams.gender && (
                <FilterChip label={`Gender: ${awaitedSearchParams.gender}`} href={makeShopUrl("/shop", awaitedSearchParams, { gender: undefined })} />
              )}
              {awaitedSearchParams.search && (
                <FilterChip label={`"${awaitedSearchParams.search}"`} href={makeShopUrl("/shop", awaitedSearchParams, { search: undefined })} />
              )}
              {hasActiveFilters && (
                <Link href="/shop" className="text-xs underline text-muted-foreground">
                  Clear all
                </Link>
              )}
            </div>

            {/* Sort select */}
            <SortSelect value={awaitedSearchParams.sort ?? "newest"} searchParams={awaitedSearchParams} baseUrl="/shop" />
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
                <PageLink href={makeShopUrl("/shop", awaitedSearchParams, { page: String(page - 1) })} label="← Prev" />
              )}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <PageLink
                  key={p}
                  href={makeShopUrl("/shop", awaitedSearchParams, { page: String(p) })}
                  label={String(p)}
                  active={p === page}
                />
              ))}
              {page < totalPages && (
                <PageLink href={makeShopUrl("/shop", awaitedSearchParams, { page: String(page + 1) })} label="Next →" />
              )}
            </div>
          )}
        </main>
      </div>


    </Container>
  );
}

// ─── Small helpers 

function FilterChip({ label, href }: { label: string; href: string }) {
  return (
    <Link href={href}>
      <span
        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-colors bg-accent/10 border border-accent/25 text-foreground"
      >
        {label} <span className="text-muted-foreground">×</span>
      </span>
    </Link>
  );
}

function SortSelect({
  value,
  searchParams,
  baseUrl,
}: {
  value: string;
  searchParams: Record<string, string>;
  baseUrl: string;
}) {
  const options = [
    { value: "newest", label: "Newest" },
    { value: "oldest", label: "Oldest" },
    { value: "price_asc", label: "Price ↑" },
    { value: "price_desc", label: "Price ↓" },
    { value: "featured", label: "Featured" },
  ];
  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground">
      <span className="hidden md:flex" >Sort:</span>
      <div className="flex gap-1">
        {options.map(o => (
          <Link key={o.value} href={makeShopUrl(baseUrl, searchParams, { sort: o.value })}>
            <span
              className={`px-2.5 py-1 rounded-lg transition-all ${value === o.value
                ? "bg-foreground text-background border border-foreground"
                : "bg-white text-muted-foreground border border-border"
                }`}
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
    <div className="flex flex-1 flex-col items-center justify-center py-24 text-center">
      <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 bg-accent/8 border border-accent/15">
        <PackageSearch className="w-6 h-6 text-accent" />
      </div>
      <p className="text-base font-medium mb-1 text-foreground">
        {hasFilters ? "Nothing matches those filters" : "Nothing here yet"}
      </p>
      <p className="text-sm text-muted-foreground">
        {hasFilters ? "Try adjusting or clearing your search." : "Check back soon for new drops."}
      </p>
      {hasFilters && (
        <Link href="/shop" className="mt-4 text-sm underline text-accent">
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
        className={`inline-flex items-center justify-center w-9 h-9 rounded-lg text-sm font-medium transition-all ${active
          ? "bg-foreground text-background border border-foreground"
          : "bg-white text-muted-foreground border border-border"
          }`}
      >
        {label}
      </span>
    </Link>
  );
} 

