"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { 
  ArrowLeft, 
  Loader2, 
  Plus, 
  ChevronRight,
  Package,
  BadgeDollarSign,
  Layers, 
  Users,
  Image as ImageIcon
} from "lucide-react";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import { getCategories } from "@/actions/contents";
import { createProduct, type GenderType, type ProductStatus, type ProductVariantType, type VariantInput } from "@/actions/products";
import ProductImageUpload from "@/components/admin/ProductImageUpload";
import VariantManager from "@/components/admin/VariantManager";

// ─── Shared UI Helpers ───────────────────────────────────────────────────────

const Section = ({ title, description, children, icon: Icon }: any) => (
  <div className="bg-white rounded-2xl p-6 border border-[#E4E0D9] shadow-sm space-y-6">
    <div className="flex items-start gap-4">
      <div className="w-10 h-10 rounded-xl bg-[#F7F5F2] border border-[#E4E0D9] flex items-center justify-center flex-shrink-0">
        <Icon className="w-5 h-5 text-[#BFA47A]" />
      </div>
      <div>
        <h3 className="text-[#1C1A17] font-bold text-sm tracking-tight capitalize">{title}</h3>
        <p className="text-[#8A857D] text-xs mt-0.5">{description}</p>
      </div>
    </div>
    <div className="space-y-4 pt-2">
      {children}
    </div>
  </div>
);

const Field = ({ label, children, hint }: any) => (
  <div className="space-y-1.5">
    <label className="block text-[0.65rem] font-bold uppercase tracking-[0.18em] text-[#8A857D]">
      {label}
    </label>
    {children}
    {hint && <p className="text-[0.65rem] text-[#8A857D]">{hint}</p>}
  </div>
);

const Input = (props: any) => (
  <input
    {...props}
    className="w-full h-10 px-4 rounded-xl text-sm outline-none transition-all duration-200 border border-[#E4E0D9] bg-[#F7F5F2] text-[#1C1A17] hover:border-[#BFA47A] focus:border-[#BFA47A] focus:ring-1 focus:ring-[#BFA47A]/20"
  />
);

const Select = (props: any) => (
  <select
    {...props}
    className="w-full h-10 px-4 rounded-xl text-sm outline-none transition-all duration-200 border border-[#E4E0D9] bg-[#F7F5F2] text-[#1C1A17] hover:border-[#BFA47A] focus:border-[#BFA47A] appearance-none"
  >
    {props.children}
  </select>
);

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function NewProductPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [isPending, startTransition] = useTransition();

  const [form, setForm] = useState({
    name: "",
    intro: "",
    description: "",
    price: 0,
    discountPrice: 0,
    images: [] as string[],
    categoryId: "",
    gender: "UNISEX" as GenderType,
    status: "NORMAL" as ProductStatus,
    variantType: "TSHIRT" as ProductVariantType,
    brand: "",
    material: "",
    totalStock: 0,
    isFeatured: false,
    variants: [] as VariantInput[],
  });

  useEffect(() => {
    getCategories().then(cats => {
      setCategories(cats);
      if (cats.length > 0) {
        setForm(f => ({ ...f, categoryId: cats[0].id }));
      }
    });
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!session?.user?.id) return toast.error("You must be logged in.");
    if (!form.name.trim()) return toast.error("Product name is required.");
    if (form.price <= 0) return toast.error("Price must be greater than zero.");
    if (!form.categoryId) return toast.error("Please select a category.");
    if (form.images.length === 0) return toast.error("Add at least one image.");

    startTransition(async () => {
      const res = await createProduct({
        ...form,
        sellerId: session.user.id,
        price: Number(form.price),
        discountPrice: form.discountPrice ? Number(form.discountPrice) : undefined,
        totalStock: Number(form.totalStock),
      });

      if (res.error) {
        toast.error(res.error);
        return;
      }

      toast.success("Product created successfully.");
      router.push("/admin/products");
    });
  };

  return (
    <div className="min-h-full bg-[#F7F5F2]">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-white border-b border-[#E4E0D9] px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/products" className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-[#F7F5F2] transition-colors border border-transparent hover:border-[#E4E0D9]">
            <ArrowLeft className="w-5 h-5 text-[#1C1A17]" />
          </Link>
          <div className="h-4 w-px bg-[#E4E0D9] mx-1" />
          <nav className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#8A857D]">
            <Link href="/admin/products" className="hover:text-[#1C1A17] transition-colors">Products</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#1C1A17]">New Listing</span>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="px-6 h-10 rounded-xl text-xs font-bold uppercase tracking-widest text-[#8A857D] hover:bg-[#F7F5F2] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isPending}
            className="px-8 h-10 rounded-xl text-xs font-bold uppercase tracking-widest bg-[#1C1A17] text-white flex items-center gap-2 hover:bg-[#2C2A27] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Publishing...
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                Publish Product
              </>
            )}
          </button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto p-10">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-8">
            {/* General Info */}
            <Section title="Product Details" description="Define the core identity of your piece." icon={Package}>
              <Field label="Product Name *">
                <Input 
                  placeholder="e.g. Classic Silk Scarf" 
                  value={form.name}
                  onChange={(e: any) => setForm({ ...form, name: e.target.value })}
                />
              </Field>
              <Field label="Short Intro" hint="A catchy one-liner for the product card.">
                <Input 
                  placeholder="e.g. Hand-woven silk with a timeless floral pattern" 
                  value={form.intro}
                  onChange={(e: any) => setForm({ ...form, intro: e.target.value })}
                />
              </Field>
              <Field label="Description">
                <textarea
                  rows={6}
                  placeholder="Tell the story behind this piece..."
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200 border border-[#E4E0D9] bg-[#F7F5F2] text-[#1C1A17] hover:border-[#BFA47A] focus:border-[#BFA47A] focus:ring-1 focus:ring-[#BFA47A]/20 resize-none font-sans"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </Field>
            </Section>

            {/* Media */}
            <Section title="Visual Assets" description="Upload up to 8 high-resolution photos. First image is the cover." icon={ImageIcon}>
              <ProductImageUpload 
                value={form.images}
                onChange={(imgs) => setForm({ ...form, images: imgs })}
              />
            </Section>
          </div>

          <div className="lg:col-span-1 space-y-8">
            {/* Classification */}
            <Section title="Classification" description="Categorize and target your audience." icon={Layers}>
              <Field label="Category *">
                <div className="relative">
                  <Select 
                    value={form.categoryId}
                    onChange={(e: any) => setForm({ ...form, categoryId: e.target.value })}
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </Select>
                  <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                    <ChevronRight className="w-4 h-4 text-[#8A857D] rotate-90" />
                  </div>
                </div>
              </Field>

              <Field label="Gender Target">
                <div className="relative">
                  <Select 
                    value={form.gender}
                    onChange={(e: any) => setForm({ ...form, gender: e.target.value as GenderType })}
                  >
                    <option value="UNISEX">Unisex</option>
                    <option value="MEN">Men</option>
                    <option value="WOMEN">Women</option>
                    <option value="KIDS">Kids</option>
                  </Select>
                  <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                    <ChevronRight className="w-4 h-4 text-[#8A857D] rotate-90" />
                  </div>
                </div>
              </Field>

              <Field label="Variant Type *">
                <div className="relative">
                  <Select 
                    value={form.variantType}
                    onChange={(e: any) => setForm({ ...form, variantType: e.target.value as ProductVariantType })}
                  >
                    <option value="TSHIRT">T-Shirt</option>
                    <option value="JACKET">Jacket</option>
                    <option value="HOODIE">Hoodie</option>
                    <option value="BOOTS">Boots</option>
                    <option value="SNEAKERS">Sneakers</option>
                    <option value="SOCKS">Socks</option>
                    <option value="TROUSERS">Trousers</option>
                    <option value="SHORTS">Shorts</option>
                    <option value="ACCESSORIES">Accessories</option>
                  </Select>
                  <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                    <ChevronRight className="w-4 h-4 text-[#8A857D] rotate-90" />
                  </div>
                </div>
              </Field>

            </Section>

            {/* Visibility */}
            <Section title="Promotion" description="Highlight this product on the shop." icon={Users}>
              <label className="flex items-center justify-between p-3 rounded-xl border border-[#E4E0D9] bg-[#F7F5F2] cursor-pointer hover:bg-[#F0EDE8] transition-colors">
                <span className="text-xs font-bold uppercase tracking-wider text-[#1C1A17]">Featured Product</span>
                <input 
                  type="checkbox" 
                  className="w-5 h-5 rounded border-[#E4E0D9] text-[#BFA47A] focus:ring-[#BFA47A]"
                  checked={form.isFeatured}
                  onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                />
              </label>
              <p className="text-[0.6rem] text-[#8A857D] leading-relaxed">
                Featured products appear in premium homepage sections and at the top of category pages.
              </p>
            </Section>
          </div>

          {/* Pricing & Full Width Variants */}
          <div className="lg:col-span-3 grid grid-cols-1 lg:grid-cols-3 gap-8 pt-8 border-t border-[#E4E0D9]">
            <Section title="Pricing & Attributes" description="Set your price point and origin." icon={BadgeDollarSign}>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Original Price (KES) *">
                  <Input 
                    type="number" 
                    placeholder="0.00"
                    value={form.price}
                    onChange={(e: any) => setForm({ ...form, price: e.target.value })}
                  />
                </Field>
                <Field label="Discounted Price">
                  <Input 
                    type="number" 
                    placeholder="0.00"
                    value={form.discountPrice}
                    onChange={(e: any) => setForm({ ...form, discountPrice: e.target.value })}
                  />
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Brand / Designer" hint="Optional">
                  <Input 
                    placeholder="e.g. Nike" 
                    value={form.brand}
                    onChange={(e: any) => setForm({ ...form, brand: e.target.value })}
                  />
                </Field>
                <Field label="Material" hint="Optional">
                  <Input 
                    placeholder="e.g. 100% Cotton" 
                    value={form.material}
                    onChange={(e: any) => setForm({ ...form, material: e.target.value })}
                  />
                </Field>
              </div>
              <Field label="Total Stock pool *" hint="The overall quantity available. Individual variants can optionally specify their own share from this pool.">
                <Input 
                  type="number" 
                  placeholder="0"
                  value={form.totalStock}
                  onChange={(e: any) => setForm({ ...form, totalStock: e.target.value })}
                />
              </Field>
            </Section>

            <div className="lg:col-span-2">
              <Section title="Variants" description="Add sizes and colors." icon={Package}>
                <VariantManager 
                  variants={form.variants}
                  onChange={(vs) => setForm({ ...form, variants: vs })}
                />
              </Section>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
