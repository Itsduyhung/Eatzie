import { foodCategoryData } from "@/app/constant/FoodCategoryData";
import { Dimensions, FlatList, View } from "react-native";
import { Text, XStack, YStack } from "tamagui";
import { FoodCard } from "./ListFoodRender";

const { width: screenWidth } = Dimensions.get("window");

export const FlashCardRender = () => {
  const itemWidth = 200;
  const sideSpacing = 12;

  return (
    <YStack
      width="100%"
      backgroundColor="#FFFFFF"
      borderRadius={14}
      paddingVertical="$1"
      paddingHorizontal="$2"
      gap="$"
    >
      <XStack marginTop="$3">
        <Text
          fontSize="$5"
          fontFamily="$heading"
          color="#9B59B6"
          numberOfLines={1}
        >
          Món ăn đề xuất cho bạn hôm nay
        </Text>
      </XStack>

      <FlatList
        data={foodCategoryData}
        renderItem={({ item }) => <FoodCard item={item} />}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
        decelerationRate="fast"
        bounces={false}
      />
    </YStack>
  );
};
