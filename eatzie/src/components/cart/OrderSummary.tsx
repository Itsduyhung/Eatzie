import { ThemedText } from "@/app/hooks/ThemedTextColor";
import { XStack, YStack } from "tamagui";
import { formatCurrency } from "@/utils/formatCurrency";
import { useRouter } from "expo-router";

type OrderSummaryProps = {
  cart: { quantity: number; price: number }[];
  total: number;
  deliveryFee: number;
  forOrder?: boolean;
};

export const OrderSummary = ({
  cart,
  total,
  deliveryFee,
  forOrder = false,
}: OrderSummaryProps) => {
  const totalQuantity = cart.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <YStack backgroundColor="white" gap={8} padding="$3" borderRadius={8}>
      {!forOrder && (
        <>
          <XStack justifyContent="space-between">
            <ThemedText style={{ fontSize: 16, fontWeight: "500" }}>
              Tổng giá trị món ({totalQuantity})
            </ThemedText>
            <ThemedText style={{ fontSize: 16, fontWeight: "500" }}>
              {formatCurrency(total)}
            </ThemedText>
          </XStack>

          <XStack justifyContent="space-between">
            <ThemedText style={{ fontSize: 16, fontWeight: "500" }}>
              Phí giao hàng
            </ThemedText>
            <ThemedText style={{ fontSize: 16, fontWeight: "500" }}>
              {formatCurrency(deliveryFee)}
            </ThemedText>
          </XStack>
        </>
      )}

      <XStack justifyContent="space-between">
        <ThemedText style={{ fontSize: 16, fontWeight: "500" }}>
          Tổng cộng
        </ThemedText>
        <ThemedText style={{ fontSize: 16, fontWeight: "500" }}>
          {formatCurrency(total + deliveryFee)}
        </ThemedText>
      </XStack>
    </YStack>
  );
};
