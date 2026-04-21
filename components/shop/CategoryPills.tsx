"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
  image: string | null;
}

interface CategoryPillsProps {
  categories: Category[];
}

export default function CategoryPills({ categories }: CategoryPillsProps) {
  if (categories.length === 0) return null;

  return (
    <div className="w-full py-8">
      {/* <div className="flex items-center justify-between mb-6 px-2">
        <h2 className="text-[0.65rem] font-bold uppercase tracking-[0.25em] text-[#8A857D]">
          Shop by Category
        </h2>
        <Link 
          href="/shop" 
          className="group flex items-center gap-1.5 text-[0.6rem] font-bold uppercase tracking-[0.15em] text-foreground hover:text-primary transition-colors"
        >
          View All
          <ChevronRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div> */}

      <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/shop?category=${category.slug}`}
            className="flex-shrink-0 group"
          >
            <div className="flex items-center gap-3 pl-1 pr-3 py-1 rounded-full border border-[#E4E0D9] bg-white transition-all duration-300 hover:border-[#BFA47A] ">
              <div className="w-8 h-8 rounded-full overflow-hidden border border-[#F0EDE8] group-hover:border-[#BFA47A]/30 transition-colors ">
                {category.image ? (
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[0.5rem] font-bold text-primary uppercase tracking-tighter">
                    N/A
                  </div>
                )}
              </div>
              <span className="text-xs font-bold text-primary tracking-tight group-hover:text-[#BFA47A] transition-colors leading-none">
                {category.name}
              </span>
            </div>
          </Link>
        ))}
      </div>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
