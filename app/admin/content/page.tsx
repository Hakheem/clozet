"use client";

import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import {
  Tag,
  Type,
  Image as ImageIcon,
  Plus,
  Trash2,
  Save,
  ToggleLeft,
  ToggleRight,
  GripVertical,
  Loader2,
  AlertCircle,
  Megaphone,
} from "lucide-react";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getSiteContent,
  upsertSiteContent,
  getBanners,
  upsertBanner,
  deleteBanner,
  CONTENT_KEYS,
} from "@/actions/contents";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────
type Category = {
  id: string; name: string; slug: string; description: string | null;
  image: string | null; isActive: boolean; position: number;
};
type Banner = {
  id: string; title: string; subtitle: string | null; buttonText: string | null;
  buttonHref: string | null; image: string | null; type: "GRID" | "OVERLAY";
  isActive: boolean; position: number;
};

// ─────────────────────────────────────────────────────────────────────────────
// Shared sub-components
// ─────────────────────────────────────────────────────────────────────────────
const Field = ({
  label, children, hint,
}: { label: string; children: React.ReactNode; hint?: string }) => (
  <div className="space-y-1.5">
    <label className="block text-xs font-semibold uppercase tracking-[0.14em]"
      style={{ color: "#8A857D" }}>
      {label}
    </label>
    {children}
    {hint && <p className="text-xs" style={{ color: "#8A857D" }}>{hint}</p>}
  </div>
);

const TextInput = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    {...props}
    className="w-full h-9 px-3 rounded-lg text-sm outline-none transition-all duration-150"
    style={{
      background: "#F7F5F2",
      border: "1px solid #E4E0D9",
      color: "#1C1A17",
      fontFamily: "var(--font-dm-sans, sans-serif)",
      ...(props.style || {}),
    }}
    onFocus={e => (e.target.style.borderColor = "rgba(191,164,122,0.6)")}
    onBlur={e => (e.target.style.borderColor = "#E4E0D9")}
  />
);

const TextArea = (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea
    {...props}
    className="w-full px-3 py-2 rounded-lg text-sm outline-none transition-all duration-150 resize-none"
    style={{
      background: "#F7F5F2",
      border: "1px solid #E4E0D9",
      color: "#1C1A17",
      fontFamily: "var(--font-dm-sans, sans-serif)",
      ...(props.style || {}),
    }}
    onFocus={e => (e.target.style.borderColor = "rgba(191,164,122,0.6)")}
    onBlur={e => (e.target.style.borderColor = "#E4E0D9")}
  />
);

const SaveButton = ({ loading, label = "Save" }: { loading: boolean; label?: string }) => (
  <button
    type="submit"
    disabled={loading}
    className="inline-flex items-center gap-2 px-4 h-9 rounded-lg text-sm font-semibold transition-all duration-150"
    style={{
      background: loading ? "rgba(28,26,23,0.4)" : "#1C1A17",
      color: "#F7F5F2",
      fontFamily: "var(--font-dm-sans, sans-serif)",
    }}
  >
    {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
    {label}
  </button>
);

// ─────────────────────────────────────────────────────────────────────────────
// Tab: Categories
// ─────────────────────────────────────────────────────────────────────────────
function CategoriesTab() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState({ name: "", description: "", image: "" });
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);

  useEffect(() => {
    getCategories().then(c => { setCategories(c as Category[]); setLoading(false); });
  }, []);

  const refresh = () => getCategories().then(c => setCategories(c as Category[]));

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return toast.error("Category name is required.");
    startTransition(async () => {
      const res = await createCategory(form);
      if (res.error) {
        toast.error(res.error);
        return;
      }
      toast.success(`"${form.name}" created.`);
      setForm({ name: "", description: "", image: "" });
      await refresh();
    });
  };

  const handleToggle = (cat: Category) => {
    startTransition(async () => {
      await updateCategory(cat.id, { isActive: !cat.isActive });
      await refresh();
    });
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    startTransition(async () => {
      const res = await deleteCategory(deleteTarget.id);
      if (res.error) { toast.error(res.error); return; }
      toast.success(`"${deleteTarget.name}" deleted.`);
      setDeleteTarget(null);
      await refresh();
    });
  };

  return (
    <div className="space-y-6">
      {/* Add form */}
      <div className="rounded-xl p-6" style={{ background: "#FFFFFF", border: "1px solid #E4E0D9" }}>
        <h3 className="text-sm font-bold title mb-4" style={{ color: "#1C1A17" }}>
          Add Category
        </h3>
        <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Field label="Name *">
            <TextInput
              placeholder="e.g. Bags"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            />
          </Field>
          <Field label="Description">
            <TextInput
              placeholder="Short description (optional)"
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            />
          </Field>
          <Field label="Image URL" hint="Paste a hosted image URL">
            <TextInput
              placeholder="https://..."
              value={form.image}
              onChange={e => setForm(f => ({ ...f, image: e.target.value }))}
            />
          </Field>
          <div className="md:col-span-3 flex justify-end">
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center gap-2 px-4 h-9 rounded-lg text-sm font-semibold transition-all duration-150"
              style={{ background: "#1C1A17", color: "#F7F5F2" }}
            >
              {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
              Add Category
            </button>
          </div>
        </form>
      </div>

      {/* List */}
      <div className="rounded-xl overflow-hidden" style={{ border: "1px solid #E4E0D9" }}>
        <div className="px-5 py-3" style={{ background: "#FFFFFF", borderBottom: "1px solid #E4E0D9" }}>
          <p className="text-xs uppercase tracking-[0.18em] font-semibold" style={{ color: "#8A857D" }}>
            {categories.length} {categories.length === 1 ? "Category" : "Categories"}
          </p>
        </div>
        {loading ? (
          <div className="flex items-center justify-center h-32" style={{ background: "#FFFFFF" }}>
            <Loader2 className="w-5 h-5 animate-spin" style={{ color: "#BFA47A" }} />
          </div>
        ) : categories.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-14 text-center" style={{ background: "#FFFFFF" }}>
            <Tag className="w-8 h-8 mb-3" style={{ color: "#E4E0D9" }} />
            <p className="text-sm font-medium" style={{ color: "#1C1A17" }}>No categories yet</p>
            <p className="text-xs mt-1" style={{ color: "#8A857D" }}>Add your first category above.</p>
          </div>
        ) : (
          <div>
            {categories.map((cat, i) => (
              <div
                key={cat.id}
                className="flex items-center gap-3 px-5 py-3.5"
                style={{
                  background: "#FFFFFF",
                  borderBottom: i < categories.length - 1 ? "1px solid #F0EDE8" : "none",
                }}
              >
                <GripVertical className="w-4 h-4 flex-shrink-0" style={{ color: "#E4E0D9" }} />
                {cat.image && (
                  <img src={cat.image} alt="" className="w-8 h-8 rounded object-cover flex-shrink-0"
                    style={{ border: "1px solid #E4E0D9" }} />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold" style={{ color: "#1C1A17" }}>{cat.name}</p>
                  <p className="text-xs" style={{ color: "#8A857D" }}>/{cat.slug}</p>
                </div>
                {/* Active toggle */}
                <button onClick={() => handleToggle(cat)} className="transition-opacity">
                  {cat.isActive
                    ? <ToggleRight className="w-5 h-5" style={{ color: "#BFA47A" }} />
                    : <ToggleLeft className="w-5 h-5" style={{ color: "#E4E0D9" }} />}
                </button>
                <span className="text-xs px-2 py-0.5 rounded-full"
                  style={{
                    background: cat.isActive ? "rgba(191,164,122,0.1)" : "#F7F5F2",
                    color: cat.isActive ? "#BFA47A" : "#8A857D",
                    border: `1px solid ${cat.isActive ? "rgba(191,164,122,0.25)" : "#E4E0D9"}`,
                  }}>
                  {cat.isActive ? "Active" : "Hidden"}
                </span>
                <button onClick={() => setDeleteTarget(cat)} className="transition-colors"
                  style={{ color: "#E4E0D9" }}
                  onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.color = "#DC2626")}
                  onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.color = "#E4E0D9")}>
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete confirm */}
      <AlertDialog open={!!deleteTarget} onOpenChange={o => !o && setDeleteTarget(null)}>
        <AlertDialogContent className="max-w-sm rounded-xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete "{deleteTarget?.name}"?</AlertDialogTitle>
            <AlertDialogDescription style={{ color: "#8A857D" }}>
              This is permanent. Products using this category must be reassigned first.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className="flex-1 rounded-lg">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isPending}
              className="flex-1 rounded-lg"
              style={{ background: "#DC2626", color: "#FFF" }}>
              {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Tab: Site Texts
// ─────────────────────────────────────────────────────────────────────────────
function TextsTab() {
  const [content, setContent] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    getSiteContent().then(c => { setContent(c); setLoading(false); });
  }, []);

  const handleSave = async (key: string) => {
    setSaving(key);
    try {
      await upsertSiteContent(key, content[key] ?? "");
      toast.success("Saved.");
    } catch {
      toast.error("Failed to save.");
    } finally {
      setSaving(null);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-40">
      <Loader2 className="w-5 h-5 animate-spin" style={{ color: "#BFA47A" }} />
    </div>
  );

  return (
    <div className="space-y-4">
      {CONTENT_KEYS.map(({ key, label }) => (
        <div key={key} className="rounded-xl p-5"
          style={{ background: "#FFFFFF", border: "1px solid #E4E0D9" }}>
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm font-bold title" style={{ color: "#1C1A17" }}>{label}</p>
              <p className="text-xs font-mono mt-0.5" style={{ color: "#8A857D" }}>{key}</p>
            </div>
            <button
              onClick={() => handleSave(key)}
              disabled={saving === key}
              className="inline-flex items-center gap-1.5 px-3 h-8 rounded-lg text-xs font-semibold transition-all"
              style={{ background: "#1C1A17", color: "#F7F5F2" }}
            >
              {saving === key ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
              Save
            </button>
          </div>
          <TextArea
            rows={key === "hero_headline" ? 2 : 3}
            value={content[key] ?? ""}
            onChange={e => setContent(c => ({ ...c, [key]: e.target.value }))}
            placeholder={
              key === "hero_headline" ? "Be Seen, Be Remembered." :
                key === "hero_subtext" ? "Every piece tells a story…" :
                  "Free shipping on orders over KES 3,000"
            }
          />
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Tab: Banners
// ─────────────────────────────────────────────────────────────────────────────
const BANNER_POSITIONS = [
  { pos: 1, label: "Banner 1 (Left / First)", defaultType: "OVERLAY" as const },
  { pos: 2, label: "Banner 2 (Right / Second)", defaultType: "GRID" as const },
];

function BannersTab() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<number | null>(null);
  const [forms, setForms] = useState<Record<number, Partial<Banner>>>({});

  useEffect(() => {
    getBanners().then(data => {
      setBanners(data as Banner[]);
      // Pre-fill forms with existing banner data
      const map: Record<number, Partial<Banner>> = {};
      BANNER_POSITIONS.forEach(({ pos, defaultType }) => {
        const found = (data as Banner[]).find(b => b.position === pos);
        map[pos] = found ?? { title: "", subtitle: "", buttonText: "", buttonHref: "", image: "", type: defaultType, isActive: true, position: pos };
      });
      setForms(map);
      setLoading(false);
    });
  }, []);

  const handleSave = async (pos: number) => {
    const data = forms[pos];
    if (!data?.title?.trim()) return toast.error("Title is required.");
    setSaving(pos);
    try {
      await upsertBanner({
        id: banners.find(b => b.position === pos)?.id,
        title: data.title!,
        subtitle: data.subtitle || "",
        buttonText: data.buttonText || "",
        buttonHref: data.buttonHref || "",
        image: data.image || "",
        type: data.type ?? "OVERLAY",
        isActive: data.isActive ?? true,
        position: pos,
      });
      toast.success("Banner saved.");
      getBanners().then(d => setBanners(d as Banner[]));
    } catch {
      toast.error("Failed to save banner.");
    } finally {
      setSaving(null);
    }
  };

  const setField = (pos: number, field: keyof Banner, value: unknown) =>
    setForms(f => ({ ...f, [pos]: { ...f[pos], [field]: value } }));

  if (loading) return (
    <div className="flex items-center justify-center h-40">
      <Loader2 className="w-5 h-5 animate-spin" style={{ color: "#BFA47A" }} />
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {BANNER_POSITIONS.map(({ pos, label, defaultType }) => {
        const form = forms[pos] ?? {};
        const isSaving = saving === pos;

        return (
          <div key={pos} className="rounded-xl p-6 space-y-4"
            style={{ background: "#FFFFFF", border: "1px solid #E4E0D9" }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold title" style={{ color: "#1C1A17" }}>{label}</p>
                <p className="text-xs mt-0.5" style={{ color: "#8A857D" }}>
                  Type: {form.type ?? defaultType} — {form.type === "GRID" ? "Image | Text columns" : "Full bg + gradient overlay"}
                </p>
              </div>
              {/* Active toggle */}
              <button onClick={() => setField(pos, "isActive", !form.isActive)}>
                {form.isActive
                  ? <ToggleRight className="w-5 h-5" style={{ color: "#BFA47A" }} />
                  : <ToggleLeft className="w-5 h-5" style={{ color: "#E4E0D9" }} />}
              </button>
            </div>

            {/* Type selector */}
            <Field label="Layout Type">
              <div className="flex gap-2">
                {(["OVERLAY", "GRID"] as const).map(t => (
                  <button key={t} type="button"
                    onClick={() => setField(pos, "type", t)}
                    className="flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all"
                    style={{
                      background: form.type === t ? "#1C1A17" : "#F7F5F2",
                      color: form.type === t ? "#F7F5F2" : "#8A857D",
                      border: `1px solid ${form.type === t ? "#1C1A17" : "#E4E0D9"}`,
                    }}>
                    {t === "OVERLAY" ? "Overlay" : "Grid"}
                  </button>
                ))}
              </div>
            </Field>

            <Field label="Title *">
              <TextInput value={form.title ?? ""} onChange={e => setField(pos, "title", e.target.value)} placeholder="New Season Arrivals" />
            </Field>
            <Field label="Subtitle">
              <TextInput value={form.subtitle ?? ""} onChange={e => setField(pos, "subtitle", e.target.value)} placeholder="Discover the latest drops" />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Button Label">
                <TextInput value={form.buttonText ?? ""} onChange={e => setField(pos, "buttonText", e.target.value)} placeholder="Shop Now" />
              </Field>
              <Field label="Button Link">
                <TextInput value={form.buttonHref ?? ""} onChange={e => setField(pos, "buttonHref", e.target.value)} placeholder="/shop" />
              </Field>
            </div>
            <Field label="Image URL" hint="Hosted image URL (Cloudinary, Uploadthing, etc.)">
              <TextInput value={form.image ?? ""} onChange={e => setField(pos, "image", e.target.value)} placeholder="https://..." />
            </Field>

            <div className="flex justify-end pt-1">
              <button
                onClick={() => handleSave(pos)}
                disabled={isSaving}
                className="inline-flex items-center gap-2 px-4 h-9 rounded-lg text-sm font-semibold transition-all"
                style={{ background: isSaving ? "rgba(28,26,23,0.4)" : "#1C1A17", color: "#F7F5F2" }}
              >
                {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                Save Banner
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main page
// ─────────────────────────────────────────────────────────────────────────────
const TABS = [
  { id: "categories", label: "Categories", icon: Tag },
  { id: "texts", label: "Site Texts", icon: Type },
  { id: "banners", label: "CTA Banners", icon: ImageIcon },
] as const;

type TabId = typeof TABS[number]["id"];

export default function ContentPage() {
  const [activeTab, setActiveTab] = useState<TabId>("categories");

  return (
    <div className="min-h-full" style={{ background: "#F7F5F2" }}>

      {/* Top bar */}
      <header className="sticky top-0 z-10 px-8 h-16 flex items-center justify-between"
        style={{ background: "#FFFFFF", borderBottom: "1px solid #E4E0D9" }}>
        <div>
          <p className="text-[0.6rem] uppercase tracking-[0.22em] font-semibold mb-0.5"
            style={{ color: "#BFA47A" }}>
            Site
          </p>
          <h1 className="text-lg font-bold leading-none title" style={{ color: "#1C1A17" }}>
            Content
          </h1>
        </div>
        <p className="text-xs" style={{ color: "#8A857D" }}>
          Changes save immediately and revalidate the site.
        </p>
      </header>

      <div className="p-8 space-y-6">

        {/* Tab bar */}
        <div className="flex gap-1 p-1 rounded-xl w-fit"
          style={{ background: "#FFFFFF", border: "1px solid #E4E0D9" }}>
          {TABS.map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150"
                style={{
                  background: active ? "#1C1A17" : "transparent",
                  color: active ? "#F7F5F2" : "#8A857D",
                  fontFamily: "var(--font-dm-sans, sans-serif)",
                }}>
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab content */}
        {activeTab === "categories" && <CategoriesTab />}
        {activeTab === "texts" && <TextsTab />}
        {activeTab === "banners" && <BannersTab />}
      </div>
    </div>
  );
}

