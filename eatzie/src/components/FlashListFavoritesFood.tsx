import {
  foodCategoryData,
  foodCategoryData1,
} from "@/app/constant/FoodCategoryData";
import { ThemedText } from "@/app/hooks/ThemedTextColor";
import { FlatList } from "react-native";
import { View, XStack, YStack } from "tamagui";
import { FavoritesFood } from "./anima/FavoritesFood";

type Props = {
  id: string;
};

const FlashListFavoritesFood = ({ id }: Props) => {
  const rawCategory =
    foodCategoryData.find((f) => f.id === id) ??
    foodCategoryData1.find((f) => f.id === id);
  const category = rawCategory
    ? {
        ...rawCategory,
        items: rawCategory.items.filter((item) => item.likes > 100),
      }
    : undefined;

  if (!category || category.items.length === 0) return null;

  return (
    <YStack
      width="100%"
      backgroundColor="#FFFFFF"
      paddingVertical="$2"
      paddingHorizontal="$3"
      gap="$6"
    >
      <XStack>
        <ThemedText
          style={{
            fontSize: 18,
            fontWeight: "700",
            color: "#6666FF",
          }}
        >
          Món phổ biến
        </ThemedText>
      </XStack>

      <FlatList
        data={category.items}
        renderItem={({ item }) => <FavoritesFood item={{ ...item }} />}
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

export default FlashListFavoritesFood;
