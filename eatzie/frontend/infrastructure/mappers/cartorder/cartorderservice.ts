import { AddCartItemInput, CartService } from "@/domain/service/CardService";
import { OrderService, PriceAllFoods } from "@/domain/service/OrderService";
import { post } from "@/infrastructure/api/axiosClient";
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

  createPayment: async (orderId: number, amount: number) => {
    try {
      const response = await post<{
        orderCode: number;
        amount: number;
        paymentLinkId?: string;
        checkoutUrl: string;
        qrCode?: string;
      }>("/PayOS/create-payment", { amount, orderId });

      if (!response?.checkoutUrl) {
        throw new Error("Không thể tạo link thanh toán");
      }

      return {
        paymentId: 0,
        orderId,
        paymentLink: response.checkoutUrl,
        payOSCode: response.orderCode.toString(),
        qrCode: response.qrCode,
      };
    } catch (err: any) {
      console.error("Failed to create payment", err);
      throw new Error(err.message || "Tạo link thanh toán thất bại");
    }
  },

  createOrder: async () => {
    const getTotal = useCartStore.getState().total;
    const totalPrice: PriceAllFoods = { price: getTotal(), note: "string" };

    if (totalPrice.price <= 0) {
      throw new Error("Tổng giá trị đơn hàng không hợp lệ");
    }

    try {
      const orderCreateRes = await OrderService.createOrder(totalPrice);
      const data = orderCreateRes?.data;
      if (!data?.orderId)
        throw new Error("Order ID is undefined after order creation");

      return data.orderId;
    } catch (err) {
      console.error("[createOrder] Failed to create order:", err);
      throw new Error("Tạo đơn hàng thất bại");
    }
  },

  placeOrder: async () => {
    try {
      await CartOrderService.addCartItems();
      const orderId = await CartOrderService.createOrder();

      const total = useCartStore.getState().total();
      const deliveryFee = 14000;
      const totalAmount = total + deliveryFee;

      const payment = await CartOrderService.createPayment(
        orderId,
        totalAmount
      );

      ToastAndroid.show("Đặt hàng thành công!", ToastAndroid.SHORT);

      return {
        orderId,
        paymentCode: payment.payOSCode,
        paymentId: payment.paymentId,
        paymentLink: payment.paymentLink,
        qrCode: payment.qrCode,
      };
    } catch (err: any) {
      console.error("Place order failed", err);
      ToastAndroid.show(err.message || "Đặt hàng thất bại", ToastAndroid.SHORT);
      throw err;
    }
  },
};
