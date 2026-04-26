"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  discountPrice?: number;
  image: string;
  category: string;
  quantity: number;
  stock: number;
  size?: string | null;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        const currentItems = get().items;
        const existingItem = currentItems.find((i) => i.id === item.id);

        if (existingItem) {
          // Don't add more than stock
          if (existingItem.quantity >= item.stock) return;
          set({
            items: currentItems.map((i) =>
              i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i,
            ),
          });
        } else {
          set({
            items: [...currentItems, { ...item, quantity: 1 } as CartItem],
          });
        }
      },
      removeItem: (id) => {
        set({ items: get().items.filter((i) => i.id !== id) });
      },
      updateQuantity: (id, quantity) => {
        const currentItems = get().items;
        const item = currentItems.find((i) => i.id === id);

        if (!item) return;

        // Don't update if exceeds stock
        if (quantity > item.stock) {
          return;
        }

        // If quantity is 0 or less, remove the item
        if (quantity <= 0) {
          set({ items: currentItems.filter((i) => i.id !== id) });
          return;
        }

        set({
          items: currentItems.map((i) =>
            i.id === id ? { ...i, quantity } : i,
          ),
        });
      },
      clearCart: () => set({ items: [] }),
      getTotal: () => {
        return get().items.reduce((total, item) => {
          const price = item.discountPrice || item.price;
          return total + price * item.quantity;
        }, 0);
      },
      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: "cart-storage",
    },
  ),
);

interface FavoritesStore {
  favorites: string[]; // product ids
  toggleFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
}

export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      favorites: [],
      toggleFavorite: (productId) => {
        const current = get().favorites;
        if (current.includes(productId)) {
          set({ favorites: current.filter((id) => id !== productId) });
        } else {
          set({ favorites: [...current, productId] });
        }
      },
      isFavorite: (productId) => get().favorites.includes(productId),
    }),
    {
      name: "favorites-storage",
    },
  ),
);

interface CompareStore {
  compareIds: string[];
  addToCompare: (productId: string) => void;
  removeFromCompare: (productId: string) => void;
  clearCompare: () => void;
  isInCompare: (productId: string) => boolean;
}

export const useCompareStore = create<CompareStore>()(
  persist(
    (set, get) => ({
      compareIds: [],
      addToCompare: (productId) => {
        const current = get().compareIds;
        if (current.length >= 4) return; // Limit comparison to 4 items
        if (!current.includes(productId)) {
          set({ compareIds: [...current, productId] });
        }
      },
      removeFromCompare: (productId) => {
        set({ compareIds: get().compareIds.filter((id) => id !== productId) });
      },
      clearCompare: () => set({ compareIds: [] }),
      isInCompare: (productId) => get().compareIds.includes(productId),
    }),
    {
      name: "compare-storage",
    },
  ),
);
