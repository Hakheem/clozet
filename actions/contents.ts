"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// ─────────────────────────────────────────────────────────────────────────────
// CATEGORIES
// ─────────────────────────────────────────────────────────────────────────────

function toSlug(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");
}

export async function getCategories() {
  return prisma.category.findMany({
    orderBy: [{ position: "asc" }, { name: "asc" }],
  });
}

export async function createCategory(data: {
  name: string;
  description?: string;
  image?: string;
}) {
  const slug = toSlug(data.name);

  // Guard against duplicate slugs
  const existing = await prisma.category.findUnique({ where: { slug } });
  if (existing) {
    return { error: "A category with this name already exists." };
  }

  await prisma.category.create({
    data: {
      name: data.name.trim(),
      slug,
      description: data.description?.trim() || null,
      image: data.image?.trim() || null,
    },
  });

  revalidatePath("/admin/content");
  revalidatePath("/"); // homepage may display categories
  revalidatePath("/shop");

  return { success: true };
}

export async function updateCategory(
  id: string,
  data: {
    name?: string;
    description?: string;
    image?: string;
    isActive?: boolean;
    position?: number;
  },
) {
  const payload: Record<string, unknown> = { ...data };
  if (data.name) {
    payload.slug = toSlug(data.name);
    payload.name = data.name.trim();
  }

  await prisma.category.update({ where: { id }, data: payload });
  revalidatePath("/admin/content");
  revalidatePath("/");
  revalidatePath("/shop");

  return { success: true };
}

export async function deleteCategory(id: string) {
  // Prevent deleting a category that still has products
  const productCount = await prisma.product.count({
    where: { categoryId: id },
  });
  if (productCount > 0) {
    return {
      error: `Cannot delete — ${productCount} product${productCount !== 1 ? "s" : ""} still use this category.`,
    };
  }

  await prisma.category.delete({ where: { id } });
  revalidatePath("/admin/content");
  revalidatePath("/");
  revalidatePath("/shop");

  return { success: true };
}

// ─────────────────────────────────────────────────────────────────────────────
// SITE CONTENT  (hero texts, announcement bar, etc.)
// ─────────────────────────────────────────────────────────────────────────────

// Keys that exist by default. Seed these with Prisma db seed if not present.
export const CONTENT_KEYS = [
  { key: "hero_headline", label: "Hero Headline" },
  { key: "hero_subtext", label: "Hero Subtext" },
  { key: "announcement_bar", label: "Announcement Bar Text" },
] as const;

export async function getSiteContent() {
  const rows = await prisma.siteContent.findMany();
  // Return as a key→value map for easy consumption
  return Object.fromEntries(rows.map((r) => [r.key, r.value])) as Record<
    string,
    string
  >;
}

export async function upsertSiteContent(key: string, value: string) {
  // Find the label for this key (fallback to key itself)
  const meta = CONTENT_KEYS.find((k) => k.key === key);
  const label = meta?.label ?? key;

  await prisma.siteContent.upsert({
    where: { key },
    update: { value: value.trim() },
    create: { key, label, value: value.trim() },
  });

  revalidatePath("/admin/content");
  revalidatePath("/");

  return { success: true };
}

// ─────────────────────────────────────────────────────────────────────────────
// BANNERS
// ─────────────────────────────────────────────────────────────────────────────

export async function getBanners() {
  return prisma.banner.findMany({
    orderBy: { position: "asc" },
  });
}

export async function upsertBanner(data: {
  id?: string;
  title: string;
  subtitle?: string;
  buttonText?: string;
  buttonHref?: string;
  image?: string;
  type: "GRID" | "OVERLAY";
  isActive: boolean;
  position: number;
}) {
  if (data.id) {
    await prisma.banner.update({
      where: { id: data.id },
      data: {
        title: data.title.trim(),
        subtitle: data.subtitle?.trim() || null,
        buttonText: data.buttonText?.trim() || null,
        buttonHref: data.buttonHref?.trim() || null,
        image: data.image?.trim() || null,
        type: data.type,
        isActive: data.isActive,
        position: data.position,
      },
    });
  } else {
    await prisma.banner.create({
      data: {
        title: data.title.trim(),
        subtitle: data.subtitle?.trim() || null,
        buttonText: data.buttonText?.trim() || null,
        buttonHref: data.buttonHref?.trim() || null,
        image: data.image?.trim() || null,
        type: data.type,
        isActive: data.isActive,
        position: data.position,
      },
    });
  }

  revalidatePath("/admin/content");
  revalidatePath("/");

  return { success: true };
}

export async function deleteBanner(id: string) {
  await prisma.banner.delete({ where: { id } });
  revalidatePath("/admin/content");
  revalidatePath("/");
  return { success: true };
}
