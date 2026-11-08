import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { CART_STORAGE_KEY } from '@/constants/STORAGE_KEYS';
import { FREE_SHIPPING_THRESHOLD } from '@/constants/SITE_CONFIG';
import { CartItem, CartItemInput } from '@/types/cart';

interface CartState {
  items: CartItem[];
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
  addItem: (item: CartItemInput) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getSubtotal: () => number;
  isFreeShipping: () => boolean;
  getFreeShippingGap: () => number;
}

/**
 * Zustand global store managing shopping cart state and cart drawer visibility.
 */
export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isDrawerOpen: false,

      openDrawer: () => set({ isDrawerOpen: true }),
      closeDrawer: () => set({ isDrawerOpen: false }),
      toggleDrawer: () => set((state) => ({ isDrawerOpen: !state.isDrawerOpen })),

      addItem: (itemInput: CartItemInput) => {
        const { items } = get();
        const quantityToAdd = itemInput.quantity || 1;
        const existingIndex = items.findIndex((i) => i.productId === itemInput.productId);

        if (existingIndex > -1) {
          const updatedItems = [...items];
          const existingItem = updatedItems[existingIndex];
          const newQty = Math.min(existingItem.quantity + quantityToAdd, existingItem.stock);
          updatedItems[existingIndex] = { ...existingItem, quantity: newQty };
          set({ items: updatedItems, isDrawerOpen: true });
        } else {
          const newItem: CartItem = {
            productId: itemInput.productId,
            name: itemInput.name,
            slug: itemInput.slug,
            price: itemInput.price,
            image: itemInput.image,
            stock: itemInput.stock,
            quantity: Math.min(quantityToAdd, itemInput.stock),
          };
          set({ items: [...items, newItem], isDrawerOpen: true });
        }
      },

      removeItem: (productId: string) => {
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        }));
      },

      updateQuantity: (productId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }

        set((state) => ({
          items: state.items.map((item) => {
            if (item.productId === productId) {
              const safeQty = Math.min(quantity, item.stock);
              return { ...item, quantity: safeQty };
            }
            return item;
          }),
        }));
      },

      clearCart: () => set({ items: [] }),

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      },

      isFreeShipping: () => {
        return get().getSubtotal() >= FREE_SHIPPING_THRESHOLD;
      },

      getFreeShippingGap: () => {
        const subtotal = get().getSubtotal();
        return Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
      },
    }),
    {
      name: CART_STORAGE_KEY,
      partialize: (state) => ({ items: state.items }),
    },
  ),
);
