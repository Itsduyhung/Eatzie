import { FoodItem } from "@/types/foodCategory";
import { create } from "zustand";

type CartStore = {
  cart: FoodItem[];
  addToCart: (item: FoodItem) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  updateQuantity: (id: string, quantity: number) => void;
  increaseQuantity: (id: string) => void;
  decreaseQuantity: (id: string) => void;
  total: () => number;
  itemCount: () => number;
  updateNote: (id: string, note: string) => void;
};

export const useCartStore = create<CartStore>((set, get) => ({
  cart: [],
  addToCart: (item) => {
    set((state) => {
      const existingItem = state.cart.find((i) => i.id === item.id);

      if (existingItem) {
        return {
          cart: state.cart.map((i) =>
            i.id === item.id ? { ...i, quantity: (i.quantity ?? 1) + 1 } : i
          ),
        };
      }

      return {
        cart: [...state.cart, { ...item, quantity: 1 }],
      };
    });
  },
  removeFromCart: (id) => {
    set((state) => ({
      cart: state.cart.filter((item) => item.id !== id),
    }));
  },
  clearCart: () => set({ cart: [] }),
  increaseQuantity: (id) => {
    set((state) => ({
      cart: state.cart.map((item) =>
        item.id === id ? { ...item, quantity: (item.quantity ?? 1) + 1 } : item
      ),
    }));
  },
  decreaseQuantity: (id) => {
    set((state) => ({
      cart: state.cart
        .map((item) =>
          item.id === id
            ? { ...item, quantity: Math.max((item.quantity ?? 1) - 1, 0) }
            : item
        )
        .filter((item) => item.quantity! > 0),
    }));
  },
  updateNote: (id, note) => {
    set((state) => ({
      cart: state.cart.map((item) =>
        item.id === id ? { ...item, note } : item
      ),
    }));
  },
  /*************  ✨ Windsurf Command ⭐  *************/
  /**
   * Calculates the total price of all items in the cart.
   *
   * @returns The total price of all items in the cart.
   */
  /*******  a57aacea-6b59-4e5e-9fa2-92bc89c124c0  *******/
  total: () =>
    get().cart.reduce(
      (sum, item) => sum + item.price * (item.quantity ?? 1),
      0
    ),
  updateQuantity: (id, quantity) => {
    if (quantity <= 0) {
      get().removeFromCart(id);
    } else {
      set({
        cart: get().cart.map((i) => (i.id === id ? { ...i, quantity } : i)),
      });
    }
  },
  itemCount: () =>
    get().cart.reduce((count, item) => count + (item.quantity ?? 1), 0),
}));
