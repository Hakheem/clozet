// ─────────────────────────────────────────────────────────────────────────────
// FILE: app/admin/products/page.tsx
//
// Admin products list.
// Reads filters from URL searchParams (server component) → passes to action.
// Pagination via ?page=N, filter via ?category=, ?gender=, ?search=, ?sort=
//
// Related files:
//   app/admin/products/new/page.tsx        → TODO: create product form
//   app/admin/products/[id]/page.tsx       → TODO: edit product form
//   lib/actions/products.actions.ts        → all queries live here
// ─────────────────────────────────────────────────────────────────────────────

import { 
  getProducts,
  getCategoriesWithCounts,
  type ProductWithCategory,
} from "@/actions/products";
import { Package, Plus, Search, SlidersHorizontal, Eye, EyeOff, Star, Layers } from "lucide-react";
import Link from "next/link";
import AdminProductToggle from "@/components/admin/AdminProductToggle";
import DeleteProductButton from "@/components/admin/DeleteProductButton";
import FilterSelect from "@/components/admin/FilterSelect";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const GENDER_LABELS = { MEN: "Men", WOMEN: "Women", KIDS: "Kids", UNISEX: "Unisex" } as const;


const SORT_OPTIONS = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "price_asc", label: "Price: low → high" },
  { value: "price_desc", label: "Price: high → low" },
  { value: "featured", label: "Featured first" },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const awaitedSearchParams = await searchParams;
  const page = Number(awaitedSearchParams.page ?? 1);
  const pageSize = 20;

  const [result, categories] = await Promise.all([
    getProducts({
      isActive: awaitedSearchParams.active === "true" ? true : (awaitedSearchParams.active === "false" ? false : undefined), // undefined = all
      categorySlug: awaitedSearchParams.category || undefined,
      gender: (awaitedSearchParams.gender as "MEN" | "WOMEN" | "UNISEX") || undefined,
      search: awaitedSearchParams.search || undefined,
      sortBy: (awaitedSearchParams.sort as any) || "newest",
      page,
      pageSize,
    }),
    getCategoriesWithCounts(),
  ]);

  const { products, total, totalPages } = result;

  // Build a URL helper that merges new params into current ones
  function filterUrl(updates: Record<string, string | undefined>) {
    const params = new URLSearchParams(awaitedSearchParams as Record<string, string>);
    Object.entries(updates).forEach(([k, v]) => {
      if (v === undefined) params.delete(k);
      else params.set(k, v);
    });
    params.set("page", "1"); // reset page on filter change
    return `/admin/products?${params.toString()}`;
  }

  return (
    <div className="min-h-full" style={{ background: "#F7F5F2" }}>

      {/* ── Top bar ─────────────────────────────────────────── */}
      <header
        className="sticky top-0 z-10 flex items-center justify-between px-8 h-16"
        style={{ background: "#FFFFFF", borderBottom: "1px solid #E4E0D9" }}
      >
        <div>
          <p className="text-[0.6rem] uppercase tracking-[0.22em] font-semibold mb-0.5"
            style={{ color: "#BFA47A" }}>Catalogue</p>
          <h1 className="text-lg font-bold leading-none title" style={{ color: "#1C1A17" }}>
            Products
          </h1>
        </div>
        <Link href="/admin/products/new">
          <span
            className="inline-flex items-center gap-2 px-4 h-9 rounded-lg text-sm font-semibold transition-all"
            style={{ background: "#1C1A17", color: "#F7F5F2" }}
          >
            <Plus className="w-3.5 h-3.5" />
            Add Product
          </span>
        </Link>
      </header>

      <div className="p-8 space-y-5">

        {/* ── Filter bar ──────────────────────────────────────── */}
        <div
          className="flex flex-wrap items-center gap-3 px-4 py-3 rounded-xl"
          style={{ background: "#FFFFFF", border: "1px solid #E4E0D9" }}
        >
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5"
              style={{ color: "#8A857D" }} />
            <form>
              <input
                name="search"
                defaultValue={awaitedSearchParams.search ?? ""}
                placeholder="Search products…"
                className="w-full h-8 pl-8 pr-3 rounded-lg text-sm outline-none"
                style={{ background: "#F7F5F2", border: "1px solid #E4E0D9", color: "#1C1A17" }}
              />
            </form>
          </div>

          {/* Category filter */}
          <FilterSelect
            label="Category"
            value={awaitedSearchParams.category ?? ""} 
            paramKey="category"
            options={[
              { value: "", label: "All categories" },
              ...categories.map((c: { id: string; name: string; slug: string; image: string | null; productCount: number }) => ({ value: c.slug, label: `${c.name} (${c.productCount})` })),
            ]}
          />

          {/* Gender filter */}
          <FilterSelect
            label="Gender"
            value={awaitedSearchParams.gender ?? ""}
            paramKey="gender"
            options={[
              { value: "", label: "All genders" },
              { value: "MEN", label: "Men" },
              { value: "WOMEN", label: "Women" },
              { value: "UNISEX", label: "Unisex" },
            ]}
          />

          {/* Sort */}
          <FilterSelect
            label="Sort"
            value={awaitedSearchParams.sort ?? "newest"}
            paramKey="sort"
            options={SORT_OPTIONS}
          />

          {/* Active toggle */}
           <Link
            href={filterUrl({ active: awaitedSearchParams.active === "true" ? "false" : (awaitedSearchParams.active === "false" ? undefined : "true") })}
            className="inline-flex items-center gap-1.5 px-3 h-8 rounded-lg text-xs font-medium transition-colors"
            style={{
              background: awaitedSearchParams.active === "true" ? "rgba(34,197,94,0.08)" : (awaitedSearchParams.active === "false" ? "rgba(239,68,68,0.08)" : "#F7F5F2"),
              border: "1px solid #E4E0D9",
              color: awaitedSearchParams.active === "true" ? "#16A34A" : (awaitedSearchParams.active === "false" ? "#DC2626" : "#8A857D"),
            }}
          >
            {awaitedSearchParams.active === "true" ? <Eye className="w-3 h-3" /> : (awaitedSearchParams.active === "false" ? <EyeOff className="w-3 h-3" /> : <Layers className="w-3 h-3" />)}
            {awaitedSearchParams.active === "true" ? "Visible" : (awaitedSearchParams.active === "false" ? "Hidden" : "All Status")}
          </Link>

          <span className="ml-auto text-xs" style={{ color: "#8A857D" }}>
            {total} product{total !== 1 ? "s" : ""}
          </span>
        </div>

        {/* ── Products table ──────────────────────────────────── */}
        {products.length === 0 ? (
          <EmptyState hasFilters={Object.keys(awaitedSearchParams).length > 0} />
        ) : (
          <div className="rounded-xl overflow-hidden" style={{ border: "1px solid #E4E0D9" }}>
            {/* Header row */}
            <div
              className="grid grid-cols-[3fr_1fr_1fr_1fr_1fr_120px] gap-4 px-5 py-2.5"
              style={{ background: "#F7F5F2", borderBottom: "1px solid #E4E0D9" }}
            >
              {["Product", "Category", "Gender", "Price", "Stock", ""].map(h => (
                <span key={h} className="text-[0.6rem] uppercase tracking-[0.18em] font-semibold"
                  style={{ color: "#8A857D" }}>{h}</span>
              ))}
            </div>

            {/* Rows */}
            {products.map((p: ProductWithCategory, i: number) => (
              <div
                key={p.id}
                className="grid grid-cols-[3fr_1fr_1fr_1fr_1fr_120px] gap-4 items-center px-5 py-3.5"
                style={{
                  background: "#FFFFFF",
                  borderBottom: i < products.length - 1 ? "1px solid #F0EDE8" : "none",
                }}
              >
                {/* Name + image */}
                <div className="flex items-center gap-3 min-w-0">
                  {p.images[0] && (
                    <img src={p.images[0]} alt="" className="w-9 h-9 rounded object-cover flex-shrink-0"
                      style={{ border: "1px solid #E4E0D9" }} />
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: "#1C1A17" }}>{p.name}</p>
                    <p className="text-xs truncate" style={{ color: "#8A857D" }}>/{p.slug}</p>
                  </div>
                  {p.isFeatured && (
                    <Star className="w-3 h-3 flex-shrink-0" style={{ color: "#BFA47A" }} />
                  )}
                </div>

                <span className="text-xs px-2 py-1 rounded-md w-fit"
                  style={{ background: "#F7F5F2", color: "#8A857D", border: "1px solid #E4E0D9" }}>
                  {p.category.name}
                </span>

                <span className="text-xs" style={{ color: "#8A857D" }}>
                  {GENDER_LABELS[p.gender]}
                </span>

                <span className="text-sm font-medium" style={{ color: "#1C1A17" }}>
                  KES {p.price.toLocaleString()}
                  {p.discountPrice && (
                    <span className="block text-[0.65rem] line-through text-[#8A857D]">
                      KES {p.discountPrice.toLocaleString()}
                    </span>
                  )}
                </span>

                <span className="text-sm font-medium" style={{ color: p.totalStock > 0 ? "#1C1A17" : "#DC2626" }}>
                  {p.totalStock}
                  <span className="text-[0.6rem] text-[#8A857D] ml-1 block font-normal">
                    {p.variants.length} variant(s)
                  </span>
                </span>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <AdminProductToggle productId={p.id} isActive={p.isActive} />
                  <Link href={`/admin/products/${p.id}`}
                    className="p-2 text-[#8A857D] hover:text-[#BFA47A] rounded-lg transition-colors"
                    title="Edit product"
                  >
                    Edit
                  </Link>
                  <DeleteProductButton productId={p.id} productName={p.name} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Pagination ──────────────────────────────────────── */}
        {totalPages > 1 && (
          <Pagination page={page} totalPages={totalPages} filterUrl={filterUrl} />
        )}
      </div>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function EmptyState({ hasFilters }: { hasFilters: boolean }) {
  return (
    <div
      className="flex flex-col items-center justify-center py-20 rounded-xl text-center"
      style={{ background: "#FFFFFF", border: "1px solid #E4E0D9" }}
    >
      <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3"
        style={{ background: "rgba(191,164,122,0.08)", border: "1px solid rgba(191,164,122,0.15)" }}>
        <Package className="w-5 h-5" style={{ color: "#BFA47A" }} />
      </div>
      <p className="text-sm font-medium mb-1" style={{ color: "#1C1A17" }}>
        {hasFilters ? "No products match those filters" : "No products yet"}
      </p>
      <p className="text-xs mb-5" style={{ color: "#8A857D", maxWidth: "24ch" }}>
        {hasFilters
          ? "Try adjusting or clearing your filters."
          : "Add the first product to start building the catalogue."}
      </p>
      {!hasFilters && (
        <Link href="/admin/products/new">
          <span className="inline-flex items-center gap-2 px-4 h-9 rounded-lg text-sm font-semibold"
            style={{ background: "#1C1A17", color: "#F7F5F2" }}>
            <Plus className="w-3.5 h-3.5" /> Add Product
          </span>
        </Link>
      )}
    </div>
  );
}

function Pagination({
  page, totalPages, filterUrl,
}: {
  page: number;
  totalPages: number;
  filterUrl: (u: Record<string, string>) => string;
}) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center gap-1.5">
      {page > 1 && (
        <PaginationLink href={filterUrl({ page: String(page - 1) })} label="← Prev" />
      )}
      {pages.map(p => (
        <PaginationLink
          key={p}
          href={filterUrl({ page: String(p) })}
          label={String(p)}
          active={p === page}
        />
      ))}
      {page < totalPages && (
        <PaginationLink href={filterUrl({ page: String(page + 1) })} label="Next →" />
      )}
    </div>
  );
}

function PaginationLink({
  href, label, active,
}: { href: string; label: string; active?: boolean }) {
  return (
    <Link href={href}>
      <span
        className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-xs font-medium transition-all"
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

