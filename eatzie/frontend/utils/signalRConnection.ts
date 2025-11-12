import * as signalR from "@microsoft/signalr";

import { NotificationResponse } from "@/domain/service/NotificationService";
import { storage } from "@/infrastructure/storage/tokenStorage";
import { useNotificationStore } from "@/stores/notificationStore";

class SignalRService {
  private connection: signalR.HubConnection | null = null;
  private baseUrl: string;

  constructor() {
    // Get base URL from environment or use default
    const apiUrl =
      process.env.EXPO_PUBLIC_API_URL || "http://172.20.10.3:5237/api";
    // SignalR hub URL (remove /api and add /notificationHub)
    this.baseUrl = apiUrl.replace("/api", "") + "/notificationHub";
  }

  async startConnection(userId: number): Promise<void> {
    if (this.connection?.state === signalR.HubConnectionState.Connected) {
      console.log("✅ SignalR already connected");
      return;
    }

    try {
      // Get JWT token for authentication
      const token = await storage.getItem("token");

      // Create connection with JWT token in headers
      this.connection = new signalR.HubConnectionBuilder()
        .withUrl(this.baseUrl, {
          skipNegotiation: false,
          transport:
            signalR.HttpTransportType.WebSockets |
            signalR.HttpTransportType.LongPolling,
          accessTokenFactory: async () => {
            const currentToken = await storage.getItem("token");
            return currentToken || "";
          },
        })
        .withAutomaticReconnect({
          nextRetryDelayInMilliseconds: (retryContext) => {
            // Exponential backoff: 0s, 2s, 10s, 30s, then 30s
            if (retryContext.previousRetryCount === 0) return 0;
            if (retryContext.previousRetryCount === 1) return 2000;
            if (retryContext.previousRetryCount === 2) return 10000;
            return 30000;
          },
        })
        .build();

      // Listen for new notifications
      this.connection.on(
        "ReceiveNotification",
        (notification: NotificationResponse) => {
          console.log("🔔 Received notification via SignalR:", notification);
          const { addNotification } = useNotificationStore.getState();
          addNotification(notification);
        }
      );

      // Connection event handlers
      this.connection.onreconnecting((error) => {
        console.log("🔄 SignalR reconnecting...", error);
      });

      this.connection.onreconnected((connectionId) => {
        console.log("✅ SignalR reconnected:", connectionId);
        // Rejoin user group after reconnection
        if (userId) {
          this.joinUserGroup(userId);
        }
      });

      this.connection.onclose((error) => {
        console.log("❌ SignalR connection closed", error);
      });

      // Start connection
      await this.connection.start();
      console.log("✅ SignalR connected successfully");

      // Join user group
      await this.joinUserGroup(userId);
    } catch (error) {
      console.error("❌ SignalR connection error:", error);
      throw error;
    }
  }

  async joinUserGroup(userId: number): Promise<void> {
    if (
      !this.connection ||
      this.connection.state !== signalR.HubConnectionState.Connected
    ) {
      console.warn("⚠️ Cannot join group: SignalR not connected");
      return;
    }

    try {
      await this.connection.invoke("JoinUserGroup", userId);
      console.log(`✅ Joined user group: user_${userId}`);
    } catch (error) {
      console.error("❌ Error joining user group:", error);
    }
  }

  async leaveUserGroup(userId: number): Promise<void> {
    if (
      !this.connection ||
      this.connection.state !== signalR.HubConnectionState.Connected
    ) {
      return;
    }

    try {
      await this.connection.invoke("LeaveUserGroup", userId);
      console.log(`✅ Left user group: user_${userId}`);
    } catch (error) {
      console.error("❌ Error leaving user group:", error);
    }
  }

  async stopConnection(): Promise<void> {
    if (this.connection) {
      try {
        await this.connection.stop();
        console.log("✅ SignalR connection stopped");
      } catch (error) {
        console.error("❌ Error stopping SignalR connection:", error);
      } finally {
        this.connection = null;
      }
    }
  }

  isConnected(): boolean {
    return this.connection?.state === signalR.HubConnectionState.Connected;
  }
}

// Singleton instance
export const signalRService = new SignalRService();
