// anima/FavoritesFood.tsx
import { FoodItem } from "@/types/foodCategory";
import { FoodCardItem } from "./CartItem";

type FavoritesFoodProps = {
  item: FoodItem;
};

export const FavoritesFood = ({ item }: FavoritesFoodProps) => {
  return <FoodCardItem item={item} />;
};
