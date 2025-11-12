import { useAuthStore } from "@/applicaton/stores/authStores";
import { useNotificationStore } from "@/stores/notificationStore";
import { useSignalRNotifications } from "@/utils/signalR";
import { Feather, Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { XStack } from "tamagui";
import { LinearGradient } from "tamagui/linear-gradient";

const formatTime = (dateString: string): string => {
  // Parse date string - DB đã lưu timestamptz nên có timezone info
  const date = new Date(dateString);

  // Convert sang Vietnam timezone (UTC+8) - cộng thêm 1h như yêu cầu
  const vietnamOffset = 8 * 60; // UTC+8 in minutes
  const localDate = new Date(
    date.getTime() + (vietnamOffset - date.getTimezoneOffset()) * 60 * 1000
  );

  // Format: HH:mm (chỉ hiển thị thời gian)
  const hours = String(localDate.getHours()).padStart(2, "0");
  const minutes = String(localDate.getMinutes()).padStart(2, "0");

  return `${hours}:${minutes}`;
};

export default function NotificationScreen() {
  const [tab, setTab] = useState<"all" | "unread">("all");
  const { user, isAuthenticated } = useAuthStore();
  const userId = user ? Number(user.userId) : null;

  const {
    readNotifications,
    unreadNotifications,
    loading,
    fetchAllNotifications,
    markAsRead,
  } = useNotificationStore();

  // Use SignalR for realtime notifications (no polling, saves server resources)
  useSignalRNotifications(userId, isAuthenticated);

  // Combine read and unread for "all" tab, sorted by createdAt (newest first)
  const allNotifications = useMemo(() => {
    const combined = [...readNotifications, ...unreadNotifications];
    return combined.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return dateB - dateA; // Newest first
    });
  }, [readNotifications, unreadNotifications]);

  const unreadCount = unreadNotifications.length;
  const data = tab === "all" ? allNotifications : unreadNotifications;

  const renderItem = ({ item }: { item: any }) => {
    const avatarSource = item.avatarUrl
      ? { uri: item.avatarUrl }
      : require("../../assets/images/mixue-logo_brandlogos.net_wijie.png");

    const handlePress = () => {
      // Nếu đang ở tab "unread" và notification chưa đọc, mark as read
      if (tab === "unread" && !item.isRead) {
        markAsRead(item.id);
      }
    };

    return (
      <TouchableOpacity style={styles.itemContainer} onPress={handlePress}>
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

  const insets = useSafeAreaInsets();

  if (!isAuthenticated || !userId) {
    return (
      <LinearGradient
        colors={["rgba(102, 102, 255, 1)", "rgba(245, 245, 245, 1)"]}
        locations={[0.01, 0.99]}
        start={[1, 0]}
        end={[0, 1]}
        style={{ flex: 1 }}
      >
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle="light-content"
        />
        <View
          style={[
            styles.container,
            styles.centerContainer,
            { paddingTop: insets.top },
          ]}
        >
          <Text style={styles.emptyText}>
            Vui lòng đăng nhập để xem thông báo
          </Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={["rgba(102, 102, 255, 1)", "rgba(245, 245, 245, 1)"]}
      locations={[0.01, 0.99]}
      start={[1, 0]}
      end={[0, 1]}
      style={{ flex: 1 }}
    >
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <View style={[styles.container, { paddingTop: insets.top }]}>
        {/* Header - Fixed outside FlatList */}
        <View style={styles.headerContainer}>
          <XStack
            alignItems="center"
            justifyContent="space-between"
            marginBottom={16}
          >
            <XStack alignItems="center">
              <Ionicons
                name="notifications"
                size={28}
                color="#111"
                style={{ marginRight: 8 }}
              />
              <Text fontSize={26} fontWeight="700" color="#111">
                Thông báo
              </Text>
            </XStack>
            <XStack alignItems="center" gap={12}>
              <TouchableOpacity>
                <Feather name="settings" size={22} color="#222" />
              </TouchableOpacity>
              <TouchableOpacity>
                <Ionicons name="options-outline" size={22} color="#222" />
              </TouchableOpacity>
            </XStack>
          </XStack>
          {/* Tabs */}
          <View style={styles.tabs}>
            <TouchableOpacity
              style={[styles.tabButton, tab === "all" && styles.tabActive]}
              onPress={() => setTab("all")}
            >
              <Text
                style={[styles.tabText, tab === "all" && styles.tabTextActive]}
              >
                Tất cả ({allNotifications.length})
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tabButton, tab === "unread" && styles.tabActive]}
              onPress={() => setTab("unread")}
            >
              <Text
                style={[
                  styles.tabText,
                  tab === "unread" && styles.tabTextActive,
                ]}
              >
                Chưa đọc ({unreadCount})
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Notification List - Same structure for both tabs */}
        {loading &&
        allNotifications.length === 0 &&
        unreadNotifications.length === 0 ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color="#5B5FEF" />
          </View>
        ) : data.length === 0 ? (
          <View style={styles.centerContainer}>
            <Text style={styles.emptyText}>
              {tab === "all"
                ? "Chưa có thông báo nào"
                : "Không có thông báo chưa đọc"}
            </Text>
          </View>
        ) : (
          <FlatList
            data={data}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 16 }}
            showsVerticalScrollIndicator={false}
            refreshing={loading}
            onRefresh={() => {
              if (userId) {
                fetchAllNotifications(userId);
              }
            }}
          />
        )}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerContainer: {
    padding: 20,
    paddingBottom: 0,
    backgroundColor: "#fff",
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
});
