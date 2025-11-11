import { useAuthStore } from "@/applicaton/stores/authStores";
import { useNotificationStore } from "@/stores/notificationStore";
import { useNotificationPolling } from "@/utils/signalR";
import { Feather, Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const formatTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Vừa xong";
  if (diffMins < 60) return `${diffMins} phút trước`;
  if (diffHours < 24) return `${diffHours} giờ trước`;
  if (diffDays < 7) return `${diffDays} ngày trước`;

  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function NotificationScreen() {
  const [tab, setTab] = useState<"all" | "unread">("all");
  const { user, isAuthenticated } = useAuthStore();
  const userId = user ? Number(user.userId) : null;

  const {
    notifications,
    unreadNotifications,
    unreadCount,
    loading,
    fetchNotifications,
    fetchUnreadNotifications,
    markAsRead,
    markAllAsRead,
  } = useNotificationStore();

  // Poll for new notifications every 10 seconds when tab is focused
  useNotificationPolling(userId, isAuthenticated, 10000);

  useEffect(() => {
    if (userId && isAuthenticated) {
      fetchNotifications(userId);
      fetchUnreadNotifications(userId);
    }
  }, [userId, isAuthenticated]);

  const handleMarkAsRead = async (notificationId: number) => {
    await markAsRead(notificationId);
  };

  const handleMarkAllAsRead = async () => {
    if (userId) {
      await markAllAsRead(userId);
    }
  };

  const renderItem = ({ item }: { item: any }) => {
    const avatarSource = item.avatarUrl
      ? { uri: item.avatarUrl }
      : require("../../assets/images/mixue-logo_brandlogos.net_wijie.png");

    return (
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={() => !item.isRead && handleMarkAsRead(item.id)}
      >
        <Image source={avatarSource} style={styles.avatar} />
        <View style={{ flex: 1 }}>
          <View style={styles.row}>
            <Text style={styles.name}>{item.title}</Text>
            {!item.isRead && <View style={styles.dot} />}
            <Text style={styles.time}>{formatTime(item.createdAt)}</Text>
          </View>
          <Text style={styles.content}>{item.content}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const data = tab === "all" ? notifications : unreadNotifications;

  if (!isAuthenticated || !userId) {
    return (
      <View style={[styles.container, styles.centerContainer]}>
        <Text style={styles.emptyText}>Vui lòng đăng nhập để xem thông báo</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Thông báo</Text>
        <View style={styles.headerIcons}>
          {unreadCount > 0 && tab === "all" && (
            <TouchableOpacity
              onPress={handleMarkAllAsRead}
              style={{ marginRight: 16 }}
            >
              <Text style={styles.markAllText}>Đọc tất cả</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={{ marginRight: 16 }}>
            <Feather name="settings" size={22} color="#222" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="options-outline" size={22} color="#222" />
          </TouchableOpacity>
        </View>
      </View>
      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tabButton, tab === "all" && styles.tabActive]}
          onPress={() => setTab("all")}
        >
          <Text style={[styles.tabText, tab === "all" && styles.tabTextActive]}>
            Tất cả ({notifications.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, tab === "unread" && styles.tabActive]}
          onPress={() => setTab("unread")}
        >
          <Text
            style={[styles.tabText, tab === "unread" && styles.tabTextActive]}
          >
            Chưa đọc ({unreadCount})
          </Text>
        </TouchableOpacity>
      </View>
      {/* Notification List */}
      {loading && notifications.length === 0 ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#5B5FEF" />
        </View>
      ) : data.length === 0 ? (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>
            {tab === "all" ? "Chưa có thông báo nào" : "Không có thông báo chưa đọc"}
          </Text>
        </View>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          contentContainerStyle={{ paddingBottom: 16 }}
          showsVerticalScrollIndicator={false}
          refreshing={loading}
          onRefresh={() => {
            if (userId) {
              fetchNotifications(userId);
              fetchUnreadNotifications(userId);
            }
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 40,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#222",
  },
  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
  tabs: {
    flexDirection: "row",
    backgroundColor: "#F2F4F7",
    borderRadius: 16,
    marginBottom: 20,
    padding: 4,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 12,
  },
  tabActive: {
    backgroundColor: "#5B5FEF",
  },
  tabText: {
    color: "#222",
    fontWeight: "500",
  },
  tabTextActive: {
    color: "#fff",
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  name: {
    fontWeight: "bold",
    fontSize: 16,
    marginRight: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#1ED760",
    marginRight: 6,
  },
  time: {
    marginLeft: "auto",
    color: "#888",
    fontSize: 13,
  },
  content: {
    color: "#444",
    fontSize: 14,
    marginRight: 12,
  },
  separator: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 2,
    marginLeft: 60,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    color: "#888",
    fontSize: 16,
    textAlign: "center",
  },
  markAllText: {
    color: "#5B5FEF",
    fontSize: 14,
    fontWeight: "500",
  },
});
