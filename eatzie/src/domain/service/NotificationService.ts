import { get, post as postRequest, putRaw } from "@/infrastructure/api/axiosClient";
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
  static async getNotifications(userId: number): Promise<NotificationResponse[]> {
    const response = await get<ApiResponse<NotificationResponse[]>>(`/Notification/${userId}`);
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

  static async getUnreadCount(userId: number): Promise<number> {
    const response = await get<ApiResponse<{ count: number }>>(`/Notification/unread-count/${userId}`);
    if (response.isSuccess && response.data) {
      return response.data.count || 0;
    }
    return 0;
  }

  static async markAsRead(notificationId: number): Promise<void> {
    await putRaw(`/Notification/mark-read/${notificationId}`, {});
  }

  static async markAllAsRead(userId: number): Promise<void> {
    await putRaw(`/Notification/mark-all-read/${userId}`, {});
  }
}

