"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { CONTENT_KEYS } from "@/lib/content-keys";
import { 
  uploadToCloudinary, 
  deleteFromCloudinary, 
  LUKKUU_FOLDERS 
} from "@/lib/cloudinary";

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

  let imageUrl = data.image?.trim() || null;

  // If image is a base64 string, upload to Cloudinary
  if (imageUrl?.startsWith("data:image")) {
    try {
      const upload = await uploadToCloudinary(imageUrl, LUKKUU_FOLDERS.CATEGORIES);
      imageUrl = upload.secure_url;
    } catch (error) {
      console.error("Cloudinary upload failed:", error);
      return { error: "Failed to upload image to Cloudinary." };
    }
  }

  await prisma.category.create({
    data: {
      name: data.name.trim(),
      slug,
      description: data.description?.trim() || null,
      image: imageUrl,
    },
  });

  revalidatePath("/admin/content");
  revalidatePath("/");
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
  const existing = await prisma.category.findUnique({ 
    where: { id },
    select: { image: true }
  });

  if (!existing) return { error: "Category not found." };

  const payload: Record<string, unknown> = { ...data };
  if (data.name) {
    payload.slug = toSlug(data.name);
    payload.name = data.name.trim();
  }

  // Handle image replacement
  if (data.image && data.image.startsWith("data:image")) {
    try {
      // Delete old image if it exists
      if (existing.image) {
        await deleteFromCloudinary(existing.image);
      }
      
      const upload = await uploadToCloudinary(data.image, LUKKUU_FOLDERS.CATEGORIES);
      payload.image = upload.secure_url;
    } catch (error) {
      console.error("Cloudinary update failed:", error);
      return { error: "Failed to upload new image." };
    }
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

  const existing = await prisma.category.findUnique({ 
    where: { id },
    select: { image: true }
  });

  if (existing?.image) {
    await deleteFromCloudinary(existing.image);
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
// CONTENT_KEYS is imported from @/lib/content-keys (cannot export non-async values from "use server" files)

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
  const payload: any = {
    title: data.title.trim(),
    subtitle: data.subtitle?.trim() || null,
    buttonText: data.buttonText?.trim() || null,
    buttonHref: data.buttonHref?.trim() || null,
    type: data.type,
    isActive: data.isActive,
    position: data.position,
  };

  let imageUrl = data.image?.trim() || null;

  // Handle Cloudinary upload for Banner if it's a new image
  if (imageUrl?.startsWith("data:image")) {
    // If updating, delete the old image first
    if (data.id) {
      const old = await prisma.banner.findUnique({ 
        where: { id: data.id }, 
        select: { image: true } 
      });
      if (old?.image) await deleteFromCloudinary(old.image);
    }

    try {
      const upload = await uploadToCloudinary(imageUrl, LUKKUU_FOLDERS.BANNERS);
      imageUrl = upload.secure_url;
    } catch (error) {
      console.error("Banner upload failed:", error);
    }
  }
  
  payload.image = imageUrl;

  if (data.id) {
    await prisma.banner.update({
      where: { id: data.id },
      data: payload,
    });
  } else {
    await prisma.banner.create({
      data: payload,
    });
  }

  revalidatePath("/admin/content");
  revalidatePath("/");

  return { success: true };
}

export async function deleteBanner(id: string) {
  const existing = await prisma.banner.findUnique({ 
    where: { id }, 
    select: { image: true } 
  });
  if (existing?.image) await deleteFromCloudinary(existing.image);

  await prisma.banner.delete({ where: { id } });
  revalidatePath("/admin/content");
  revalidatePath("/");
  return { success: true };
}
