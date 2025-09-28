import { api } from "./axiosClient";

export interface BaseAPIResponse<T> {
  isSuccess: boolean;
  statusCode: number;
  message: string;
  data: T;
}

export interface FoodBriefResponse {
  id: number;
  content: string;
  description?: string;
  price?: number;
  imageUrl: string;
  isVegetarian?: boolean;
  createdAt?: string;
  restaurantName?: string | null;
  totalViews?: number;
  averageRating?: number;
  address?: string;
}

export interface FoodResponse extends FoodBriefResponse {}

export async function getFoodById(foodId: number) {
  try {
    console.log(`[FoodAPI] Fetching food with ID: ${foodId}`);
    console.log(`[FoodAPI] API base URL:`, api.defaults.baseURL);
    console.log(`[FoodAPI] Full URL:`, `${api.defaults.baseURL}/Food/${foodId}`);
    
    const res = await api.get<BaseAPIResponse<FoodBriefResponse>>(
      `/Food/${foodId}`
    );
    
    console.log(`[FoodAPI] Response for ID ${foodId}:`, res.data);
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const payload: any = res as any;
    const body = payload.data as BaseAPIResponse<FoodBriefResponse>;
    // Backend returns { isSuccess, statusCode, message, data }
    if (!body) {
      console.warn(`[FoodAPI] No body in response for ID ${foodId}`);
      return null as unknown as FoodBriefResponse;
    }
    if ((body as any).isSuccess === false) {
      console.warn(`[FoodAPI] API returned isSuccess=false for ID ${foodId}:`, body);
      return null as unknown as FoodBriefResponse;
    }
    console.log(`[FoodAPI] Successfully fetched food for ID ${foodId}:`, body.data);
    return body.data as FoodBriefResponse;
  } catch (err: any) {
    console.error(`[FoodAPI] Error fetching food ID ${foodId}:`, err);
    console.error(`[FoodAPI] Error response:`, err?.response?.data);
    console.error(`[FoodAPI] Error status:`, err?.response?.status);
    // Swallow 404 and return null so UI can skip missing ids
    if (err?.response?.status === 404) return null as unknown as FoodBriefResponse;
    return null as unknown as FoodBriefResponse;
  }
}

export async function searchFoodsByName(name?: string) {
  const params: any = {};
  if (name && name.trim().length > 0) params.foodName = name.trim();
  const res = await api.get<FoodResponse[]>(`/Food/search`, { params });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const payload: any = res as any;
  return payload.data as FoodResponse[]; // backend returns list directly
}


