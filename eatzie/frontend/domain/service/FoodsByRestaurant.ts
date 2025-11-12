import { mapFoodItemToCard } from "@/infrastructure/mappers/foodCardMapper";
import { FoodItemD } from "@/types/foodCategory";
import { RestaurantService } from "./RestaurantService";

export class RestaurantFoodService {
  static async getFoodsByRestaurantId(
    restaurantId: number
  ): Promise<FoodItemD[]> {
    const foods = await RestaurantService.getFoodsByRestaurant(restaurantId);

    const mappedFoods = foods.map((item) => mapFoodItemToCard(item));

    return mappedFoods;
  }
}
