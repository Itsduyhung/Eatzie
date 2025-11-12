import { ThemedText } from "@/hooks/ThemedTextColor";
import { useOrderStore } from "@/stores/orderStore";
import { formatDateUTC } from "@/utils/formatDateUTC";
import { useEffect } from "react";
import { XStack, YStack } from "tamagui";
import { CartItems } from "../cart/CartItems";
import { OrderSummary } from "../cart/OrderSummary";

type OrderTabsContentProps = {
  activeTab: string;
  forOrder?: boolean;
  orderIds?: number[];
};

export const OrderTabsContent = ({
  activeTab,
  forOrder,
  orderIds = [],
}: OrderTabsContentProps) => {
  const { incomingOrders, completedOrders, fetchOrder } = useOrderStore();

  const deliveryFee = 14000;

  useEffect(() => {
    orderIds.forEach((id) => {
      console.log("Calling fetchOrder for id:", id);
      fetchOrder(id);
    });
  }, [activeTab, orderIds, fetchOrder]);

  const renderOrders = (
    orders: typeof incomingOrders | typeof completedOrders,
    emptyText: string
  ) => {
    if (!orders.length) return <ThemedText>{emptyText}</ThemedText>;

    return (
      <YStack gap="$3" width="100%">
        {orders.map((order) => (
          <YStack
            key={order.orderId}
            gap="$2"
            paddingVertical="$3"
            paddingHorizontal="$2"
            borderRadius={12}
            backgroundColor="white"
          >
            <XStack justifyContent="space-between">
              <ThemedText style={{ fontSize: 16, fontWeight: "600" }}>
                Order #{order.orderId}
              </ThemedText>
              <ThemedText style={{ fontSize: 16, fontWeight: "600" }}>
                {formatDateUTC(order.createdAt)}
              </ThemedText>
            </XStack>

            <CartItems
              orderId={order.orderId}
              cart={order.items.map((i) => ({
                id: i.foodId,
                name: i.foodName,
                image: i.imageUrl,
                quantity: i.quantity,
                price: i.price,
                totalPrice: i.totalPrice,
                note: i.note,
              }))}
            />

            <OrderSummary
              forOrder={forOrder}
              cart={order.items.map((i) => ({
                id: i.foodId,
                name: i.foodName,
                image: i.imageUrl,
                quantity: i.quantity,
                price: i.price,
                totalPrice: i.totalPrice,
                note: i.note,
              }))}
              total={order.totalAmount}
              deliveryFee={deliveryFee}
            />
          </YStack>
        ))}
      </YStack>
    );
  };

  switch (activeTab) {
    case "Đang đến":
      return renderOrders(incomingOrders, "Chưa có đơn hàng nào đang đến.");
    case "Đã giao":
    case "Lịch sử":
      return renderOrders(completedOrders, "Bạn chưa có đơn nào đã giao.");
    default:
      return <ThemedText>Tab không xác định</ThemedText>;
  }
};
