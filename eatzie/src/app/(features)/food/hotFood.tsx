import { FlashFoodList } from "@/components/flastList/FlashListCard";
import { SearchService } from "@/domain/service/SearchService";
import { FoodItemD } from "@/types/foodCategory";

import React, { useEffect, useState } from "react";
import { Spinner, YStack } from "tamagui";

const HotFoodScreen = () => {
  const [foods, setFoods] = useState<FoodItemD[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFoods() {
      try {
        const ids = [2, 4, 6];
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

  return <FlashFoodList title="Đặc sản" data={foods} cardHeight={140} />;
};

export default HotFoodScreen;
