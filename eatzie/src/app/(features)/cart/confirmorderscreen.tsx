import { ThemedText } from "@/app/hooks/ThemedTextColor";
import { ScrollScreenLayout } from "@/components/layout/ScrollScreenLayout";
import { BackButton } from "@/components/ui/BackButton";
import { CustomButton } from "@/components/ui/CustomButton";
import { SizableImage } from "@/components/ui/SizableImageProps";
import { useCartStore } from "@/stores/useCartStore";
import { formatCurrency } from "@/utils/formatCurrency";
import { useState } from "react";

import { CartOrderService } from "@/infrastructure/mappers/cartorder/cartorderservice";
import {
  FontAwesome5,
  FontAwesome6,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { XStack, YStack } from "tamagui";

export default function ConfirmOrderScreen() {
  const router = useRouter();
  const cart = useCartStore((s) => s.cart);
  const total = useCartStore((s) => s.total)();
  const [loading, setLoading] = useState(false);

  const handlePlaceOrder = async () => {
    if (loading) return;
    setLoading(true);

    try {
      await CartOrderService.placeOrder();

      router.push({
        pathname: "/(features)/cart/qrscreen",
        params: { total: String(total) },
      });
    } catch (err: any) {
      alert(err.message || "Đặt hàng thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollScreenLayout>
      <XStack
        marginTop={50}
        alignItems="center"
        position="relative"
        paddingHorizontal="$4"
      >
        <YStack position="absolute" left={0}>
          <BackButton key="back" />
        </YStack>
        <XStack flex={1} alignItems="center" justifyContent="center">
          <ThemedText
            style={{ fontSize: 18, fontWeight: "500", textAlign: "center" }}
          >
            Xác nhận đơn hàng
          </ThemedText>
        </XStack>
      </XStack>

      <YStack padding="$2" gap="$5">
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
          <XStack
            marginTop={20}
            gap="$3"
            position="relative"
            alignItems="center"
          >
            <FontAwesome6 name="clock" size={24} color="black" />
            <ThemedText style={{ fontSize: 16, fontWeight: "500" }}>
              Giao ngay
            </ThemedText>
            <XStack position="absolute" right={0}>
              <ThemedText
                style={{ fontSize: 16, fontWeight: "500", color: "#6666FF" }}
              >
                Đổi sang giờ hẹn
              </ThemedText>
            </XStack>
          </XStack>
          <CustomButton
            paddingVertical={15}
            borderColor="#6666FF"
            borderWidth={1}
            backgroundColor="transparent"
            minWidth="100%"
          >
            <ThemedText
              style={{
                fontSize: 16,
                fontWeight: "500",
                textAlign: "center",
                color: "#6666FF",
              }}
            >
              Tiêu chuẩn - 17:15
            </ThemedText>
          </CustomButton>
        </YStack>

        <YStack backgroundColor="white" gap="$3" borderRadius={8}>
          {cart.map((item) => (
            <YStack
              key={item.id}
              gap="$4"
              paddingHorizontal="$2"
              paddingVertical="$2"
            >
              <XStack gap={10}>
                <FontAwesome5 name="store" size={18} color="#6666FF" />
                <ThemedText
                  style={{
                    fontSize: 15,
                    fontWeight: "500",
                    textAlign: "center",
                  }}
                >
                  Tiệm phở Nguyệt Trang Dương
                </ThemedText>
              </XStack>
              <XStack gap={20} position="relative">
                <SizableImage
                  source={item.image}
                  resizeMode="cover"
                  borderRadius={8}
                  style={{ width: 60, height: 60 }}
                />
                <YStack gap={20}>
                  <ThemedText style={{ fontSize: 16, fontWeight: "500" }}>
                    {item.quantity} x {item.name}
                  </ThemedText>
                  <ThemedText
                    style={{
                      fontSize: 14,
                      fontWeight: "500",
                      textAlign: "center",
                      color: "#A0A0A0",
                    }}
                  >
                    {item.note || "ít bún"}
                  </ThemedText>
                </YStack>
                <YStack position="absolute" right={0}>
                  <ThemedText style={{ fontSize: 16, fontWeight: "500" }}>
                    {formatCurrency(item.price * (item.quantity ?? 1))}
                  </ThemedText>
                </YStack>
              </XStack>
            </YStack>
          ))}
        </YStack>

        {/* Chi tiết thanh toán */}
        <YStack backgroundColor="white" gap={8} padding="$2" borderRadius={8}>
          <XStack justifyContent="space-between">
            <ThemedText style={{ fontSize: 16, fontWeight: "500" }}>
              Tổng giá trị món
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
              {formatCurrency(14000)}
            </ThemedText>
          </XStack>
          <XStack justifyContent="space-between">
            <ThemedText style={{ fontSize: 16, fontWeight: "500" }}>
              Tổng cộng
            </ThemedText>
            <ThemedText style={{ fontSize: 16, fontWeight: "500" }}>
              {formatCurrency(total + 14000)}
            </ThemedText>
          </XStack>
        </YStack>

        {/* Nút Đặt đơn */}
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
                textAlign: "center",
                color: "white",
              }}
            >
              {loading
                ? "Đang xử lý..."
                : `Đặt đơn - ${formatCurrency(total + 14000)}`}
            </ThemedText>
          </CustomButton>
        </XStack>
      </YStack>
    </ScrollScreenLayout>
  );
}
