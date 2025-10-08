// app/(tabs)/test.tsx
import { ThemedText } from "@/app/hooks/ThemedTextColor";
import { CartFooter } from "@/components/footer/CardFooter";
import { ScrollScreenLayout } from "@/components/layout/ScrollScreenLayout";
import { BackButton } from "@/components/ui/BackButton";
import { useRestaurantStore } from "@/stores/restaurantStore";
import { EvilIcons, FontAwesome5 } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text, XStack, YStack } from "tamagui";

const ContentFood = () => {
  const { id } = useLocalSearchParams();
  const restaurantId = Number(id);
  const insets = useSafeAreaInsets();

  const { restaurants, loading, error, fetchRestaurant } = useRestaurantStore();
  const item = restaurants[restaurantId];

  useEffect(() => {
    if (restaurantId) fetchRestaurant(restaurantId);
  }, [restaurantId, fetchRestaurant]);

  if (loading) return <Text>Đang tải...</Text>;
  if (error) return <Text>{error}</Text>;
  if (!item) return <Text>Không tìm thấy nhà hàng</Text>;

  const isOpen = item.status === "Open";
  const displayStatus = isOpen ? "Đang mở cửa" : "Đã đóng cửa";

  return (
    <ScrollScreenLayout
      backgroundImage={{ uri: item.image as any }}
      headerLeftIcons={[<BackButton key="back" />]}
      headerRightIcons={[
        <EvilIcons key="search" name="search" size={26} color="black" />,
        <FontAwesome5 key="share" name="share" size={20} />,
      ]}
    >
      <YStack
        gap="$4"
        paddingHorizontal="$3"
        paddingVertical={15}
        backgroundColor="white"
        alignItems="center"
      >
        <ThemedText style={{ fontSize: 22, fontWeight: "700" }}>
          {item.name}
        </ThemedText>

        <XStack alignItems="center" justifyContent="space-between">
          <ThemedText
            style={{
              fontSize: 14,
              fontWeight: "600",
              color: isOpen ? "#16A34A" : "#EF4444", // xanh nếu mở, đỏ nếu đóng
            }}
          >
            {displayStatus}
          </ThemedText>
        </XStack>

        <YStack marginTop={4}>
          <ThemedText
            style={{ fontSize: 14, fontWeight: "400", lineHeight: 20 }}
          >
            {item.description}
          </ThemedText>
        </YStack>
      </YStack>

      {/* Footer */}
      <CartFooter />
    </ScrollScreenLayout>
  );
};

export default ContentFood;
