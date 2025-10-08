import { get } from "@/infrastructure/api/axiosClient";
import { mapFoodItemToCard } from "@/infrastructure/mappers/foodCardMapper";
import { ApiResponse } from "@/types/axios";
import { FoodItemD } from "@/types/foodCategory";

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
}
