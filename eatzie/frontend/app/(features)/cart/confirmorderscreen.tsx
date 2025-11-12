import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { XStack, YStack } from "tamagui";

import { CartItems } from "@/components/cart/CartItems";
import { OrderSummary } from "@/components/cart/OrderSummary";
import { HeaderSetting } from "@/components/home/HeaderSetting";
import { ScrollScreenLayout } from "@/components/layout/ScrollScreenLayout";
import { TriangularCornerButton } from "@/components/ui/AgonButton";
import { CustomButton } from "@/components/ui/CustomButton";
import { ThemedText } from "@/hooks/ThemedTextColor";
import { CartOrderService } from "@/infrastructure/mappers/cartorder/cartorderservice";
import { useLocationStore } from "@/stores/locationStores";
import { useCartStore } from "@/stores/useCartStore";
import { paymentOptions } from "@/types/pay/methodPay";
import { formatCurrency } from "@/utils/formatCurrency";

export default function ConfirmOrderScreen() {
  const { title } = useLocalSearchParams<{ title?: string }>();
  const router = useRouter();
  const { address } = useLocationStore();

  const cart = useCartStore((s) => s.cart);
  const total = useCartStore((s) => s.total)();
  const deliveryFee = 14000;

  const [loading, setLoading] = useState(false);
  const [selectedKey, setSelectedKey] = useState<string>("online");

  const handlePlaceOrder = useCallback(
    async (paymentMethod: string) => {
      if (loading) return;
      setLoading(true);

      try {
        const result = await CartOrderService.placeOrder();

        if (paymentMethod === "cod") {
          router.push({
            pathname: "/",
            params: { total: String(total + deliveryFee) },
          });
        } else if (paymentMethod === "online") {
          router.push({
            pathname: "/(features)/cart/qrscreen",
            params: {
              total: String(total + deliveryFee),
              orderId: String(result.orderId),
              paymentCode: result.paymentCode || "",
              paymentLink: result.paymentLink || "",
              qrCode: result.qrCode || undefined,
            },
          });
        }
      } catch (err: any) {
        alert(err?.message || "Đặt hàng thất bại");
      } finally {
        setLoading(false);
      }
    },
    [loading, router, total, deliveryFee]
  );

  const renderAddress = useMemo(() => {
    return (
      <YStack backgroundColor="white" padding="$4" borderRadius={8} gap="$2">
        <XStack gap="$3">
          <MaterialCommunityIcons
            name="map-marker-radius-outline"
            size={24}
            color="black"
          />
          <ThemedText style={{ fontSize: 14, fontWeight: "500" }}>
            {address || "Chưa chọn vị trí giao hàng"}
          </ThemedText>
        </XStack>
        <XStack marginLeft={35}>
          <ThemedText style={{ fontSize: 16, fontWeight: "500" }}>
            fooode_hqchfspri
          </ThemedText>
        </XStack>
      </YStack>
    );
  }, []);

  const renderPaymentOptions = useMemo(
    () => (
      <XStack flexDirection="row" justifyContent="space-between">
        {paymentOptions.map((option) => (
          <TriangularCornerButton
            key={option.key}
            onPress={() => setSelectedKey(option.key)}
            borderColor={selectedKey === option.key ? "#6666FF" : "#ccc"}
            backgroundColor="transparent"
            triangleSize={25}
            selected={selectedKey === option.key}
            style={{ flex: 1, marginHorizontal: 5 }}
          >
            <YStack alignItems="center" justifyContent="center">
              <ThemedText style={{ fontSize: 11, fontWeight: "500" }}>
                {option.label}
              </ThemedText>
            </YStack>
          </TriangularCornerButton>
        ))}
      </XStack>
    ),
    [selectedKey]
  );

  return (
    <ScrollScreenLayout
      header={<HeaderSetting nameTitle={title || "Xác nhận đơn"} />}
      headerBackgroundColor="white"
    >
      <YStack padding="$2" gap="$2">
        {renderAddress}

        {/* Cart Items */}
        <CartItems cart={cart} />

        {/* Order Summary */}
        <OrderSummary cart={cart} total={total} deliveryFee={deliveryFee} />

        {/* Payment Options & Place Order */}
        <YStack
          gap="$5"
          backgroundColor="white"
          paddingHorizontal="$2"
          paddingVertical="$3"
          borderRadius={8}
        >
          {renderPaymentOptions}

          <XStack>
            <CustomButton
              paddingVertical={15}
              backgroundColor="#6666FF"
              textfontweight="600"
              minWidth="100%"
              disabled={loading}
              onPress={() => handlePlaceOrder(selectedKey)}
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
