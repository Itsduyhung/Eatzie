import { get, post } from "@/infrastructure/api/axiosClient";
import { mapRestaurantItemToCard } from "@/infrastructure/mappers/restaurant.mapper";
import { ApiResponse } from "@/types/axios";
import {
  RestaurantItem,
  RestaurantModel,
  RestaurantResult,
} from "@/types/restaurant";
import { buildFormDataFromModel } from "@/utils/buildFormData";
import { FoodSearchResult } from "./SearchService";

const keyMap = {
  name: "Name",
  description: "Description",
  address: "Address",
  phone: "PhoneNumber",
  lat: "Latitude",
  lng: "Longitude",
  status: "Status",
  image: "Image",
} as const;

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
      { params }
    );

    return apiResponse.data ?? [];
  }

  static async createRestaurant(
    data: RestaurantModel
  ): Promise<ApiResponse<RestaurantResult>> {
    const formData = buildFormDataFromModel(data, keyMap);

    const response: ApiResponse<RestaurantResult> = await post(
      "/Restaurant",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    return response;
  }
}
