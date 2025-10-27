import { useFoodStore } from "@/stores/FoodStore";
import { FoodItemD } from "@/types/foodCategory";
import { useEffect, useMemo } from "react";
import { Spinner, YStack } from "tamagui";

type FoodListSectionProps = {
  ids: number[];
  title?: string;
  renderList: (foods: FoodItemD[]) => React.ReactNode;
};

export const FoodListSection = ({
  ids,
  title,
  renderList,
}: FoodListSectionProps) => {
  const foods = useFoodStore((s) => s.foods);
  const loading = useFoodStore((s) => s.loading);
  const fetchFood = useFoodStore((s) => s.fetchFood);

  const foodList = useMemo(
    () => ids.map((id) => foods[id]).filter(Boolean) as FoodItemD[],
    [ids, foods]
  );

  const isLoading = useMemo(
    () => ids.some((id) => loading[id]),
    [ids, loading]
  );

  useEffect(() => {
    ids.forEach((id) => {
      if (!foods[id] && !loading[id]) {
        fetchFood(id);
      }
    });
  }, [ids, foods, loading, fetchFood]);

  if (isLoading) {
    return (
      <YStack f={1} jc="center" ai="center" py="$4">
        <Spinner size="large" />
      </YStack>
    );
  }

  return <>{renderList(foodList)}</>;
};
