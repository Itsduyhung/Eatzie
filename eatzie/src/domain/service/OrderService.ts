import { get, post } from "@/infrastructure/api/axiosClient";
import { mapOrderRawToDomain } from "@/infrastructure/mappers/order.ts/createOrder";
import { ApiResponse } from "@/types/axios";
import {
  OrderCreateResProps,
  OrderCreateResRawProps,
} from "@/types/order.types";

export interface PriceAllFoods {
  totalPrice: number;
  note?: string;
}

export interface OrderItem {
  foodId: number;
  quantity: number;
  price: number;
  note?: string;
  foodName?: string;
  imageUrl?: string;
}

export interface OrderData {
  orderId: number;
  createdAt: string;
  totalAmount: number;
  status: string;
  items: OrderItem[];
}

export class OrderService {
  static async createOrder(price: PriceAllFoods): Promise<ApiResponse<OrderData>> {
    return post<ApiResponse<OrderData>>("/Order/create", price);
  }
}
