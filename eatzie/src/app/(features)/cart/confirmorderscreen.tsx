import { FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { XStack, YStack } from "tamagui";

import { ThemedText } from "@/app/hooks/ThemedTextColor";
import { HeaderSetting } from "@/components/home/HeaderSetting";
import { ScrollScreenLayout } from "@/components/layout/ScrollScreenLayout";
import { CustomButton } from "@/components/ui/CustomButton";
import { SizableImage } from "@/components/ui/SizableImageProps";
import { CartOrderService } from "@/infrastructure/mappers/cartorder/cartorderservice";
import { useCartStore } from "@/stores/useCartStore";
import { formatCurrency } from "@/utils/formatCurrency";

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
      
      // Navigate to payment screen with order and payment info
      router.push({
        pathname: "/(features)/cart/qrscreen",
        params: { 
          total: String(total + deliveryFee),
          orderId: String(result.orderId),
          paymentCode: result.paymentCode
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

  const renderCartItems = () => (
    <YStack
      backgroundColor="white"
      gap="$3"
      borderRadius={8}
      paddingVertical={20}
    >
      {cart.map((item) => (
        <YStack
          key={item.id}
          gap="$4"
          paddingHorizontal="$2"
          paddingVertical="$2"
        >
          <XStack gap={10} alignItems="center">
            <FontAwesome5 name="store" size={18} color="#6666FF" />
            <ThemedText style={{ fontSize: 15, fontWeight: "500" }}>
              {item.restaurantName}
            </ThemedText>
          </XStack>

          <XStack gap={20} position="relative">
            <SizableImage
              source={{ uri: item.image as any }}
              resizeMode="cover"
              borderRadius={8}
              style={{ width: 60, height: 60 }}
            />
            <YStack gap={8}>
              <ThemedText style={{ fontSize: 16, fontWeight: "500" }}>
                {item.quantity} x {item.name}
              </ThemedText>
              {item.note && (
                <ThemedText
                  style={{
                    fontSize: 14,
                    fontWeight: "500",
                    color: "#A0A0A0",
                  }}
                >
                  {item.note}
                </ThemedText>
              )}
            </YStack>
            <YStack position="absolute" right={0}>
              <ThemedText style={{ fontSize: 16, fontWeight: "500" }}>
                {formatCurrency(item.price * item.quantity)}
              </ThemedText>
            </YStack>
          </XStack>
        </YStack>
      ))}
    </YStack>
  );

  const renderSummary = () => (
    <YStack backgroundColor="white" gap={8} padding="$2" borderRadius={8}>
      <XStack justifyContent="space-between">
        <ThemedText style={{ fontSize: 16, fontWeight: "500" }}>
          Tổng giá trị món ({cart.reduce((sum, i) => sum + i.quantity, 0)})
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

  return (
    <ScrollScreenLayout
      header={<HeaderSetting nameTitle={title as string} />}
      headerBackgroundColor="white"
    >
      <YStack padding="$2" gap="$2">
        {renderAddress()}
        {renderCartItems()}
        {renderSummary()}

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
    </ScrollScreenLayout>
  );
}
