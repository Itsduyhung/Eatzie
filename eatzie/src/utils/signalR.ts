import { useEffect, useRef } from "react";
import { useNotificationStore } from "@/stores/notificationStore";

// Use polling to fetch notifications periodically
// This is simpler and more reliable than WebSocket in React Native
export const useNotificationPolling = (
  userId: number | null,
  enabled: boolean = true,
  interval: number = 10000
) => {
  const { fetchUnreadCount, fetchNotifications } = useNotificationStore();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!userId || !enabled) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // Initial fetch
    fetchNotifications(userId);
    fetchUnreadCount(userId);

    // Set up polling
    intervalRef.current = setInterval(() => {
      fetchNotifications(userId);
      fetchUnreadCount(userId);
    }, interval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [userId, enabled, interval, fetchNotifications, fetchUnreadCount]);
};

