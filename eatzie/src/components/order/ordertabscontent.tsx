import { ThemedText } from "@/app/hooks/ThemedTextColor";
import { useCartStore } from "@/stores/useCartStore";
import { formatCurrency } from "@/utils/formatCurrency";
import { ScrollView, Text, XStack, YStack } from "tamagui";
import { SizableImage } from "../ui/SizableImageProps";

export const OrderTabsContent = ({ activeTab }: { activeTab: string }) => {
  const cart = useCartStore((s) => s.cart);

  const renderComingOrders = () => {
    if (cart.length === 0) {
      return <Text>Bạn chưa có đơn nào đang đến.</Text>;
    }

    return (
      <YStack gap="$2" width={"100%"} borderRadius={8} padding="$2">
        {cart.map((item) => (
          <YStack key={item.id} width={"100%"}>
            <XStack gap={10}>
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
                  ít bún
                </ThemedText>
              </YStack>

              <YStack marginLeft={40}>
                <ThemedText
                  style={{
                    fontSize: 16,
                    fontWeight: "500",
                    textAlign: "center",
                  }}
                >
                  {formatCurrency(item.price * (item.quantity ?? 1))}
                </ThemedText>
              </YStack>
            </XStack>
          </YStack>
        ))}
      </YStack>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case "Đang đến":
        return (
          <ScrollView showsVerticalScrollIndicator={false}>
            {renderComingOrders()}
          </ScrollView>
        );
      case "Deal đã mua":
        return <Text>Các deal đã mua của bạn</Text>;
      case "Lịch sử":
        return <Text>Lịch sử đơn hàng</Text>;
      case "Đánh giá":
        return <Text>Đánh giá đơn hàng</Text>;
      case "Đơn nháp":
        return <Text>Đơn nháp bạn chưa hoàn tất</Text>;
      default:
        return <Text>Không có dữ liệu</Text>;
    }
  };

  return <YStack p="$4">{renderContent()}</YStack>;
};
