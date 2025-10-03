import { FoodCard } from "@/components/hotFood/cartContent";
import { SearchService } from "@/domain/service/SearchService";
import { FoodItemD } from "@/types/foodCategory";

import React, { useEffect, useState } from "react";
import { Dimensions } from "react-native";
import { Spinner, Text, YStack } from "tamagui";

type Props = {
  title?: string;
};

const RecentFoodScreen = ({ title }: Props) => {
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
        console.error("Error fetching foods:", err);
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
  const itemMargin = 8;

  const itemWidth =
    (screenWidth -
      containerPadding * 2 -
      gap * (numColumns - 1) -
      itemMargin * numColumns) /
    numColumns;

  return (
    <YStack
      flexDirection="column"
      padding={containerPadding}
      gap={gap}
      borderRadius={14}
      backgroundColor="#FFFFFF"
    >
      {title && (
        <Text fontSize="$5" fontWeight="700" marginBottom={8} color="#9B59B6">
          {title}
        </Text>
      )}

      <YStack
        flexDirection="row"
        flexWrap="wrap"
        justifyContent="center"
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
    </YStack>
  );
};

export default RecentFoodScreen;
