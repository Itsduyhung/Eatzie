import { Stack } from "expo-router";
import { useColorScheme } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { RootSiblingParent } from "react-native-root-siblings";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { FlyToCartProvider } from "@/components/anima/flyToCartManager";
import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { TamaguiProvider, Theme } from "tamagui";
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
      <FlyToCartProvider>
        <RootSiblingParent>
          <SafeAreaProvider>
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
                    <Stack.Screen
                      name="index"
                      options={{ headerShown: false, freezeOnBlur: true }}
                    />
                    <Stack.Screen
                      name="(tabs)/index"
                      options={{ headerShown: false, freezeOnBlur: true }}
                    />
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
                      options={{
                        headerTitle: "Đăng nhập 1",
                        headerShown: false,
                      }}
                    />
                    <Stack.Screen
                      name="(auth)/login"
                      options={{ headerTitle: "Đăng nhập", headerShown: false }}
                    />
                    <Stack.Screen
                      name="(features)/food/contentfood"
                      options={{ headerShown: false }}
                    />
                    <Stack.Screen
                      name="(features)/food/detailsfood"
                      options={{ headerShown: false }}
                    />
                    <Stack.Screen
                      name="(features)/survey/multistepsurvey"
                      options={{ headerShown: false }}
                    />
                    <Stack.Screen
                      name="(features)/cart/screencart"
                      options={{ headerShown: false }}
                    />
                    <Stack.Screen
                      name="(features)/cart/confirmorderscreen"
                      options={{ headerShown: false }}
                    />
                    <Stack.Screen
                      name="(features)/profile/settingprofile"
                      options={{ headerShown: false }}
                    />
                    <Stack.Screen
                      name="(features)/cart/qrscreen"
                      options={{ headerShown: false }}
                    />
                    <Stack.Screen
                      name="(features)/search/searchcategories"
                      options={{ headerShown: false }}
                    />
                    <Stack.Screen
                      name="(features)/search/foodsearchresult"
                      options={{ headerShown: false }}
                    />
                    <Stack.Screen
                      name="(features)/profile/userInfo"
                      options={{ headerShown: false }}
                    />
                    <Stack.Screen
                      name="(features)/profile/setAva"
                      options={{ headerShown: false }}
                    />

                    <Stack.Screen
                      name="(features)/profile/setName"
                      options={{ headerShown: false }}
                    />
                    <Stack.Screen
                      name="(features)/profile/setPhone"
                      options={{ headerShown: false }}
                    />
                  </Stack>
                </ThemeProvider>
              </Theme>
            </TamaguiProvider>
          </SafeAreaProvider>
        </RootSiblingParent>
      </FlyToCartProvider>
    </GestureHandlerRootView>
  );
};

export default RootLayout;
