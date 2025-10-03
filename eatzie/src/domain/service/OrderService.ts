import { post } from "@/infrastructure/api/axiosClient";
import { ApiResponse } from "@/types/axios";

export interface PriceAllFoods {
  price: number;
}

export class OrderService {
  static async createOrder(price: PriceAllFoods): Promise<ApiResponse<null>> {
    return post<ApiResponse<null>>("/Order/create", price);
  }
}
