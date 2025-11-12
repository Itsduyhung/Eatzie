import { FoodCardItem } from "@/components/anima/CartItem";
import { ScrollScreenLayout } from "@/components/layout/ScrollScreenLayout";
import { BackButton } from "@/components/ui/BackButton";
import { FilterTabBar } from "@/components/ui/FilterTabBar";
import { ThemedText } from "@/hooks/ThemedTextColor";
import { useFoodStore } from "@/stores/FoodStore";
import { useRestaurantStore } from "@/stores/restaurantStore";
import { EvilIcons, FontAwesome5 } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Text, XStack, YStack } from "tamagui";

const tabs = [
  { key: "near", label: "Món ăn của nhà hàng" },
  { key: "popular", label: "Bán chạy" },
  { key: "rating", label: "Đánh giá" },
  { key: "fast", label: "Giao nhanh" },
];

const ContentFood = () => {
  const { id } = useLocalSearchParams();
  const restaurantId = Number(id);
  const restaurant = useRestaurantStore((s) => s.restaurants[restaurantId]);
  const restaurantLoading = useRestaurantStore((s) => s.loading);
  const restaurantError = useRestaurantStore((s) => s.error);
  const fetchRestaurant = useRestaurantStore((s) => s.fetchRestaurant);
  const foodList = useFoodStore((s) => s.foodsByRestaurant[restaurantId]);
  const foodLoading = useFoodStore((s) => s.loading[restaurantId]);
  const fetchFoodByRestaurant = useFoodStore((s) => s.fetchFoodByRestaurant);

  const [activeTab, setActiveTab] = useState("near");

  useEffect(() => {
    if (!restaurantId) return;
    if (!restaurant) fetchRestaurant(restaurantId);
    if (activeTab === "near" && !foodList && !foodLoading)
      fetchFoodByRestaurant(restaurantId);
  }, [restaurantId, restaurant, activeTab, foodList, foodLoading]);

  const isLoading = restaurantLoading || foodLoading;
  const error = restaurantError;

  if (isLoading) return <Text>Đang tải...</Text>;
  if (error) return <Text>{error}</Text>;
  if (!restaurant) return <Text>Không tìm thấy nhà hàng</Text>;

  const isOpen = restaurant.status === "Open";
  const displayStatus = isOpen ? "Đang mở cửa" : "Đã đóng cửa";

  const handleTabChange = (key: string) => setActiveTab(key);

  const TabContent = () => {
    if (activeTab === "near") {
      if (foodList.length === 0) return <Text>Chưa có món ăn</Text>;

      return (
        <YStack
          backgroundColor="white"
          paddingHorizontal="$4"
          paddingVertical="$3"
        >
          {foodList.map((food, index) => (
            <YStack
              key={food.id}
              paddingVertical="$3"
              borderBottomWidth={index !== foodList.length - 1 ? 0.5 : 0}
              borderBottomColor="#E5E5E5"
            >
              <FoodCardItem id={food.id} />
            </YStack>
          ))}
        </YStack>
      );
    }

    return (
      <Text marginTop={10}>
        Tab &quot;{activeTab}&quot; chưa có nội dung demo.
      </Text>
    );
  };

  return (
    <ScrollScreenLayout
      backgroundImage={{ uri: restaurant.image as any }}
      headerLeftIcons={[<BackButton key="back" />]}
      headerRightIcons={[
        <EvilIcons key="search" name="search" size={26} color="white" />,
        <FontAwesome5 key="share" name="share" size={16} color="white" />,
      ]}
    >
      <YStack gap="$4" paddingVertical={15} backgroundColor="#F5F5F5">
        <YStack
          paddingVertical="$3"
          backgroundColor="white"
          justifyContent="center"
          alignItems="center"
          gap="$3"
        >
          <ThemedText fontSize={22} fontWeight="700">
            {restaurant.name}
          </ThemedText>

          <XStack alignItems="center" justifyContent="space-between">
            <ThemedText
              fontSize={14}
              fontWeight="600"
              color={isOpen ? "$green10" : "$red10"}
            >
              {displayStatus}
            </ThemedText>
          </XStack>

          <YStack marginTop={4}>
            <ThemedText fontSize={14} fontWeight="400" lineHeight={20}>
              {restaurant.description}
            </ThemedText>
          </YStack>
        </YStack>

        <FilterTabBar
          tabs={tabs}
          initialTabKey="near"
          onTabChange={handleTabChange}
        />

        <TabContent />
      </YStack>
    </ScrollScreenLayout>
  );
};

export default ContentFood;
