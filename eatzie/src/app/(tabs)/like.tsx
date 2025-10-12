import { FoodCard } from "@/components/hotFood/cartContent";
import { ScrollScreenLayout } from "@/components/layout/ScrollScreenLayout";
import { SearchService } from "@/domain/service/SearchService";
import { FoodItemD } from "@/types/foodCategory";

import React, { useEffect, useState } from "react";
import { Dimensions } from "react-native";
import { Spinner, YStack } from "tamagui";

const FoodTestScreen = () => {
  const [foods, setFoods] = useState<FoodItemD[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFoods() {
      try {
        const ids = [10, 4, 6, 7, 8];
        const results = await Promise.all(
          ids.map((id) => SearchService.getFoodId(id))
        );
        setFoods(results);
      } catch (err) {
        console.error(" Error fetching foods:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchFoods();
  }, []);

  if (loading) {
    return (
      <YStack f={1} jc="center" ai="center">
        <Spinner size="large" />
      </YStack>
    );
  }

  const screenWidth = Dimensions.get("window").width;
  const containerPadding = 16;
  const gap = 16;
  const numColumns = 2;

  const itemWidth =
    (screenWidth - containerPadding * 2 - gap * (numColumns - 1)) / numColumns;

  return (
    <ScrollScreenLayout>
      <YStack
        flexDirection="row"
        flexWrap="wrap"
        justifyContent="center"
        padding={containerPadding}
        gap={gap}
      >
        {foods.map((item) => (
          <YStack key={item.id} width={itemWidth} marginBottom={gap}>
            <FoodCard
              item={item}
              containerProps={{ maxWidth: itemWidth }}
              hasRatingOrView={true}
            />
          </YStack>
        ))}
      </YStack>
    </ScrollScreenLayout>
  );
};

export default FoodTestScreen;
