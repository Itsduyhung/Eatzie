import { Stack } from "expo-router";
import { useColorScheme } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { RootSiblingParent } from "react-native-root-siblings";
import { SafeAreaView } from "react-native-safe-area-context";

import { TamaguiProvider, Theme } from "tamagui";

import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import config from "tamagui.config";

const RootLayout = () => {
  const colorScheme = useColorScheme();

  const navTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: "transparent",
    },
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <RootSiblingParent>
        <SafeAreaView style={{ flex: 1 }}>
          <TamaguiProvider config={config}>
            <Theme name={colorScheme === "dark" ? "dark" : "light"}>
              <ThemeProvider value={navTheme}>
                <Stack
                  screenOptions={{
                    headerStyle: {
                      backgroundColor: "#f4511e",
                    },
                    headerTintColor: "#fff",
                    headerTitleStyle: {
                      fontWeight: "bold",
                    },
                  }}
                >
                  <Stack.Screen name="index" options={{ headerShown: false }} />
                  <Stack.Screen
                    name="(auth)/signup"
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="(auth)/verify"
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="(tabs)"
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="product/index"
                    options={{ headerTitle: "Sản phẩm" }}
                  />
                  <Stack.Screen
                    name="(auth)/login1"
                    options={{ headerTitle: "Đăng nhập 1", headerShown: false }}
                  />

                  <Stack.Screen
                    name="(auth)/login"
                    options={{ headerTitle: "Đăng nhập", headerShown: false }}
                  />
                </Stack>
              </ThemeProvider>
            </Theme>
          </TamaguiProvider>
        </SafeAreaView>
      </RootSiblingParent>
    </GestureHandlerRootView>
  );
};

export default RootLayout;
