// ─────────────────────────────────────────────────────────────────────────────
// FILE: lib/actions/products.actions.ts
//
// All product-related server actions.
// Covers: public shop queries (with filters/sort/pagination),
//         admin management (create, update, delete, toggle).
//
// Every exported query that accepts filters uses the ProductFilters type —
// keep filter logic in ONE place so the shop page, category page and
// admin page all behave consistently.
// ─────────────────────────────────────────────────────────────────────────────

"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export type GenderType = "MEN" | "WOMEN" | "KIDS" | "UNISEX";

export type SortOption =
  | "newest" // createdAt DESC  (default)
  | "oldest" // createdAt ASC
  | "price_asc" // price ASC
  | "price_desc" // price DESC
  | "featured"; // isFeatured first, then newest

export type ProductFilters = {
  // ── Scope ────────────────────────────────────────────────
  categoryId?: string; // filter by DB id
  categorySlug?: string; // filter by URL slug (shop/[category])
  gender?: GenderType; // MEN | WOMEN | UNISEX
  isFeatured?: boolean; // featured-only section
  isActive?: boolean; // admin: show inactive too (omit = active only)
  sellerId?: string; // seller hub: my products only
  search?: string; // name / description full-text search

  // ── Price range ──────────────────────────────────────────
  minPrice?: number;
  maxPrice?: number;

  // ── Sort ─────────────────────────────────────────────────
  sortBy?: SortOption;

  // ── Pagination ───────────────────────────────────────────
  page?: number; // 1-based, default 1
  pageSize?: number; // default 24
};

export type ProductsResult = {
  products: ProductWithCategory[];
  total: number; // total matching records (for pagination)
  page: number;
  pageSize: number;
  totalPages: number;
};

// Minimal product shape returned by all queries (includes category + seller)
export type ProductWithCategory = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  comparePrice: number | null;
  images: string[];
  stock: number;
  isActive: boolean;
  isFeatured: boolean;
  gender: GenderType;
  createdAt: Date;
  category: { id: string; name: string; slug: string };
  seller: { id: string; name: string; shopName: string | null };
};

// ─────────────────────────────────────────────────────────────────────────────
// Helper: build Prisma where + orderBy from filters
// ─────────────────────────────────────────────────────────────────────────────

function buildWhere(filters: ProductFilters) {
  const where: Record<string, unknown> = {};

  // Default: only show active products to the public.
  // Admin passes isActive: undefined to see everything.
  if (filters.isActive !== undefined) {
    where.isActive = filters.isActive;
  } else {
    where.isActive = true;
  }

  if (filters.categoryId) where.categoryId = filters.categoryId;
  if (filters.sellerId) where.sellerId = filters.sellerId;
  if (filters.isFeatured !== undefined) where.isFeatured = filters.isFeatured;
  if (filters.gender) where.gender = filters.gender;

  // Category by slug (resolves to id via nested filter)
  if (filters.categorySlug) {
    where.category = { slug: filters.categorySlug };
  }

  // Price range
  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    const priceFilter: Record<string, number> = {};
    if (filters.minPrice !== undefined) priceFilter.gte = filters.minPrice;
    if (filters.maxPrice !== undefined) priceFilter.lte = filters.maxPrice;
    where.price = priceFilter;
  }

  // Full-text search on name + description
  if (filters.search?.trim()) {
    const q = filters.search.trim();
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
    ];
  }

  return where;
}

function buildOrderBy(sortBy?: SortOption) {
  switch (sortBy) {
    case "oldest":
      return { createdAt: "asc" as const };
    case "price_asc":
      return { price: "asc" as const };
    case "price_desc":
      return { price: "desc" as const };
    case "featured":
      return [{ isFeatured: "desc" as const }, { createdAt: "desc" as const }];
    case "newest":
    default:
      return { createdAt: "desc" as const };
  }
}

const PRODUCT_SELECT = {
  id: true,
  name: true,
  slug: true,
  description: true,
  price: true,
  comparePrice: true,
  images: true,
  stock: true,
  isActive: true,
  isFeatured: true,
  gender: true,
  createdAt: true,
  category: { select: { id: true, name: true, slug: true } },
  seller: { select: { id: true, name: true, shopName: true } },
};

// ─────────────────────────────────────────────────────────────────────────────
// READ — Public + Admin
// ─────────────────────────────────────────────────────────────────────────────

/** Main query — used by shop page, category page, search, admin list. */
export async function getProducts(
  filters: ProductFilters = {},
): Promise<ProductsResult> {
  const page = Math.max(1, filters.page ?? 1);
  const pageSize = Math.max(1, filters.pageSize ?? 24);
  const skip = (page - 1) * pageSize;

  const where = buildWhere(filters);
  const orderBy = buildOrderBy(filters.sortBy);

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      skip,
      take: pageSize,
      select: PRODUCT_SELECT,
    }),
    prisma.product.count({ where }),
  ]);

  return {
    products: products as ProductWithCategory[],
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

/** Single product by slug — for the product detail page. */
export async function getProductBySlug(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    select: {
      ...PRODUCT_SELECT,
      // Extra fields for the detail page
      updatedAt: true,
      orderItems: { select: { id: true } },
    },
  });
}

/** Single product by id — for admin edit forms. */
export async function getProductById(id: string) {
  return prisma.product.findUnique({
    where: { id },
    include: { category: true, seller: true },
  });
}

/** Featured products for homepage hero sections. */
export async function getFeaturedProducts(limit = 8) {
  return getProducts({ isFeatured: true, sortBy: "featured", pageSize: limit });
}

/** All active categories + product counts — for the shop filter sidebar. */
export async function getCategoriesWithCounts() {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { position: "asc" },
    select: {
      id: true,
      name: true,
      slug: true,
      image: true,
      _count: { select: { products: { where: { isActive: true } } } },
    },
  });
  return categories.map((c) => ({
    ...c,
    productCount: c._count.products,
  }));
}

// ─────────────────────────────────────────────────────────────────────────────
// WRITE — Admin / Seller
// ─────────────────────────────────────────────────────────────────────────────

function toSlug(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");
}

export type CreateProductInput = {
  name: string;
  description?: string;
  price: number;
  comparePrice?: number;
  images: string[];
  stock: number;
  categoryId: string;
  sellerId: string;
  gender: GenderType;
  isFeatured?: boolean;
};

export async function createProduct(data: CreateProductInput) {
  const slug = toSlug(data.name);
  const exists = await prisma.product.findUnique({ where: { slug } });
  if (exists) return { error: "A product with this name already exists." };

  await prisma.product.create({
    data: {
      name: data.name.trim(),
      slug,
      description: data.description?.trim() || null,
      price: data.price,
      comparePrice: data.comparePrice ?? null,
      images: data.images,
      stock: data.stock,
      gender: data.gender,
      categoryId: data.categoryId,
      sellerId: data.sellerId,
      isFeatured: data.isFeatured ?? false,
    },
  });

  revalidatePath("/admin/products");
  revalidatePath("/shop");
  return { success: true };
}

export type UpdateProductInput = Partial<
  Omit<CreateProductInput, "sellerId">
> & {
  isActive?: boolean;
};

export async function updateProduct(id: string, data: UpdateProductInput) {
  const payload: Record<string, unknown> = { ...data };
  if (data.name) {
    payload.name = data.name.trim();
    payload.slug = toSlug(data.name);
  }

  await prisma.product.update({ where: { id }, data: payload });
  revalidatePath("/admin/products");
  revalidatePath("/shop");
  return { success: true };
}

/** Toggle a single boolean field — isActive or isFeatured. */
export async function toggleProductField(
  id: string,
  field: "isActive" | "isFeatured",
) {
  const product = await prisma.product.findUnique({
    where: { id },
    select: { [field]: true },
  });
  if (!product) return { error: "Product not found." };

  await prisma.product.update({
    where: { id },
    data: { [field]: !(product as unknown as Record<string, boolean>)[field] },
  });

  revalidatePath("/admin/products");
  revalidatePath("/shop");
  return { success: true };
}

export async function deleteProduct(id: string) {
  // Prevent deleting a product that has been ordered
  const orderCount = await prisma.orderItem.count({ where: { productId: id } });
  if (orderCount > 0) {
    return {
      error: `Cannot delete — this product appears in ${orderCount} order(s). Deactivate it instead.`,
    };
  }

  await prisma.product.delete({ where: { id } });
  revalidatePath("/admin/products");
  revalidatePath("/shop");
  return { success: true };
}
