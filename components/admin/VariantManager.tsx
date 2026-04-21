"use client";

import { Plus, Trash2, CheckCircle2 } from "lucide-react";
import { useState } from "react";

interface Variant {
  id?: string;
  size?: string;
  color?: string;
  stock?: number;
}

interface VariantManagerProps {
  variants: Variant[];
  onChange: (variants: Variant[]) => void;
}

const APPAREL_SIZES = ["S", "M", "L", "XL", "XXL", "XXXL"];

export default function VariantManager({
  variants,
  onChange,
}: VariantManagerProps) {
  const [quickSize, setQuickSize] = useState("");
  const [quickColor, setQuickColor] = useState("");

  const addVariant = (size?: string, color?: string) => {
    onChange([...variants, { size: size || "", color: color || "", stock: undefined }]);
  };

  const removeVariant = (index: number) => {
    onChange(variants.filter((_, i) => i !== index));
  };

  const updateVariant = (index: number, field: keyof Variant, value: any) => {
    const newVariants = [...variants];
    newVariants[index] = { ...newVariants[index], [field]: value === "" ? undefined : value };
    onChange(newVariants);
  };

  const addQuickCombo = () => {
    if (!quickSize && !quickColor) return;
    addVariant(quickSize, quickColor);
    setQuickSize("");
    setQuickColor("");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-widest text-[#8A857D]">
          Rapid Variant Entry
        </h3>
      </div>

      {/* Quick Add Form */}
      <div className="p-4 rounded-xl border border-[#E4E0D9] bg-[#F7F5F2] space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[0.6rem] uppercase font-bold text-[#8A857D]">Quick Sizes</label>
            <div className="flex flex-wrap gap-1.5">
              {APPAREL_SIZES.map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setQuickSize(s)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                    quickSize === s 
                      ? "bg-[#1C1A17] text-white border-[#1C1A17]" 
                      : "bg-white text-[#1C1A17] border-[#E4E0D9] hover:border-[#BFA47A]"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
            <input 
              type="text"
              placeholder="Or type custom size (e.g. 42, 32W)"
              value={quickSize}
              onChange={(e) => setQuickSize(e.target.value)}
              className="w-full h-9 px-3 rounded-lg text-xs border border-[#E4E0D9] outline-none focus:border-[#BFA47A] transition-colors bg-white mt-2"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[0.6rem] uppercase font-bold text-[#8A857D]">Color / Attribute</label>
            <input 
              type="text"
              placeholder="e.g. Midnight Black, Cotton, etc."
              value={quickColor}
              onChange={(e) => setQuickColor(e.target.value)}
              className="w-full h-9 px-3 rounded-lg text-xs border border-[#E4E0D9] outline-none focus:border-[#BFA47A] transition-colors bg-white"
            />
            <p className="text-[0.6rem] text-[#8A857D]">Fast entry: Add one or both to create a variant.</p>
          </div>
        </div>

        <button
          type="button"
          onClick={addQuickCombo}
          disabled={!quickSize && !quickColor}
          className="w-full h-9 rounded-lg text-xs font-bold uppercase tracking-widest bg-[#BFA47A] text-white flex items-center justify-center gap-2 hover:bg-[#A68F68] transition-all disabled:opacity-50"
        >
          <Plus className="w-3.5 h-3.5" />
          Add to List
        </button>
      </div>

      {/* Variant List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-2">
          <h4 className="text-[0.65rem] font-bold uppercase tracking-wider text-[#8A857D]">
            Manage Combinations ({variants.length})
          </h4>
        </div>

        {variants.length === 0 ? (
          <div className="py-8 text-center rounded-xl border border-dashed border-[#E4E0D9]">
            <p className="text-xs text-[#8A857D]">No combinations added. Use the quick entry above.</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {variants.map((v, i) => (
              <div 
                key={i} 
                className="grid grid-cols-[1fr_1fr_100px_40px] gap-3 items-center p-2 rounded-xl border border-[#F0EDE8] bg-white group hover:border-[#E4E0D9] transition-all"
              >
                <div className="space-y-1">
                  <span className="text-[0.55rem] uppercase font-bold text-[#8A857D] block ml-1">Size</span>
                  <input
                    type="text"
                    value={v.size || ""}
                    onChange={(e) => updateVariant(i, "size", e.target.value)}
                    className="w-full h-8 px-2 rounded-md text-xs border border-transparent bg-[#F7F5F2] focus:bg-white focus:border-[#BFA47A] outline-none transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[0.55rem] uppercase font-bold text-[#8A857D] block ml-1">Color</span>
                  <input
                    type="text"
                    value={v.color || ""}
                    onChange={(e) => updateVariant(i, "color", e.target.value)}
                    className="w-full h-8 px-2 rounded-md text-xs border border-transparent bg-[#F7F5F2] focus:bg-white focus:border-[#BFA47A] outline-none transition-all"
                  />
                </div>
                <div className="space-y-1 text-right">
                  <span className="text-[0.55rem] uppercase font-bold text-[#8A857D] block mr-1">Qty (Opt)</span>
                  <input
                    type="number"
                    min="0"
                    placeholder="Global"
                    value={v.stock === undefined ? "" : v.stock}
                    onChange={(e) => updateVariant(i, "stock", e.target.value === "" ? undefined : parseInt(e.target.value))}
                    className="w-full h-8 px-2 rounded-md text-xs border border-transparent bg-[#F7F5F2] focus:bg-white focus:border-[#BFA47A] outline-none transition-all text-right"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeVariant(i)}
                  className="mt-4 p-2 text-[#8A857D] hover:text-[#DC2626] transition-colors rounded-lg hover:bg-red-50 opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
