/**
 * Cart Store (Zustand)
 * 
 * Purpose: Global state management for shopping cart
 * Features: Add/remove items, update quantities, persist to localStorage
 * Used by: Customer pages (menu, cart, checkout)
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  menu_item_id: string;
  name: string;
  description?: string;
  price: number;
  image_url?: string;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (menuItemId: string) => void;
  updateQuantity: (menuItemId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
  getItemQuantity: (menuItemId: string) => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        const items = get().items;
        const existingItem = items.find((i) => i.menu_item_id === item.menu_item_id);

        if (existingItem) {
          set({
            items: items.map((i) =>
              i.menu_item_id === item.menu_item_id
                ? { ...i, quantity: i.quantity + 1 }
                : i
            ),
          });
        } else {
          set({
            items: [...items, { ...item, quantity: 1 }],
          });
        }
      },
      removeItem: (menuItemId) => {
        set({
          items: get().items.filter((i) => i.menu_item_id !== menuItemId),
        });
      },
      updateQuantity: (menuItemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(menuItemId);
          return;
        }
        set({
          items: get().items.map((i) =>
            i.menu_item_id === menuItemId ? { ...i, quantity } : i
          ),
        });
      },
      clearCart: () => {
        set({ items: [] });
      },
      getTotal: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      },
      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },
      getItemQuantity: (menuItemId) => {
        const item = get().items.find((i) => i.menu_item_id === menuItemId);
        return item ? item.quantity : 0;
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);

