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
  Edit3,
  Trash2,
  ExternalLink,
  TrendingUp,
  AlertCircle,
  Loader2
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useSession } from "@/lib/auth-client";
import { getProducts, deleteProduct, toggleProductField } from "@/actions/products";
import { toast } from "sonner";

export default function SellerProductsPage() {
  const { data: session } = useSession();
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const sellerId = session?.user?.id;

  const fetchProducts = async () => {
    if (!sellerId) return;
    setLoading(true);
    try {
      const result = await getProducts({
        sellerId,
        isActive: undefined, // show all including hidden
        pageSize: 100,
      });
      setProducts(result.products || []);
    } catch (err) {
      toast.error("Failed to load products");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (sellerId) {
      fetchProducts();
    }
  }, [sellerId]);

  const handleDelete = async (productId: string, productName: string) => {
    if (!confirm(`Are you sure you want to delete "${productName}"?`)) return;
    const result = await deleteProduct(productId);
    if (result.success) {
      setProducts(products.filter(p => p.id !== productId));
      toast.success("Product deleted successfully");
    } else {
      toast.error(result.error || "Failed to delete product");
    }
  };

  const handleToggleActive = async (productId: string) => {
    const result = await toggleProductField(productId, "isActive");
    if (result.success) {
      setProducts(products.map(p => 
        p.id === productId ? { ...p, isActive: !p.isActive } : p
      ));
      toast.success("Product visibility updated");
    } else {
      toast.error(result.error || "Failed to update product");
    }
  };

  // Filter products by search
  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Stats
  const activeCount = products.filter(p => p.isActive).length;
  const hiddenCount = products.filter(p => !p.isActive).length;
  const lowStockCount = products.filter(p => p.totalStock > 0 && p.totalStock < 5).length;
  const totalProducts = products.length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#BFA47A]" />
      </div>
    );
  }

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
           { label: "Active Listings", value: activeCount.toString(), icon: Eye, color: "text-emerald-600", bg: "bg-emerald-50" },
           { label: "Hidden Items", value: hiddenCount.toString(), icon: EyeOff, color: "text-[#8A857D]", bg: "bg-[#F7F5F2]" },
           { label: "Low Stock", value: lowStockCount.toString(), icon: AlertCircle, color: "text-amber-600", bg: "bg-amber-50" },
           { label: "Total Products", value: totalProducts.toString(), icon: Package, color: "text-[#BFA47A]", bg: "bg-[#BFA47A]/5" },
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
          <div className="h-8 w-[1px] bg-[#E4E0D9] mx-2 hidden md:block" />
          <p className="text-[10px] font-bold text-[#8A857D] uppercase tracking-widest hidden lg:block px-2">
            Showing {filteredProducts.length} Results
          </p>
        </div>
      </div>

      {/* Inventory List */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-16">
          <Package className="w-12 h-12 mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 font-medium">
            {products.length === 0 ? "No products listed yet." : "No products match your search."}
          </p>
          {products.length === 0 && (
            <Link
              href="/seller/products/new"
              className="inline-flex items-center gap-2 mt-4 px-6 py-3 bg-[#1C1A17] text-[#EDE8DF] rounded-full text-xs font-bold uppercase tracking-widest hover:bg-[#2C2A27] transition-all"
            >
              <Plus className="w-4 h-4" />
              List Your First Item
            </Link>
          )}
        </div>
      ) : (
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
            {filteredProducts.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white border border-[#E4E0D9] rounded-3xl p-4 lg:px-10 lg:py-6 group hover:border-[#1C1A17] transition-all relative overflow-hidden"
              >
                <div className="grid grid-cols-1 lg:grid-cols-[80px_1fr_150px_120px_120px_150px] gap-6 items-center">
                  {/* Visual */}
                  <div className="w-20 h-20 rounded-2xl overflow-hidden border border-[#F7F5F2] relative bg-[#F7F5F2]">
                     {p.images?.[0] ? (
                       <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                     ) : (
                       <div className="w-full h-full flex items-center justify-center text-gray-400">
                         <Package className="w-6 h-6" />
                       </div>
                     )}
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
                       <Badge variant="outline" className={`text-[9px] uppercase tracking-tighter ${p.isActive ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-[#F7F5F2] text-[#8A857D] border-[#E4E0D9]"}`}>
                        {p.isActive ? "Active" : "Hidden"}
                      </Badge>
                      <span className="text-[10px] text-[#8A857D]">#{p.id.slice(0, 8)}</span>
                    </div>
                  </div>

                  {/* Category */}
                  <span className="text-xs font-bold text-[#8A857D] uppercase tracking-widest">{p.category?.name || "—"}</span>

                  {/* Price */}
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-[#1C1A17]">KES {p.price.toLocaleString()}</span>
                    {p.discountPrice && (
                      <span className="text-[9px] text-red-500 font-bold">Sale: KES {p.discountPrice.toLocaleString()}</span>
                    )}
                  </div>

                  {/* Stock Level */}
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${p.totalStock === 0 ? "bg-[#DC2626]" : p.totalStock < 5 ? "bg-amber-500" : "bg-emerald-500"}`} />
                      <span className="text-sm font-bold text-[#1C1A17]">{p.totalStock}</span>
                    </div>
                    <span className="text-[9px] text-[#8A857D] uppercase font-bold tracking-tight">In Stock</span>
                  </div>

                  {/* Action Block */}
                  <div className="flex items-center justify-end gap-2">
                     <button
                       onClick={() => handleToggleActive(p.id)}
                       className="p-3 rounded-full hover:bg-[#F7F5F2] text-[#8A857D] hover:text-[#1C1A17] transition-all"
                       title={p.isActive ? "Hide Product" : "Show Product"}
                     >
                       {p.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                     </button>
                     <Link 
                      href={`/seller/products/edit/${p.id}`}
                      className="p-3 rounded-full hover:bg-[#F7F5F2] text-[#8A857D] hover:text-[#1C1A17] transition-all"
                      title="Edit Product"
                    >
                      <Edit3 className="w-4 h-4" />
                    </Link>
                    <button 
                      onClick={() => handleDelete(p.id, p.name)}
                      className="p-3 rounded-full hover:bg-red-50 text-[#8A857D] hover:text-[#DC2626] transition-all" 
                      title="Delete listing"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <Link
                      href={`/shop/${p.category?.slug}/${p.slug}`}
                      target="_blank"
                      className="p-3 rounded-full hover:bg-[#BFA47A]/10 text-[#BFA47A] transition-all"
                      title="View in Store"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  </div>
                </div>

                {/* Interaction Overlay */}
                <div className="absolute left-0 top-0 h-full w-[2px] bg-[#BFA47A] scale-y-0 group-hover:scale-y-100 transition-transform origin-top duration-500" />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

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
