import { FoodItemD } from "@/types/foodCategory";
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

export type CartItem = FoodItemD & {
  quantity: number;
  note?: string;
};

export type CartSnapshot = {
  orderId: number;
  items: CartItem[];
  date: string;
};

export type CartStore = {
  cart: CartItem[];
  cartSnapshots: CartSnapshot[];

  addToCart: (item: FoodItemD) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
  clearCartAfterOrder: (orderId: number, date: string) => void;
  getFoodsById: (foodIds: number[], snapshotOrderId?: number) => CartItem[];

  increaseQuantity: (id: number) => void;
  decreaseQuantity: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  updateNote: (id: number, note: string) => void;

  total: () => number;
  totalSnapshot: (snapshot: CartSnapshot) => number;
  itemCount: () => number;

  removeCartSnapshot: (orderId: number) => void;
};

const calcTotal = (items: CartItem[]) =>
  items.reduce((sum, item) => sum + item.price * item.quantity, 0);

export const useCartStore = create(
  subscribeWithSelector<CartStore>((set, get) => ({
    cart: [],
    cartSnapshots: [],

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

    clearCartAfterOrder: (orderId, date) => {
      const existing = get().cartSnapshots.find((s) => s.orderId === orderId);
      if (existing) return; // Không lưu nếu đã có snapshot cùng orderId

      const snapshot: CartSnapshot = {
        orderId,
        items: [...get().cart],
        date,
      };

      set((state) => ({
        cartSnapshots: [...state.cartSnapshots, snapshot],
        cart: [],
      }));

      console.log("Snapshot saved for orderId:", orderId, snapshot);
      console.log("All snapshots:", get().cartSnapshots);
    },

    getFoodsById: (foodIds, snapshotOrderId) => {
      if (snapshotOrderId != null) {
        const snapshot = get().cartSnapshots.find(
          (s) => s.orderId === snapshotOrderId
        );
        if (!snapshot) return [];
        return foodIds
          .map((id) => snapshot.items.find((i) => i.id === id))
          .filter(Boolean) as CartItem[];
      }
      return [];
    },

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

    total: () => calcTotal(get().cart),
    totalSnapshot: (snapshot) => calcTotal(snapshot.items),
    itemCount: () =>
      get().cart.reduce((count, item) => count + item.quantity, 0),

    removeCartSnapshot: (orderId) => {
      set((state) => ({
        cartSnapshots: state.cartSnapshots.filter(
          (snapshot) => snapshot.orderId !== orderId
        ),
      }));
    },
  }))
);
