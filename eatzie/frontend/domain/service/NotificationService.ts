import { get } from "@/infrastructure/api/axiosClient";
import { ApiResponse } from "@/types/axios";

export interface NotificationResponse {
  id: number;
  userId: number;
  title: string;
  content: string;
  type: string;
  isRead: boolean;
  createdAt: string;
  avatarUrl?: string | null;
}

export class NotificationService {
  static async getReadNotifications(userId: number): Promise<NotificationResponse[]> {
    const response = await get<ApiResponse<NotificationResponse[]>>(`/Notification/read/${userId}`);
    if (response.isSuccess && response.data) {
      return Array.isArray(response.data) ? response.data : [];
    }
    return [];
  }

  static async getUnreadNotifications(userId: number): Promise<NotificationResponse[]> {
    const response = await get<ApiResponse<NotificationResponse[]>>(`/Notification/unread/${userId}`);
    if (response.isSuccess && response.data) {
      return Array.isArray(response.data) ? response.data : [];
    }
    return [];
  }
}

