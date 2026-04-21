"use client";

import { useState, useEffect } from "react";
import { 
  Package, 
  Plus, 
  Search, 
  SlidersHorizontal, 
  Eye, 
  EyeOff, 
  Star, 
  Layers,
  MoreVertical,
  Edit3,
  Trash2,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  AlertCircle
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

// Mock data for UI demonstration - logic will be wired to dynamic actions next
const mockProducts = [
  { id: "1", name: "Classic Noir Trench", category: "Apparel", price: 12500, stock: 12, status: "Active", image: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?q=80&w=200&auto=format&fit=crop", isFeatured: true },
  { id: "2", name: "Handcrafted Leather Tote", category: "Bags", price: 8900, stock: 4, status: "Active", image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=200&auto=format&fit=crop" },
  { id: "3", name: "Alpine Knit Sweater", category: "Apparel", price: 6500, stock: 0, status: "Hidden", image: "https://images.unsplash.com/photo-1610652492500-ded49ceeb378?q=80&w=200&auto=format&fit=crop" },
];

export default function SellerProductsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="p-8 space-y-10 min-h-full">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#BFA47A]">
            — Portfolio Management
          </p>
          <h1 className="text-4xl font-light text-[#1C1A17] title">
            Your <span className="font-normal">Inventory</span>
          </h1>
        </div>
        <Link 
          href="/seller/products/new"
          className="flex items-center gap-2 px-6 py-3 bg-[#1C1A17] text-[#EDE8DF] rounded-full text-xs font-bold uppercase tracking-widest hover:bg-[#2C2A27] transition-all shadow-lg shadow-black/5"
        >
          <Plus className="w-4 h-4" />
          List New Item
        </Link>
      </header>

      {/* Stats Quick Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
         {[
           { label: "Active Listings", value: "24", icon: Eye, color: "text-emerald-600", bg: "bg-emerald-50" },
           { label: "Hidden Items", value: "3", icon: EyeOff, color: "text-[#8A857D]", bg: "bg-[#F7F5F2]" },
           { label: "Low Stock", value: "5", icon: AlertCircle, color: "text-amber-600", bg: "bg-amber-50" },
           { label: "Total Views", value: "1.2k", icon: TrendingUp, color: "text-[#BFA47A]", bg: "bg-[#BFA47A]/5" },
         ].map((stat, i) => (
           <motion.div 
             key={i}
             initial={{ opacity: 0, scale: 0.95 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ delay: i * 0.05 }}
             className={`flex items-center gap-4 p-4 rounded-2xl border border-[#E4E0D9] bg-white group hover:border-[#BFA47A] transition-all`}
           >
             <div className={`p-2.5 rounded-xl ${stat.bg}`}>
               <stat.icon className={`w-4 h-4 ${stat.color}`} />
             </div>
             <div>
               <p className="text-[9px] uppercase font-bold tracking-widest text-[#8A857D]">{stat.label}</p>
               <h4 className="text-lg font-bold text-[#1C1A17]">{stat.value}</h4>
             </div>
           </motion.div>
         ))}
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-3xl border border-[#E4E0D9] flex flex-col md:flex-row items-center gap-4 shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A857D]" />
          <Input 
            placeholder="Search your collection..." 
            className="pl-12 bg-[#F7F5F2] border-none h-12 rounded-2xl text-xs font-medium"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Button variant="outline" className="h-12 px-6 rounded-2xl border-[#E4E0D9] text-xs font-bold uppercase tracking-widest gap-2">
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </Button>
          <div className="h-8 w-[1px] bg-[#E4E0D9] mx-2 hidden md:block" />
          <p className="text-[10px] font-bold text-[#8A857D] uppercase tracking-widest hidden lg:block px-2">
            Showing {mockProducts.length} Results
          </p>
        </div>
      </div>

      {/* Inventory List */}
      <div className="space-y-4">
        <div className="hidden lg:grid grid-cols-[80px_1fr_150px_120px_120px_150px] gap-6 px-10 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#8A857D]">
          <span>Image</span>
          <span>Product Identity</span>
          <span>Category</span>
          <span>Price</span>
          <span>Stock</span>
          <span className="text-right">Manage</span>
        </div>

        <AnimatePresence>
          {mockProducts.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white border border-[#E4E0D9] rounded-3xl p-4 lg:px-10 lg:py-6 group hover:border-[#1C1A17] transition-all relative overflow-hidden"
            >
              <div className="grid grid-cols-1 lg:grid-cols-[80px_1fr_150px_120px_120px_150px] gap-6 items-center">
                {/* Visual */}
                <div className="w-20 h-20 rounded-2xl overflow-hidden border border-[#F7F5F2] relative bg-[#F7F5F2]">
                   <img src={p.image} alt={p.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                   {p.isFeatured && (
                     <div className="absolute top-1 right-1 p-1 bg-[#1C1A17] rounded-full">
                       <Star className="w-2.5 h-2.5 text-[#BFA47A] fill-[#BFA47A]" />
                     </div>
                   )}
                </div>

                {/* Identity */}
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-[#1C1A17] truncate">{p.name}</h4>
                  <div className="flex items-center gap-2">
                     <Badge variant="outline" className={`text-[9px] uppercase tracking-tighter ${p.status === "Active" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-[#F7F5F2] text-[#8A857D] border-[#E4E0D9]"}`}>
                      {p.status}
                    </Badge>
                    <span className="text-[10px] text-[#8A857D]">#ID-{p.id}023</span>
                  </div>
                </div>

                {/* Vertical Category */}
                <span className="text-xs font-bold text-[#8A857D] uppercase tracking-widest">{p.category}</span>

                {/* Monetary */}
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-[#1C1A17]">KES {p.price.toLocaleString()}</span>
                  <span className="text-[9px] text-[#8A857D] uppercase font-bold tracking-tight">Retail Price</span>
                </div>

                {/* Stock Level */}
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${p.stock === 0 ? "bg-[#DC2626]" : p.stock < 5 ? "bg-amber-500" : "bg-emerald-500"}`} />
                    <span className="text-sm font-bold text-[#1C1A17]">{p.stock}</span>
                  </div>
                  <span className="text-[9px] text-[#8A857D] uppercase font-bold tracking-tight">In Warehouse</span>
                </div>

                {/* Action Block */}
                <div className="flex items-center justify-end gap-2">
                   <Link 
                    href={`/seller/products/edit/${p.id}`}
                    className="p-3 rounded-full hover:bg-[#F7F5F2] text-[#8A857D] hover:text-[#1C1A17] transition-all"
                    title="Edit Product"
                  >
                    <Edit3 className="w-4 h-4" />
                  </Link>
                  <button className="p-3 rounded-full hover:bg-red-50 text-[#8A857D] hover:text-[#DC2626] transition-all" title="Delete listing">
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button className="p-3 rounded-full hover:bg-[#BFA47A]/10 text-[#BFA47A] transition-all" title="View Storefront">
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Interaction Overlay */}
              <div className="absolute left-0 top-0 h-full w-[2px] bg-[#BFA47A] scale-y-0 group-hover:scale-y-100 transition-transform origin-top duration-500" />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Narrative Footer */}
      <div className="bg-[#1C1A17] p-10 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-10">
        <div className="max-w-md space-y-4">
          <h3 className="text-2xl font-light text-[#EDE8DF] title">Optimize your <span className="text-[#BFA47A]">Visibility.</span></h3>
          <p className="text-xs text-[#8A857D] leading-relaxed uppercase tracking-wider">
            Featured products receive 3x more engagement. Hand-select items to highlight at the top of your shop.
          </p>
        </div>
        <Button className="bg-[#BFA47A] hover:bg-[#B09366] text-[#1C1A17] h-14 px-10 rounded-full text-[10px] font-black uppercase tracking-[0.2em] gap-2">
          Promote Selection
          <TrendingUp className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
   
