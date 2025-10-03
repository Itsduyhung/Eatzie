import { FoodSearchResult } from "@/domain/service/SearchService";
import { FoodItemD } from "@/types/foodCategory";

export function mapFoodItemToCard(item: FoodSearchResult): FoodItemD {
  return {
    id: item.id,
    name: item.restaurantName ?? item.content ?? "Tên món ăn",
    description: item.description ?? "",
    image: item.imageUrl,
    price: item.price,
    isVegetarian: item.isVegetarian,
    views: item.totalViews,
    rating: item.averageRating,
    restaurantName: item.restaurantName,
    address: item.address,
  };
}
