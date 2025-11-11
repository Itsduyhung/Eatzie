import { post, get } from "@/infrastructure/api/axiosClient";
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
  qrCode?: string; // QR code dưới dạng base64 string từ PayOS API
}

export class PaymentService {
  static async createPayment(request: CreatePaymentRequest): Promise<ApiResponse<PaymentResponse>> {
    return post<ApiResponse<PaymentResponse>>("/Payment/create", request);
  }

  static async verifyPayment(paymentCode: string): Promise<ApiResponse<PaymentResponse>> {
    return get<ApiResponse<PaymentResponse>>(`/Payment/verify/${paymentCode}`);
  }

  static async getPaymentByOrder(orderId: number): Promise<ApiResponse<PaymentResponse>> {
    return get<ApiResponse<PaymentResponse>>(`/Payment/order/${orderId}`);
  }

  static async verifyPaymentByOrder(orderId: number): Promise<ApiResponse<PaymentResponse>> {
    return get<ApiResponse<PaymentResponse>>(`/Payment/verify-order/${orderId}`);
  }
}



