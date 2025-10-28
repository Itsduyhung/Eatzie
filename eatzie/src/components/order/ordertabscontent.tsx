import { ThemedText } from "@/app/hooks/ThemedTextColor";
import { useCartStore } from "@/stores/useCartStore";
import { XStack, YStack } from "tamagui";
import { CartItems } from "../cart/CartItems";
import { OrderSummary } from "../cart/OrderSummary";
import { formatDateUTC } from "@/utils/formatDateUTC";
import { Pressable } from "react-native";
import { useRouter } from "expo-router";

type OrderTabsContentProps = {
  activeTab: string;
  forOrder?: boolean;
};

export const OrderTabsContent = ({
  activeTab,
  forOrder,
}: OrderTabsContentProps) => {
  const cart = useCartStore((s) => s.cart);
  const cartSnapshots = useCartStore((s) => s.cartSnapshots);
  const total = useCartStore((s) => s.total);
  const totalSnapshot = useCartStore((s) => s.totalSnapshot);

  const renderComingOrders = () => {
    const deliveryFee = 14000;

    if (activeTab === "Lịch sử" || activeTab === "Đã giao") {
      if (cart.length === 0) {
        return <ThemedText>Bạn chưa có đơn nào đang đến.</ThemedText>;
      }

      return (
        <YStack gap="$2" width="100%">
          <CartItems cart={cart} />
          <OrderSummary cart={cart} total={total()} deliveryFee={deliveryFee} />
        </YStack>
      );
    }

    if (activeTab === "Đang đến") {
      if (cartSnapshots.length === 0) {
        return <ThemedText>Chưa có đơn hàng nào trước đây.</ThemedText>;
      }

      return (
        <YStack gap="$3" width="100%">
          {cartSnapshots.map((snapshot) => (
            <YStack
              key={snapshot.orderId}
              gap="$2"
              paddingVertical="$3"
              paddingHorizontal="$2"
              borderRadius={12}
              backgroundColor="white"
            >
              <XStack justifyContent="space-between">
                <ThemedText style={{ fontSize: 16, fontWeight: "600" }}>
                  Order #{snapshot.orderId}
                </ThemedText>
                <ThemedText style={{ fontSize: 16, fontWeight: "600" }}>
                  {formatDateUTC(snapshot.date)}
                </ThemedText>
              </XStack>

              <CartItems orderId={snapshot.orderId} cart={snapshot.items} />
              <OrderSummary
                forOrder={forOrder}
                cart={snapshot.items}
                total={totalSnapshot(snapshot)}
                deliveryFee={deliveryFee}
              />
            </YStack>
          ))}
        </YStack>
      );
    }

    return null;
  };

  return <YStack gap="$2">{renderComingOrders()}</YStack>;
};
