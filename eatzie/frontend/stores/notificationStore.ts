import { NotificationService, NotificationResponse } from "@/domain/service/NotificationService";
import { create } from "zustand";

interface NotificationState {
  readNotifications: NotificationResponse[];
  unreadNotifications: NotificationResponse[];
  loading: boolean;
  error: string | null;

  fetchReadNotifications: (userId: number) => Promise<void>;
  fetchUnreadNotifications: (userId: number) => Promise<void>;
  fetchAllNotifications: (userId: number) => Promise<void>;
  addNotification: (notification: NotificationResponse) => void;
  markAsRead: (notificationId: number) => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  readNotifications: [],
  unreadNotifications: [],
  loading: false,
  error: null,

  fetchReadNotifications: async (userId: number) => {
    try {
      const readNotifications = await NotificationService.getReadNotifications(userId);
      set({ readNotifications });
    } catch (error: any) {
      set({ error: error.message || "Failed to fetch read notifications" });
    }
  },

  fetchUnreadNotifications: async (userId: number) => {
    try {
      const unreadNotifications = await NotificationService.getUnreadNotifications(userId);
      set({ unreadNotifications });
    } catch (error: any) {
      set({ error: error.message || "Failed to fetch unread notifications" });
    }
  },

  fetchAllNotifications: async (userId: number) => {
    set({ loading: true, error: null });
    try {
      await Promise.all([
        get().fetchReadNotifications(userId),
        get().fetchUnreadNotifications(userId),
      ]);
      set({ loading: false });
    } catch (error: any) {
      set({
        error: error.message || "Failed to fetch notifications",
        loading: false,
      });
    }
  },

  addNotification: (notification: NotificationResponse) => {
    set((state) => {
      // Check if notification already exists
      const existsInRead = state.readNotifications.some((n) => n.id === notification.id);
      const existsInUnread = state.unreadNotifications.some((n) => n.id === notification.id);
      
      if (existsInRead || existsInUnread) return state;

      // Add to appropriate list based on isRead status
      if (notification.isRead) {
        return {
          readNotifications: [notification, ...state.readNotifications],
        };
      } else {
        return {
          unreadNotifications: [notification, ...state.unreadNotifications],
        };
      }
    });
  },

  markAsRead: (notificationId: number) => {
    set((state) => {
      // Find notification in unread list
      const notification = state.unreadNotifications.find((n) => n.id === notificationId);
      
      if (!notification) return state; // Not found in unread, do nothing

      // Mark as read
      const updatedNotification = { ...notification, isRead: true };

      // Remove from unread and add to read
      return {
        unreadNotifications: state.unreadNotifications.filter((n) => n.id !== notificationId),
        readNotifications: [updatedNotification, ...state.readNotifications],
      };
    });
  },
}));

