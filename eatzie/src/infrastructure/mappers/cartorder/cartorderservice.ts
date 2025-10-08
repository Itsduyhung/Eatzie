import { AddCartItemInput, CartService } from "@/domain/service/CardService";
import { OrderService, PriceAllFoods } from "@/domain/service/OrderService";
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
    const totalPrice: PriceAllFoods = { price: getTotal() };

    if (totalPrice.price <= 0)
      throw new Error("Tổng giá trị đơn hàng không hợp lệ");

    try {
      await OrderService.createOrder(totalPrice);
    } catch (err) {
      console.error("Failed to create order", err);
      throw new Error("Tạo đơn hàng thất bại");
    }

    return true;
  },

  placeOrder: async () => {
    try {
      console.log("Place order processing..");

      await CartOrderService.addCartItems();
      await CartOrderService.createOrder();

      useCartStore.getState().clearCart();

      ToastAndroid.show("Đặt hàng thành công!", ToastAndroid.SHORT);
      return true;
    } catch (err: any) {
      console.error("Place order failed", err);
      ToastAndroid.show(err.message || "Đặt hàng thất bại", ToastAndroid.SHORT);
      throw err;
    }
  },
};
