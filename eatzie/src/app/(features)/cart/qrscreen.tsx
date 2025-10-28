import { ThemedText } from "@/app/hooks/ThemedTextColor";
import { ScrollScreenLayout } from "@/components/layout/ScrollScreenLayout";
import { BackButton } from "@/components/ui/BackButton";
import { SizableImage } from "@/components/ui/SizableImageProps";
import { formatCurrency } from "@/utils/formatCurrency";
import { useLocalSearchParams } from "expo-router";
import { Separator, XStack, YStack } from "tamagui";

export default function QrScreen() {
  const { total, orderId, paymentCode } = useLocalSearchParams();
  const totalNumber = Number(total || 0);
  const displayOrderId = orderId || Math.floor(Math.random() * 100000000000000);

  return (
    <ScrollScreenLayout headerLeftIcons={[<BackButton key="back" />]}>
      <YStack flex={1} gap="$4" paddingHorizontal="$4" paddingBottom="$4">
        <XStack>
          <BackButton />
        </XStack>

        <YStack flex={1} justifyContent="center" alignItems="center" gap="$3">
          {/* Thông tin thanh toán */}
          <YStack alignItems="center" gap="$1">
            <ThemedText
              style={{
                fontSize: 16,
                fontWeight: "500",
                color: "#333",
              }}
            >
              Thanh toán đơn hàng #{displayOrderId}
            </ThemedText>

            <XStack alignItems="flex-end" gap="$2">
              <ThemedText
                style={{
                  fontSize: 28,
                  fontWeight: "bold",
                  color: "#6666FF",
                }}
              >
                {formatCurrency(totalNumber)}
              </ThemedText>
              <ThemedText
                style={{
                  fontSize: 16,
                  fontWeight: "500",
                  color: "#666",
                }}
              >
                VNĐ
              </ThemedText>
            </XStack>
          </YStack>

          <SizableImage
            style={{ width: 200, height: 200 }}
            source={require("../../../assets/images/qr.jpg")} // ảnh QR
          />

          <ThemedText
            style={{
              fontSize: 14,
              fontWeight: "400",
              color: "#007AFF",
              marginTop: 10,
            }}
          >
            Scan to Pay
          </ThemedText>
        </YStack>

        <Separator marginBottom="$2" />
      </YStack>
    </ScrollScreenLayout>
  );
}
