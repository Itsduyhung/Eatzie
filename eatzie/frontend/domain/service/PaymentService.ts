import { get, post } from "@/infrastructure/api/axiosClient";
import { ApiResponse } from "@/types/axios";

export interface CreatePaymentRequest {
  orderId: number;
  amount: number;
  description?: string;
  returnUrl?: string;
  cancelUrl?: string;
}

export interface PaymentResponse {
  paymentId: number;
  orderId: number;
  paymentLink: string;
  payOSCode: string;
  status: string;
  amount: number;
  createdAt: string;
  paidAt?: string;
  qrCode?: string;
}

export class PaymentService {
  static async createPayment(
    request: CreatePaymentRequest
  ): Promise<ApiResponse<PaymentResponse>> {
    try {
      const response = await post<ApiResponse<PaymentResponse>>(
        "/Payment/create",
        request
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  static async verifyPayment(
    paymentCode: string
  ): Promise<ApiResponse<PaymentResponse>> {
    try {
      const response = await get<ApiResponse<PaymentResponse>>(
        `/Payment/verify/${paymentCode}`
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  static async getPaymentByOrder(
    orderId: number
  ): Promise<ApiResponse<PaymentResponse>> {
    try {
      const response = await get<ApiResponse<PaymentResponse>>(
        `/Payment/order/${orderId}`
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  static async verifyPaymentByOrder(
    orderId: number
  ): Promise<ApiResponse<PaymentResponse>> {
    try {
      const response = await get<ApiResponse<PaymentResponse>>(
        `/Payment/verify-order/${orderId}`
      );
      return response;
    } catch (error) {
      throw error;
    }
  }
}
