"use client";

import { useState, useEffect } from "react";
import { 
  Package, 
  Plus, 
  Search, 
  Eye, 
  EyeOff, 
  Star,
  Edit3, 
  Trash2,
  TrendingUp,
  AlertCircle,
  Loader2,
  X
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
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; productId: string; productName: string }>({
    open: false,
    productId: "",
    productName: "",
  });
  const [isDeleting, setIsDeleting] = useState(false);

  const sellerId = session?.user?.id;

  const fetchProducts = async () => {
    if (!sellerId) return;
    setLoading(true);
    try {
      const result = await getProducts({
        sellerId,
        isActive: undefined,
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

  const openDeleteDialog = (productId: string, productName: string) => {
    setDeleteDialog({ open: true, productId, productName });
  };

  const closeDeleteDialog = () => {
    setDeleteDialog({ open: false, productId: "", productName: "" });
  };

  const handleDelete = async () => {
    if (!deleteDialog.productId) return;
    setIsDeleting(true);
    try {
      const result = await deleteProduct(deleteDialog.productId);
      if (result.success) {
        setProducts(products.filter(p => p.id !== deleteDialog.productId));
        toast.success("Product deleted successfully");
      } else {
        toast.error(result.error || "Failed to delete product");
      }
    } catch (err) {
      toast.error("Failed to delete product");
    }
    setIsDeleting(false);
    closeDeleteDialog();
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

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
    <div className="p-8 space-y-10 min-h-full" style={{ background: "#F7F5F2" }}>
      {/* Header Section */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#BFA47A]">
            — Product Management
          </p>
          <h1 className="text-4xl font-light title">
            Your <span className="font-normal  ">Inventory</span>
          </h1>
        </div>
        <Link 
          href="/seller/products/new"
          className="flex items-center gap-2 px-6 py-3 bg-primary text-[#EDE8DF] rounded-md text-xs font-bold uppercase tracking-widest hover:bg-[#2C2A27] transition-all shadow shadow-black/5"
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
             className={`flex items-center gap-4 p-4 rounded-xl border border-[#E4E0D9] bg-white group hover:border-[#BFA47A] transition-all`}
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
      <div className="bg-white p-4 rounded-xl border border-[#E4E0D9] flex flex-col md:flex-row items-center gap-4 shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A857D]" />
          <Input 
            placeholder="Search your collection..." 
            className="pl-12 bg-[#F7F5F2] border-none h-12 rounded-xl text-xs font-medium"
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

      {/* Inventory Table  */}
      {filteredProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 rounded-2xl text-center bg-white" style={{ border: "1px solid #E4E0D9" }}>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3" style={{ background: "rgba(191,164,122,0.08)", border: "1px solid rgba(191,164,122,0.15)" }}>
            <Package className="w-5 h-5" style={{ color: "#BFA47A" }} />
          </div>
          <p className="text-sm font-medium mb-1" style={{ color: "#1C1A17" }}>
            {products.length === 0 ? "No products listed yet" : "No products match your search"}
          </p>
          <p className="text-xs mb-5" style={{ color: "#8A857D", maxWidth: "24ch" }}>
            {products.length === 0
              ? "Add the first product to start building your inventory."
              : "Try adjusting your search terms."}
          </p>
          {products.length === 0 && (
            <Link href="/seller/products/new">
              <span className="inline-flex items-center gap-2 px-4 h-9 rounded-lg text-sm font-semibold" style={{ background: "#1C1A17", color: "#F7F5F2" }}>
                <Plus className="w-3.5 h-3.5" /> List Your First Item
              </span>
            </Link>
          )}
        </div>
      ) : (
        <div className="rounded-xl overflow-hidden" style={{ border: "1px solid #E4E0D9" }}>
          {/* Header row */}
          <div
            className="grid grid-cols-[3fr_1fr_1fr_1fr_1fr_120px] gap-4 px-5 py-2.5"
            style={{ background: "#F7F5F2", borderBottom: "1px solid #E4E0D9" }}
          >
            {["Product", "Category", "Status", "Price", "Stock", ""].map(h => (
              <span key={h} className="text-[0.6rem] uppercase tracking-[0.18em] font-semibold" style={{ color: "#8A857D" }}>{h}</span>
            ))}
          </div>

          {/* Rows */}
          {filteredProducts.map((p, i) => (
            <div
              key={p.id}
              className="grid grid-cols-[3fr_1fr_1fr_1fr_1fr_120px] gap-4 items-center px-5 py-3.5"
              style={{
                background: "#FFFFFF",
                borderBottom: i < filteredProducts.length - 1 ? "1px solid #F0EDE8" : "none",
              }}
            >
              {/* Name + image */}
              <div className="flex items-center gap-3 min-w-0">
                {p.images?.[0] ? (
                  <img src={p.images[0]} alt="" className="w-9 h-9 rounded object-cover flex-shrink-0" style={{ border: "1px solid #E4E0D9" }} />
                ) : (
                  <div className="w-9 h-9 rounded flex items-center justify-center flex-shrink-0" style={{ background: "#F7F5F2", border: "1px solid #E4E0D9" }}>
                    <Package className="w-4 h-4" style={{ color: "#8A857D" }} />
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: "#1C1A17" }}>{p.name}</p>
                  <p className="text-xs truncate" style={{ color: "#8A857D" }}>/{p.slug}</p>
                </div>
                {p.isFeatured && (
                  <Star className="w-3 h-3 flex-shrink-0" style={{ color: "#BFA47A" }} />
                )}
              </div>

              <span className="text-xs px-2 py-1 rounded-md w-fit" style={{ background: "#F7F5F2", color: "#8A857D", border: "1px solid #E4E0D9" }}>
                {p.category?.name || "—"}
              </span>

              <span className="text-xs px-2 py-1 rounded-md w-fit font-medium" style={{
                background: p.isActive ? "rgba(34,197,94,0.08)" : "rgba(239,68,68,0.08)",
                color: p.isActive ? "#16A34A" : "#DC2626",
                border: `1px solid ${p.isActive ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)"}`,
              }}>
                {p.isActive ? "Active" : "Hidden"}
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
                  {p.variants?.length || 0} variant(s)
                </span>
              </span>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggleActive(p.id)}
                  className="cursor-pointer p-2 rounded-lg transition-colors"
                  style={{ color: "#8A857D" }}
                  title={p.isActive ? "Hide Product" : "Show Product"}
                >
                  {p.isActive ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button> 
                <Link 
                  href={`/seller/products/${p.id}`}
                  className="p-2 rounded-lg transition-colors hover:text-[#BFA47A]"
                  style={{ color: "#8A857D" }}
                  title="Edit Product"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </Link>
                <button 
                  onClick={() => openDeleteDialog(p.id, p.name)}
                  className="p-2 cursor-pointer rounded-lg transition-colors hover:text-[#DC2626]"
                  style={{ color: "#8A857D" }}
                  title="Delete listing"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AnimatePresence>
        {deleteDialog.open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
            onClick={closeDeleteDialog}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: "spring", duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 w-full max-w-sm mx-4 shadow-2xl"
              style={{ border: "1px solid #E4E0D9" }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold" style={{ color: "#1C1A17" }}>Delete Product</h3>
                <button 
                  onClick={closeDeleteDialog}
                  className="p-1 rounded-lg hover:bg-[#F7F5F2] transition-colors"
                >
                  <X className="w-4 h-4" style={{ color: "#8A857D" }} />
                </button>
              </div>
              <p className="text-xs leading-relaxed mb-6" style={{ color: "#8A857D" }}>
                Are you sure you want to delete <strong style={{ color: "#1C1A17" }}>"{deleteDialog.productName}"</strong>? This action cannot be undone.
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={closeDeleteDialog}
                  className="flex-1 h-10 rounded-xl text-xs font-semibold transition-all"
                  style={{ background: "#F7F5F2", color: "#1C1A17", border: "1px solid #E4E0D9" }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex-1 h-10 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2"
                  style={{ background: "#DC2626", color: "#FFFFFF" }}
                >
                  {isDeleting ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="w-3.5 h-3.5" />
                  )}
                  {isDeleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Narrative Footer */}
      <div className="bg-[#1C1A17] p-10 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-10">
        <div className="max-w-md space-y-4">
          <h3 className="text-2xl font-light text-[#EDE8DF] title">Optimize your <span className="text-[#BFA47A]">Visibility.</span></h3>
          <p className="text-xs text-[#8A857D] leading-relaxed uppercase tracking-wider">
            Featured products receive 3x more engagement. Hand-select items to highlight at the top of your shop.
          </p>
        </div>
        <Button className="bg-[#BFA47A] hover:bg-[#B09366] text-white h-14 px-10 rounded-md text-[10px] font-black uppercase tracking-[0.2em] gap-2">
          Promote Selection
          <TrendingUp className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

