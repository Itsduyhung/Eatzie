import { APP_COLOR } from "@/utils/constants";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { StatusBar } from "react-native";

const getIcons = (routeName: string, focused: boolean, size: number) => {
  let iconName: keyof typeof Ionicons.glyphMap;

  switch (routeName) {
    case "index":
      iconName = focused ? "home" : "home-outline";
      break;
    case "order":
      iconName = focused ? "receipt" : "receipt-outline";
      break;
    case "like":
      iconName = focused ? "heart" : "heart-outline";
      break;
    case "notification":
      iconName = focused ? "notifications" : "notifications-outline";
      break;
    case "account":
      iconName = focused ? "person" : "person-outline";
      break;
    case "manage":
      iconName = focused ? "storefront" : "storefront-outline";
      break;
    default:
      iconName = "help-circle";
  }

  return (
    <Ionicons
      name={iconName}
      size={size}
      color={focused ? APP_COLOR.ORANGE : "gray"}
    />
  );
};

export default function TabLayout() {
  return (
    <>
      <StatusBar backgroundColor={APP_COLOR.ORANGE} translucent={false} />
      <Tabs
        screenOptions={({ route }) => ({
          headerShown: false,
          freezeOnBlur: true,
          tabBarStyle: {
            height: 50,
            paddingBottom: 5,
            backgroundColor: "#fff",
          },
          tabBarIcon: ({ focused, size }) =>
            getIcons(route.name, focused, size),
          tabBarLabelStyle: { paddingBottom: 5 },
          tabBarActiveTintColor: APP_COLOR.ORANGE,
        })}
      >
        <Tabs.Screen name="index" options={{ title: "Home" }} />
        <Tabs.Screen name="order" options={{ title: "My Orders" }} />
        <Tabs.Screen
          name="like"
          options={{
            title: "Like",
            href: null,
          }}
        />
        <Tabs.Screen name="notification" options={{ title: "Notifications" }} />
        <Tabs.Screen name="account" options={{ title: "Me" }} />
        <Tabs.Screen name="manage" options={{ title: "Stored" }} />
      </Tabs>
    </>
  );
}
