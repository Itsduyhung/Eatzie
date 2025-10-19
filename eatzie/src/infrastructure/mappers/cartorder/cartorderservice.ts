import { AddCartItemInput, CartService } from "@/domain/service/CardService";
import { OrderService, PriceAllFoods } from "@/domain/service/OrderService";
import { useOrderStore } from "@/stores/orderStore";
import { useCartStore } from "@/stores/useCartStore";
import { ToastAndroid } from "react-native";

export const CartOrderService = {
  addCartItems: async (retryCount = 2) => {
    const cart = useCartStore.getState().cart;

    if (cart.length === 0) throw new Error("Giỏ hàng trống");

    const items: AddCartItemInput[] = cart.map((item) => ({
      foodId: Number(item.id),
      quantity: item.quantity ?? 1,
    }));

    let attempt = 0;
    while (attempt <= retryCount) {
      try {
        await CartService.addToCart(items);
        return true;
      } catch (err) {
        attempt++;
        console.error(`Failed to add cart (attempt ${attempt})`, err);
        if (attempt > retryCount) {
          throw new Error("Không thể thêm các món vào giỏ sau nhiều lần thử");
        }
      }
    }

    return true;
  },

  createOrder: async () => {
    const getTotal = useCartStore.getState().total;
    const totalPrice: PriceAllFoods = { price: getTotal(), note: "string" };

    console.log("[createOrder] Tổng giá trị giỏ hàng:", totalPrice.price);

    if (totalPrice.price <= 0) {
      console.error("[createOrder] Tổng giá trị đơn hàng không hợp lệ");
      throw new Error("Tổng giá trị đơn hàng không hợp lệ");
    }

    try {
      console.log("[createOrder] Gọi OrderService.createOrder...");
      const orderCreateRes = await OrderService.createOrder(totalPrice);
      console.log("[createOrder] Response từ server:", orderCreateRes.data);

      const items = orderCreateRes.data?.items || [];
      const itemsId: number[] = items.map((item) => item.foodId);

      console.log("[createOrder] Items mapping:", items);
      console.log("[createOrder] ItemsId mapping:", itemsId);

      if (orderCreateRes.data?.orderId === undefined) {
        console.error("[createOrder] Order ID is undefined sau khi tạo đơn");
        throw new Error("Order ID is undefined after order creation");
      }

      useOrderStore.setState({
        orderId: orderCreateRes.data.orderId,
        status: orderCreateRes.data.status,
        items,
        itemsId,
        createdAt: orderCreateRes.data.createdAt,
      });

      console.log(
        "[createOrder] State useOrderStore đã cập nhật:",
        useOrderStore.getState()
      );

      console.log(
        "[createOrder] Xóa giỏ hàng sau khi tạo đơn:",
        orderCreateRes.data.orderId
      );
      useCartStore
        .getState()
        .clearCartAfterOrder(
          orderCreateRes.data.orderId,
          orderCreateRes.data.createdAt
        );

      console.log("[createOrder] Hoàn tất createOrder thành công");
    } catch (err) {
      console.error("[createOrder] Failed to create order:", err);
      throw new Error("Tạo đơn hàng thất bại");
    }

    return true;
  },

  placeOrder: async () => {
    try {
      console.log("Place order processing..");

      await CartOrderService.addCartItems();
      await CartOrderService.createOrder();

      ToastAndroid.show("Đặt hàng thành công!", ToastAndroid.SHORT);
      return true;
    } catch (err: any) {
      console.error("Place order failed", err);
      ToastAndroid.show(err.message || "Đặt hàng thất bại", ToastAndroid.SHORT);
      throw err;
    }
  },
};
