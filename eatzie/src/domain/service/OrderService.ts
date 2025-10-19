import { get, post } from "@/infrastructure/api/axiosClient";
import { mapOrderRawToDomain } from "@/infrastructure/mappers/order.ts/createOrder";
import { ApiResponse } from "@/types/axios";
import {
  OrderCreateResProps,
  OrderCreateResRawProps,
} from "@/types/order.types";

export interface PriceAllFoods {
  price: number;
  note: string;
}

export class OrderService {
  static async createOrder(
    price: PriceAllFoods
  ): Promise<ApiResponse<OrderCreateResProps>> {
    const response: ApiResponse<OrderCreateResRawProps> = await post(
      "/Order/create",
      price
    );
    if (response.data) {
      const mappedData: OrderCreateResProps = mapOrderRawToDomain(
        response.data
      );
      return { ...response, data: mappedData };
    }
    return { ...response, data: undefined };
  }

  static async getOrderById(
    id: number
  ): Promise<ApiResponse<OrderCreateResProps>> {
    return get<ApiResponse<OrderCreateResProps>>(`/Order/${id}`);
  }
}
