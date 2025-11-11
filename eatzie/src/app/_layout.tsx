import { Stack } from "expo-router";
import { useColorScheme } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { RootSiblingParent } from "react-native-root-siblings";
import { SafeAreaProvider } from "react-native-safe-area-context";
import React, { Component, ErrorInfo, ReactNode } from "react";
import { View, Text, StyleSheet } from "react-native";

import { FlyToCartProvider } from "@/components/anima/flyToCartManager";
import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { TamaguiProvider, Theme } from "tamagui";
import config from "tamagui.config";

// Simple Error Boundary
class ErrorBoundary extends Component<
  { children: ReactNode; FallbackComponent?: React.ComponentType<{ error: Error; resetErrorBoundary: () => void }> },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: ReactNode; FallbackComponent?: React.ComponentType<{ error: Error; resetErrorBoundary: () => void }> }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("❌ ErrorBoundary caught error:", error);
    console.error("❌ ErrorInfo:", errorInfo);
  }

  render() {
    if (this.state.hasError && this.state.error) {
      const Fallback = this.props.FallbackComponent || ErrorFallback;
      return <Fallback error={this.state.error} resetErrorBoundary={() => this.setState({ hasError: false, error: null })} />;
    }

    return this.props.children;
  }
}

// Error Fallback Component
function ErrorFallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
  return (
    <View style={styles.errorContainer}>
      <Text style={styles.errorTitle}>⚠️ App Error</Text>
      <Text style={styles.errorMessage}>{error.message}</Text>
      <Text style={styles.errorStack}>{error.stack?.substring(0, 500)}</Text>
      <Text style={styles.errorButton} onPress={resetErrorBoundary}>
        Try Again
      </Text>
    </View>
  );
}

const RootLayout = () => {
  console.log("🚀 RootLayout: Starting initialization...");
  
  const colorScheme = useColorScheme();
  console.log("🚀 RootLayout: ColorScheme =", colorScheme);

  const navTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: "transparent",
    },
  };

  try {
    console.log("🚀 RootLayout: Creating TamaguiProvider...");
    
    return (
      <ErrorBoundary>
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
                          name="(tabs)"
                          options={{ headerShown: false }}
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
                          name="(features)/cart/paymentsuccess"
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
                          name="(features)/profile/userDiet"
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
                        <Stack.Screen
                          name="(features)/profile/savedFood"
                          options={{ headerShown: false }}
                        />
                        <Stack.Screen
                          name="(features)/feedback/postf"
                          options={{ headerShown: false }}
                        />
                        <Stack.Screen
                          name="(features)/feedback/ratingScreen"
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
      </ErrorBoundary>
    );
  } catch (error) {
    console.error("❌ RootLayout Error:", error);
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>⚠️ RootLayout Error</Text>
        <Text style={styles.errorMessage}>{error instanceof Error ? error.message : String(error)}</Text>
        {error instanceof Error && error.stack && (
          <Text style={styles.errorStack}>{error.stack.substring(0, 500)}</Text>
        )}
      </View>
    );
  }
};

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#f4511e",
    marginBottom: 10,
  },
  errorMessage: {
    fontSize: 16,
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  errorStack: {
    fontSize: 12,
    color: "#666",
    marginBottom: 20,
    fontFamily: "monospace",
  },
  errorButton: {
    fontSize: 16,
    color: "#f4511e",
    fontWeight: "bold",
    padding: 10,
    borderWidth: 1,
    borderColor: "#f4511e",
    borderRadius: 5,
  },
});

export default RootLayout;
