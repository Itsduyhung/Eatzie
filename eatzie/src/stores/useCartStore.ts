import { FoodItemD } from "@/types/foodCategory";
import { create } from "zustand";

type CartItem = FoodItemD & {
  quantity: number;
  note?: string;
};

type CartStore = {
  cart: CartItem[];

  addToCart: (item: FoodItemD) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;

  increaseQuantity: (id: number) => void;
  decreaseQuantity: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  updateNote: (id: number, note: string) => void;

  total: () => number;
  itemCount: () => number;
};

export const useCartStore = create<CartStore>((set, get) => ({
  cart: [],

  addToCart: (item) => {
    set((state) => {
      const existing = state.cart.find((i) => i.id === item.id);

      if (existing) {
        return {
          cart: state.cart.map((i) =>
            i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
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
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      ),
    }));
  },

  decreaseQuantity: (id) => {
    set((state) => ({
      cart: state.cart
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0),
    }));
  },

  updateQuantity: (id, quantity) => {
    if (quantity <= 0) {
      set((state) => ({
        cart: state.cart.filter((i) => i.id !== id),
      }));
      return;
    }

    set((state) => ({
      cart: state.cart.map((i) => (i.id === id ? { ...i, quantity } : i)),
    }));
  },

  updateNote: (id, note) => {
    set((state) => ({
      cart: state.cart.map((item) =>
        item.id === id ? { ...item, note } : item
      ),
    }));
  },

  total: () =>
    get().cart.reduce((sum, item) => sum + item.price * item.quantity, 0),

  itemCount: () => get().cart.reduce((count, item) => count + item.quantity, 0),
}));
