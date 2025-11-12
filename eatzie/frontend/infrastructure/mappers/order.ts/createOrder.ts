import {
  OrderCreateResProps,
  OrderCreateResRawProps,
  OrderItemProps,
  OrderItemRawProps,
} from "@/types/order.types";

export const mapOrderItemRawToDomain = (
  item: OrderItemRawProps
): OrderItemProps => ({
  totalPrice: item.totalPrice,
  note: item.note,
  foodId: item.foodId,
  quantity: item.quantity,
  price: item.price,
});

export const mapOrderRawToDomain = (
  order: OrderCreateResRawProps
): OrderCreateResProps => ({
  orderId: order.orderId,
  createdAt: order.createdAt,
  totalAmount: order.totalAmount,
  status: order.status,
  items: order.items.map(mapOrderItemRawToDomain),
});
