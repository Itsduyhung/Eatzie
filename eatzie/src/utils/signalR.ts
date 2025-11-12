import { useEffect } from "react";
import { useNotificationStore } from "@/stores/notificationStore";
import { signalRService } from "./signalRConnection";

// Use SignalR for realtime notifications instead of polling
export const useSignalRNotifications = (
  userId: number | null,
  enabled: boolean = true
) => {
  const { fetchAllNotifications } = useNotificationStore();

  useEffect(() => {
    if (!userId || !enabled) {
      // Disconnect when disabled
      signalRService.stopConnection();
      return;
    }

    // Initial fetch to get existing notifications
    fetchAllNotifications(userId);

    // Connect to SignalR for realtime updates
    signalRService.startConnection(userId).catch((error) => {
      console.error("❌ Failed to start SignalR connection:", error);
      // Fallback: fetch notifications once if SignalR fails
      fetchAllNotifications(userId);
    });

    // Cleanup: disconnect when component unmounts or userId changes
    return () => {
      signalRService.stopConnection();
    };
  }, [userId, enabled, fetchAllNotifications]);
};

