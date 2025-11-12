import { get, post } from "@/infrastructure/api/axiosClient";
import { mapFoodItemToCard } from "@/infrastructure/mappers/foodCardMapper";
import { ApiResponse } from "@/types/axios";
import { FoodItemD, FoodModel } from "@/types/foodCategory";
import { buildFormDataFromModel } from "@/utils/buildFormData";

export interface FoodSearchResult {
  id: number;
  content: string;
  description: string;
  imageUrl: string | null;
  isVegetarian: boolean;
  totalViews: number;
  averageRating: number;
  address: string | null;
  restaurantName: string | null;
  value?: number;
  price: number;
  restaurantId?: number;
}

const keyMap = {
  name: "Content",
  description: "Description",
  image: "ImageUrl",
  isVegetarian: "IsVegetarian",
  price: "Price",
  categoryNames: "CategoryNames",
};
export class SearchService {
  static async search(query: string): Promise<FoodItemD[]> {
    console.log(" Query api:", query);
    const apiData = await get<FoodSearchResult[]>("/Food/search", {
      params: { foodName: query },
    });
    return Array.isArray(apiData) ? apiData.map(mapFoodItemToCard) : [];
  }

  static async getFoodId(id: number): Promise<FoodItemD> {
    const apiResponse = await get<ApiResponse<FoodSearchResult>>(`/Food/${id}`);

    if (!apiResponse.data) {
      throw new Error("Food item not found");
    }
    return mapFoodItemToCard(apiResponse.data);
  }

  static async createFood(
    data: FoodModel,
    idRestaurant: number
  ): Promise<ApiResponse<FoodItemD>> {
    const formData = buildFormDataFromModel(data, keyMap);

    const response = await post<ApiResponse<FoodSearchResult>>(
      `/Food/${idRestaurant}`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    const mapped = response?.data
      ? mapFoodItemToCard(response.data)
      : ({} as FoodItemD);

    return {
      ...response,
      data: mapped,
    };
  }
}
