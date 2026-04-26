// ─────────────────────────────────────────────────────────────────────────────
// FILE: components/shop/ShopFilters.tsx
//
// Left sidebar with category links, gender filter, price range.
// Receives makeUrl from the parent page so it doesn't need to know the route.
// ─────────────────────────────────────────────────────────────────────────────

import Link from "next/link";

type Category = { id: string; name: string; slug: string; productCount: number };

const GENDERS = [
  { value: "", label: "All" },
  { value: "WOMEN", label: "Women" },
  { value: "MEN", label: "Men" },
  { value: "UNISEX", label: "Unisex" },
];

const PRICE_RANGES = [
  { label: "All prices", min: undefined, max: undefined },
  { label: "Under KES 1,000", min: undefined, max: 1000 },
  { label: "KES 1k – 3k", min: 1000, max: 3000 },
  { label: "KES 3k – 8k", min: 3000, max: 8000 },
  { label: "Above KES 8,000", min: 8000, max: undefined },
];

export default function ShopFilters({
  categories,
  searchParams,
  makeUrl,
}: {
  categories: Category[];
  searchParams: Record<string, string>;
  makeUrl: (u: Record<string, string | undefined>) => string;
}) {
  const activeGender = searchParams.gender ?? "";
  const activeCategory = searchParams.category ?? "";
  const activeMin = searchParams.min ?? "";
  const activeMax = searchParams.max ?? "";

  return (
    <aside
      className="hidden md:block w-56 flex-shrink-0 sticky top-0 h-screen overflow-y-auto py-8 px-5 border-r border-border"
    >

      {/* Categories */}
      <FilterSection title="Category">
        <Link href={makeUrl({ category: undefined })}>
          <FilterItem label="All" count={categories.reduce((a, c) => a + c.productCount, 0)}
            active={!activeCategory} />
        </Link>
        {categories.map(cat => (
          <Link key={cat.slug} href={makeUrl({ category: cat.slug })}>
            <FilterItem label={cat.name} count={cat.productCount}
              active={activeCategory === cat.slug} />
          </Link>
        ))}
      </FilterSection>

      {/* Gender */}
      <FilterSection title="For">
        {GENDERS.map(g => (
          <Link key={g.value} href={makeUrl({ gender: g.value || undefined })}>
            <FilterItem label={g.label} active={activeGender === g.value} />
          </Link>
        ))}
      </FilterSection>

      {/* Price */}
      <FilterSection title="Price">
        {PRICE_RANGES.map(r => {
          const isActive = (r.min?.toString() ?? "") === activeMin &&
            (r.max?.toString() ?? "") === activeMax;
          return (
            <Link
              key={r.label}
              href={makeUrl({ min: r.min?.toString(), max: r.max?.toString() })}
            >
              <FilterItem label={r.label} active={isActive} />
            </Link>
          );
        })}
      </FilterSection>
    </aside>
  );
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-7">
      <p className="text-[0.58rem] uppercase tracking-[0.22em] font-bold mb-3 text-muted-foreground">
        {title}
      </p>
      <div className="space-y-0.5">{children}</div>
    </div>
  );
}

function FilterItem({
  label, count, active,
}: { label: string; count?: number; active: boolean }) {
  return (
    <span
      className={`flex items-center justify-between w-full px-2.5 py-1.5 rounded-lg text-sm transition-colors cursor-pointer ${active
          ? "bg-accent/10 text-foreground font-semibold"
          : "bg-transparent text-muted-foreground font-normal"
        }`}
    >
      <span>{label}</span>
      {count !== undefined && (
        <span className={`text-xs ${active ? "text-accent" : "text-border"
          }`}>
          {count}
        </span>
      )}
    </span>
  );
}

