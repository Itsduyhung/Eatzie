import { get } from "@/infrastructure/api/axiosClient";
import { mapRestaurantItemToCard } from "@/infrastructure/mappers/restaurant.mapper";
import { ApiResponse } from "@/types/axios";
import { RestaurantItem, RestaurantResult } from "@/types/restaurant";

export class RestaurantService {
  static async getById(id: number): Promise<RestaurantItem> {
    const apiResponse = await get<ApiResponse<RestaurantResult>>(
      `/Restaurant/${id}`
    );

    if (!apiResponse.data) {
      throw new Error("Resturant item not found");
    }
    return mapRestaurantItemToCard(apiResponse.data);
  }
}
