import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Linking } from "react-native";
import { XStack, YStack } from "tamagui";

import { ThemedText } from "@/app/hooks/ThemedTextColor";
import { HeaderSetting } from "@/components/home/HeaderSetting";
import { ScrollScreenLayout } from "@/components/layout/ScrollScreenLayout";
import { CustomButton } from "@/components/ui/CustomButton";
import { CartOrderService } from "@/infrastructure/mappers/cartorder/cartorderservice";
import { useCartStore } from "@/stores/useCartStore";
import { formatCurrency } from "@/utils/formatCurrency";
import { CartItems } from "@/components/cart/CartItems";
import { OrderSummary } from "@/components/cart/OrderSummary";

export default function ConfirmOrderScreen() {
  const { title } = useLocalSearchParams();
  const router = useRouter();

  const cart = useCartStore((s) => s.cart);
  const getTotal = useCartStore((s) => s.total);

  const total = useMemo(() => getTotal(), [cart]);
  const deliveryFee = 14000;

  const [loading, setLoading] = useState(false);

  const handlePlaceOrder = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const result = await CartOrderService.placeOrder();
      
      // Navigate to payment screen first (don't auto-open browser)
      // User can choose to open payment link from QR screen
      router.push({
        pathname: "/(features)/cart/qrscreen",
        params: { 
          total: String(total + deliveryFee),
          orderId: String(result.orderId),
          paymentCode: result.paymentCode || "",
          paymentLink: result.paymentLink || "",
          qrCode: result.qrCode || undefined // QR code từ PayOS response (base64)
        },
      });
    } catch (err: any) {
      alert(err.message || "Đặt hàng thất bại");
    } finally {
      setLoading(false);
    }
  };

  const renderAddress = () => (
    <YStack backgroundColor="white" padding="$3" borderRadius={8} gap="$2">
      <XStack gap="$3">
        <MaterialCommunityIcons
          name="map-marker-radius-outline"
          size={24}
          color="black"
        />
        <ThemedText style={{ fontSize: 16, fontWeight: "500" }}>
          Nhơn Bình, Quy Nhơn
        </ThemedText>
      </XStack>
      <XStack marginLeft={35}>
        <ThemedText style={{ fontSize: 16, fontWeight: "500" }}>
          fooode_hqchfspri | 0901234567
        </ThemedText>
      </XStack>
    </YStack>
  );

  return (
    <ScrollScreenLayout
      header={<HeaderSetting nameTitle={title as string} />}
      headerBackgroundColor="white"
    >
      <YStack padding="$2" gap="$2">
        {renderAddress()}

        <CartItems cart={cart} />

        <OrderSummary cart={cart} total={total} deliveryFee={deliveryFee} />

        <YStack
          gap="$3"
          backgroundColor="white"
          paddingHorizontal="$2"
          paddingVertical="$3"
          borderRadius={8}
        >
          <XStack gap="$2" alignItems="center">
            <ThemedText style={{ fontSize: 14, fontWeight: "500" }}>
              Phương thức thanh toán:
            </ThemedText>
            <ThemedText style={{ fontSize: 14, fontWeight: "600", color: "#6666FF" }}>
              QR / Ngân hàng
            </ThemedText>
          </XStack>

          <XStack>
            <CustomButton
              paddingVertical={15}
              backgroundColor="#6666FF"
              textfontweight="600"
              minWidth="100%"
              disabled={loading}
              onPress={handlePlaceOrder}
            >
              <ThemedText
                style={{
                  fontSize: 16,
                  fontWeight: "500",
                  color: "white",
                }}
              >
                {loading
                  ? "Đang xử lý..."
                  : `Đặt đơn - ${formatCurrency(total + deliveryFee)}`}
              </ThemedText>
            </CustomButton>
          </XStack>
        </YStack>
      </YStack>
    </ScrollScreenLayout>
  );
}
