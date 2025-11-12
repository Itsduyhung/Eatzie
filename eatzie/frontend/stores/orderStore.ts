import { OrderService } from "@/domain/service/OrderService";
import { OrderCreateResProps, OrderItemProps } from "@/types/order.types";
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

type OrderStoreState = {
  orderId?: number;
  items: OrderItemProps[];
  itemsId: number[];
  totalAmount?: number;
  status?: string;
  createdAt?: string;

  incomingOrders: OrderCreateResProps[]; // "Đang đến" = "Đã thanh toán"
  completedOrders: OrderCreateResProps[]; // "Lịch sử" = "Đã giao hàng"

  loading: Record<number, boolean>;
  error: Record<number, string | null>;

  setOrderId: (id: number) => void;
  setStatus: (status: string) => void;
  clearOrders: () => void;
  fetchOrder: (id: number) => Promise<void>;
};

export const useOrderStore = create<OrderStoreState>()(
  subscribeWithSelector((set, get) => ({
    orderId: undefined,
    items: [],
    itemsId: [],
    totalAmount: undefined,
    status: undefined,
    createdAt: undefined,
    incomingOrders: [],
    completedOrders: [],
    loading: {},
    error: {},

    setOrderId: (orderId) => set({ orderId }),
    setStatus: (status) => set({ status }),
    clearOrders: () =>
      set({
        incomingOrders: [],
        completedOrders: [],
      }),

    fetchOrder: async (id: number) => {
      set((state) => ({
        loading: { ...state.loading, [id]: true },
        error: { ...state.error, [id]: null },
      }));

      try {
        const order: OrderCreateResProps = await OrderService.getOrderById(id);

        const itemsId = order.items.map((i) => i.foodId);

        set((state) => {
          let incomingOrders = state.incomingOrders.filter(
            (o) => o.orderId !== order.orderId
          );
          let completedOrders = state.completedOrders.filter(
            (o) => o.orderId !== order.orderId
          );

          if (order.status === "Đã thanh toán") {
            incomingOrders.push(order);
          } else if (order.status === "Đã giao hàng") {
            completedOrders.push(order);
          }

          return {
            orderId: order.orderId,
            items: order.items,
            itemsId,
            totalAmount: order.totalAmount,
            status: order.status,
            createdAt: order.createdAt,
            incomingOrders,
            completedOrders,
            loading: { ...state.loading, [id]: false },
            error: { ...state.error, [id]: null },
          };
        });

        console.log("Fetched order:", order);
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Lỗi không xác định";
        set((state) => ({
          loading: { ...state.loading, [id]: false },
          error: { ...state.error, [id]: message },
        }));
        console.error("Fetch order failed:", message);
      }
    },
  }))
);
