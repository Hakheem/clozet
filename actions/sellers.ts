"use server";

import { prisma } from "@/lib/prisma";

export type SellerWithStats = {
  id: string;
  name: string;
  shopName: string | null;
  bio: string | null;
  location: string | null;
  image: string | null;
  instagram: string | null;
  facebook: string | null;
  tiktok: string | null;
  productCount: number;
  products: Array<{
    id: string;
    name: string;
    slug: string;
    images: string[];
    price: number;
    discountPrice: number | null;
  }>;
};

export async function getSellers(): Promise<SellerWithStats[]> {
  const sellers = await prisma.user.findMany({
    where: {
      role: "SELLER",
      onboarded: true, // only show onboarded sellers
    },
    select: {
      id: true,
      name: true,
      shopName: true,
      bio: true,
      location: true,
      image: true,
      instagram: true,
      facebook: true,
      tiktok: true,
      products: {
        where: { isActive: true },
        select: {
          id: true,
          name: true,
          slug: true,
          images: true,
          price: true,
          discountPrice: true,
        },
        take: 6, // Get first 6 products per seller for preview
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return sellers.map((seller) => ({
    ...seller,
    productCount: seller.products.length,
  }));
}

export async function getSellerById(id: string) {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      shopName: true,
      bio: true,
      location: true,
      image: true,
      instagram: true,
      facebook: true,
      tiktok: true,
      products: {
        where: { isActive: true },
        select: {
          id: true,
          name: true,
          slug: true,
          images: true,
          price: true,
          discountPrice: true,
          category: { select: { slug: true } },
        },
      },
    },
  });
}
