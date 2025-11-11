import { NotificationService, NotificationResponse } from "@/domain/service/NotificationService";
import { create } from "zustand";

interface NotificationState {
  notifications: NotificationResponse[];
  unreadNotifications: NotificationResponse[];
  unreadCount: number;
  loading: boolean;
  error: string | null;

  fetchNotifications: (userId: number) => Promise<void>;
  fetchUnreadNotifications: (userId: number) => Promise<void>;
  fetchUnreadCount: (userId: number) => Promise<void>;
  markAsRead: (notificationId: number) => Promise<void>;
  markAllAsRead: (userId: number) => Promise<void>;
  addNotification: (notification: NotificationResponse) => void;
  updateNotification: (notification: NotificationResponse) => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadNotifications: [],
  unreadCount: 0,
  loading: false,
  error: null,

  fetchNotifications: async (userId: number) => {
    set({ loading: true, error: null });
    try {
      const notifications = await NotificationService.getNotifications(userId);
      set({
        notifications,
        loading: false,
      });
    } catch (error: any) {
      set({
        error: error.message || "Failed to fetch notifications",
        loading: false,
      });
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

  fetchUnreadCount: async (userId: number) => {
    try {
      const count = await NotificationService.getUnreadCount(userId);
      set({ unreadCount: count });
    } catch (error: any) {
      set({ error: error.message || "Failed to fetch unread count" });
    }
  },

  markAsRead: async (notificationId: number) => {
    try {
      await NotificationService.markAsRead(notificationId);
      set((state) => ({
        notifications: state.notifications.map((n) =>
          n.id === notificationId ? { ...n, isRead: true } : n
        ),
        unreadNotifications: state.unreadNotifications.filter((n) => n.id !== notificationId),
        unreadCount: Math.max(0, state.unreadCount - 1),
      }));
    } catch (error: any) {
      set({ error: error.message || "Failed to mark as read" });
    }
  },

  markAllAsRead: async (userId: number) => {
    try {
      await NotificationService.markAllAsRead(userId);
      set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
        unreadNotifications: [],
        unreadCount: 0,
      }));
    } catch (error: any) {
      set({ error: error.message || "Failed to mark all as read" });
    }
  },

  addNotification: (notification: NotificationResponse) => {
    set((state) => {
      const exists = state.notifications.some((n) => n.id === notification.id);
      if (exists) return state;

      return {
        notifications: [notification, ...state.notifications],
        unreadNotifications: notification.isRead
          ? state.unreadNotifications
          : [notification, ...state.unreadNotifications],
        unreadCount: notification.isRead ? state.unreadCount : state.unreadCount + 1,
      };
    });
  },

  updateNotification: (notification: NotificationResponse) => {
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === notification.id ? notification : n
      ),
      unreadNotifications: state.unreadNotifications.map((n) =>
        n.id === notification.id ? notification : n
      ),
    }));
  },
}));

