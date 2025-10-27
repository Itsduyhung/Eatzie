import { get } from "@/infrastructure/api/axiosClient";
import { mapRestaurantItemToCard } from "@/infrastructure/mappers/restaurant.mapper";
import { ApiResponse } from "@/types/axios";
import { RestaurantItem, RestaurantResult } from "@/types/restaurant";
import { FoodSearchResult } from "./SearchService";

export class RestaurantService {
  static async getRestaurantById(id: number): Promise<RestaurantItem> {
    const apiResponse = await get<ApiResponse<RestaurantResult>>(
      `/Restaurant/${id}`
    );

    if (!apiResponse.data) {
      throw new Error("Restaurant item not found");
    }

    return mapRestaurantItemToCard(apiResponse.data);
  }

  static async getFoodsByRestaurant(id: number): Promise<FoodSearchResult[]> {
    const params = { restaurantId: id };

    const apiResponse = await get<ApiResponse<FoodSearchResult[]>>(
      `/Restaurant/foods`,
      {
        params,
      }
    );

    return apiResponse.data ?? [];
  }
}
