import { post } from "@/infrastructure/api/axiosClient";
import { ApiResponse } from "@/types/axios";

export interface AddCartItemInput {
  foodId: number;
  quantity: number;
}

export class CartService {
  static async addToCart(
    items: AddCartItemInput[]
  ): Promise<ApiResponse<null>> {
    return post<ApiResponse<null>>("/Cart/add", { items });
  }
}
