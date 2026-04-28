"use client";

import Link from "next/link";
import { useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";

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
  const [mobileOpen, setMobileOpen] = useState(false);
  const activeGender = searchParams.gender ?? "";
  const activeCategory = searchParams.category ?? "";
  const activeMin = searchParams.min ?? "";
  const activeMax = searchParams.max ?? "";

  const filterContent = (
    <>
      {/* Categories */}
      <FilterSection title="Category">
        <Link href={makeUrl({ category: undefined })} onClick={() => setMobileOpen(false)}>
          <FilterItem label="All" count={categories.reduce((a, c) => a + c.productCount, 0)}
            active={!activeCategory} />
        </Link>
        {categories.map(cat => (
          <Link key={cat.slug} href={makeUrl({ category: cat.slug })} onClick={() => setMobileOpen(false)}>
            <FilterItem label={cat.name} count={cat.productCount}
              active={activeCategory === cat.slug} />
          </Link>
        ))}
      </FilterSection>

      {/* Gender */}
      <FilterSection title="For">
        {GENDERS.map(g => (
          <Link key={g.value} href={makeUrl({ gender: g.value || undefined })} onClick={() => setMobileOpen(false)}>
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
              onClick={() => setMobileOpen(false)}
            >
              <FilterItem label={r.label} active={isActive} />
            </Link>
          );
        })}
      </FilterSection>
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className="hidden md:block w-56 flex-shrink-0 sticky top-0 h-screen overflow-y-auto py-8 px-5 border-r border-border"
      >
        {filterContent}
      </aside>

      {/* Mobile filter button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed bottom-6 right-6 z-40 flex items-center gap-2 px-5 py-3 rounded-full bg-primary text-white text-xs font-bold uppercase tracking-widest shadow-lg shadow-black/15 hover:bg-primary/90 transition-all"
      >
        <SlidersHorizontal className="w-4 h-4" />
        Filters
      </button>

      {/* Mobile filter overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex flex-col">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          {/* Panel */}
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl max-h-[80vh] overflow-y-auto animate-in slide-in-from-bottom duration-300">
            <div className="sticky top-0 bg-white z-10 flex items-center justify-between px-6 py-4 border-b border-border">
              <h3 className="text-sm font-bold uppercase tracking-widest">Filters</h3>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-2 rounded-full hover:bg-accent/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="px-6 py-6">
              {filterContent}
            </div>
          </div>
        </div>
      )}
    </>
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
