import { FlashFoodList } from "@/components/flastList/FlashListCard";

import { useFoodStore } from "@/stores/FoodStore";
import { FoodItemD } from "@/types/foodCategory";
import { useEffect } from "react";
import { Spinner, YStack } from "tamagui";

const recommendedIds = [12, 14, 16, 18, 20]; // ID món ăn đề xuất

const RecommentdedFoodScreen = () => {
  const { foods, loading, fetchFood } = useFoodStore();

  const foodList: FoodItemD[] = recommendedIds
    .map((id) => foods[id])
    .filter(Boolean) as FoodItemD[];

  const isLoading = recommendedIds.some((id) => loading[id]);

  useEffect(() => {
    recommendedIds.forEach((id) => fetchFood(id));
  }, [fetchFood]);

  if (isLoading) {
    return (
      <YStack f={1} jc="center" ai="center">
        <Spinner size="large" />
      </YStack>
    );
  }

  return (
    <FlashFoodList
      title="Món ăn đề xuất cho bạn hôm nay"
      data={foodList}
      cardWidth={250}
      hasDetailFoodCard={true}
      paddingRight={50}
      highlightBorder={true}
    />
  );
};

export default RecommentdedFoodScreen;
