import { OrderService } from "@/domain/service/OrderService";
import { OrderCreateResProps } from "@/types/order.types";
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

type OrderStoreState = {
  orderId?: number;
  itemsId: number[];
  items: OrderCreateResProps["items"];
  totalAmount?: number;
  status?: string;
  createdAt?: string;
  loading: Record<number, boolean>;
  error: Record<number, string | null>;

  setOrderId: (orderId: number) => void;
  setStatus: (status: string) => void;
  fetchOrder: (id: number) => Promise<void>;
};

export const useOrderStore = create<OrderStoreState>()(
  subscribeWithSelector((set, get) => ({
    orderId: undefined,
    itemsId: [],
    items: [],
    totalAmount: undefined,
    status: undefined,
    createdAt: undefined,
    loading: {},
    error: {},

    setOrderId: (orderId) => set({ orderId }),
    setStatus: (status) => set({ status }),

    fetchOrder: async (id: number) => {
      set((state) => ({
        loading: { ...state.loading, [id]: true },
        error: { ...state.error, [id]: null },
      }));

      try {
        const response = await OrderService.getOrderById(id);
        if (!response.data) throw new Error("Không có dữ liệu đơn hàng");

        const order: OrderCreateResProps = {
          orderId: response.data.orderId,
          createdAt: response.data.createdAt,
          totalAmount: response.data.totalAmount,
          status: response.data.status,
          items: response.data.items,
        };

        const itemsId: number[] = order.items.map((item) => item.foodId);

        set({
          orderId: order.orderId,
          items: order.items,
          itemsId,
          totalAmount: order.totalAmount,
          status: order.status,
          createdAt: order.createdAt,
          loading: { ...get().loading, [id]: false },
        });
      } catch (err: any) {
        set((state) => ({
          loading: { ...state.loading, [id]: false },
          error: { ...state.error, [id]: err.message || "Lỗi không xác định" },
        }));
      }
    },
  }))
);
