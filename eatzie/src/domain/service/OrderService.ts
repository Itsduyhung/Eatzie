import { post } from "@/infrastructure/api/axiosClient";
import { ApiResponse } from "@/types/axios";

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
