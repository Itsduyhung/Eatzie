import { AddCartItemInput, CartService } from "@/domain/service/CardService";
import { OrderService, PriceAllFoods } from "@/domain/service/OrderService";
import { PaymentService, CreatePaymentRequest } from "@/domain/service/PaymentService";
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
    const totalPrice: PriceAllFoods = { totalPrice: getTotal(), note: "" };

    if (totalPrice.totalPrice <= 0)
      throw new Error("Tổng giá trị đơn hàng không hợp lệ");

    try {
      const response = await OrderService.createOrder(totalPrice);
      return response.data?.orderId;
    } catch (err) {
      console.error("Failed to create order", err);
      throw new Error("Tạo đơn hàng thất bại");
    }
  },

  createPayment: async (orderId: number, amount: number) => {
    try {
      const paymentRequest: CreatePaymentRequest = {
        orderId,
        amount,
        description: `Thanh toán đơn hàng #${orderId}`,
        returnUrl: "eatzie://payment-success",
        cancelUrl: "eatzie://payment-cancel",
      };

      const response = await PaymentService.createPayment(paymentRequest);
      
      if (response.data?.paymentLink) {
        return response.data;
      }
      
      throw new Error("Không thể tạo link thanh toán");
    } catch (err: any) {
      console.error("Failed to create payment", err);
      throw new Error(err.message || "Tạo link thanh toán thất bại");
    }
  },

  // NOTE: Unused - we now navigate to in-app payment screen instead of opening external link
  // openPaymentLink: async (paymentLink: string) => {
  //   try {
  //     const canOpen = await Linking.canOpenURL(paymentLink);
  //     if (canOpen) {
  //       await Linking.openURL(paymentLink);
  //     } else {
  //       throw new Error("Không thể mở link thanh toán");
  //     }
  //   } catch (err: any) {
  //     console.error("Failed to open payment link", err);
  //     throw new Error(err.message || "Không thể mở link thanh toán");
  //   }
  // },

  placeOrder: async () => {
    try {
      console.log("Place order processing..");

      await CartOrderService.addCartItems();
      const orderId = await CartOrderService.createOrder();

      if (!orderId) {
        throw new Error("Không lấy được mã đơn hàng");
      }

      // Get total amount including delivery fee
      const total = useCartStore.getState().total();
      const deliveryFee = 14000;
      const totalAmount = total + deliveryFee;

      // Create payment link
      const payment = await CartOrderService.createPayment(orderId, totalAmount);

      // Clear cart after creating order (before payment)
      useCartStore.getState().clearCart();

      ToastAndroid.show("Đặt hàng thành công!", ToastAndroid.SHORT);
      
      return { 
        orderId, 
        paymentCode: payment.payOSCode,
        paymentId: payment.paymentId,
        paymentLink: payment.paymentLink
      };
    } catch (err: any) {
      console.error("Place order failed", err);
      ToastAndroid.show(err.message || "Đặt hàng thất bại", ToastAndroid.SHORT);
      throw err;
    }
  },
};
