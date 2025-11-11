import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";
import { XStack, YStack } from "tamagui";

import { ThemedText } from "@/app/hooks/ThemedTextColor";
import { ScrollScreenLayout } from "@/components/layout/ScrollScreenLayout";
import { CustomButton } from "@/components/ui/CustomButton";
import { formatCurrency } from "@/utils/formatCurrency";

export default function PaymentSuccessScreen() {
  const { orderId, total } = useLocalSearchParams();
  const router = useRouter();
  const totalNumber = Number(total || 0);
  const displayOrderId = orderId || "N/A";

  useEffect(() => {
    // Auto navigate to home after 5 seconds
    const timer = setTimeout(() => {
      router.replace("/(tabs)");
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <ScrollScreenLayout>
      <YStack flex={1} justifyContent="center" alignItems="center" gap="$4" padding="$4">
        {/* Success Icon */}
        <YStack
          width={100}
          height={100}
          borderRadius={50}
          backgroundColor="#4CAF50"
          justifyContent="center"
          alignItems="center"
        >
          <MaterialCommunityIcons name="check" size={60} color="white" />
        </YStack>

        {/* Success Message */}
        <YStack alignItems="center" gap="$2">
          <ThemedText
            style={{
              fontSize: 24,
              fontWeight: "bold",
              color: "#4CAF50",
            }}
          >
            Thanh toán thành công!
          </ThemedText>
          <ThemedText
            style={{
              fontSize: 16,
              fontWeight: "400",
              color: "#666",
              textAlign: "center",
            }}
          >
            Đơn hàng #{displayOrderId} của bạn đã được thanh toán thành công.
          </ThemedText>
        </YStack>

        {/* Order Details */}
        <YStack
          backgroundColor="white"
          padding="$4"
          borderRadius={12}
          width="100%"
          gap="$2"
        >
          <XStack justifyContent="space-between">
            <ThemedText style={{ fontSize: 16, fontWeight: "500", color: "#666" }}>
              Mã đơn hàng:
            </ThemedText>
            <ThemedText style={{ fontSize: 16, fontWeight: "600", color: "#333" }}>
              #{displayOrderId}
            </ThemedText>
          </XStack>
          <XStack justifyContent="space-between">
            <ThemedText style={{ fontSize: 16, fontWeight: "500", color: "#666" }}>
              Tổng tiền:
            </ThemedText>
            <ThemedText
              style={{ fontSize: 18, fontWeight: "bold", color: "#6666FF" }}
            >
              {formatCurrency(totalNumber)} VNĐ
            </ThemedText>
          </XStack>
        </YStack>

        {/* Action Buttons */}
        <YStack width="100%" gap="$3" marginTop="$4">
          <CustomButton
            paddingVertical={15}
            backgroundColor="#6666FF"
            textfontweight="600"
            minWidth="100%"
            onPress={() => router.replace("/(tabs)")}
          >
            <ThemedText
              style={{
                fontSize: 16,
                fontWeight: "500",
                color: "white",
              }}
            >
              Về trang chủ
            </ThemedText>
          </CustomButton>
        </YStack>

        <ThemedText
          style={{
            fontSize: 12,
            fontWeight: "400",
            color: "#999",
            textAlign: "center",
            marginTop: "$2",
          }}
        >
          Tự động chuyển về trang chủ sau 5 giây...
        </ThemedText>
      </YStack>
    </ScrollScreenLayout>
  );
}



