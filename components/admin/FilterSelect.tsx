"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";

interface FilterSelectProps {
  label: string;
  value: string;
  paramKey: string;
  options: { value: string; label: string }[];
}

export default function FilterSelect({
  label,
  value,
  paramKey,
  options,
}: FilterSelectProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const handleValueChange = (newValue: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (newValue) {
      params.set(paramKey, newValue);
    } else {
      params.delete(paramKey);
    }
    
    // Reset to page 1 whenever a filter changes
    params.set("page", "1");
    
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="relative">
      <select
        value={value}
        className="h-8 pl-3 pr-7 rounded-lg text-xs font-medium appearance-none outline-none transition-all cursor-pointer"
        style={{ 
          background: "#F7F5F2", 
          border: "1px solid #E4E0D9", 
          color: "#1C1A17" 
        }}
        onChange={(e) => handleValueChange(e.target.value)}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
        <ChevronRight className="w-3 h-3 text-[#8A857D] rotate-90" />
      </div>
    </div>
  );
}
