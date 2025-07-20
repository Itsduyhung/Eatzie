import { isColorDark } from "@/app/untils/isColorDark";
import { usePathname } from "expo-router";
import type { StatusBarStyle } from "expo-status-bar";
import { StatusBar } from "expo-status-bar";
import React, { ReactNode, useMemo } from "react";
import type { ImageSourcePropType } from "react-native";
import { StyleSheet } from "react-native";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { XStack, YStack } from "tamagui";
import { CartFooter } from "../footer/CardFooter";
import { SizableImage } from "../ui/SizableImageProps";
import { ThemedScreen } from "./ThemedScreen";

type Props = {
  children: ReactNode;
  header?: ReactNode;
  gradientWrapper?: (children: ReactNode) => ReactNode;
  backgroundColor?: string;
  headerBackgroundColor?: string;
  centerContent?: boolean;
  statusBarStyle?: StatusBarStyle;
  backgroundImage?: ImageSourcePropType;
  headerLeftIcons?: ReactNode[];
  headerRightIcons?: ReactNode[];
};

export const ScrollScreenLayout = ({
  children,
  headerLeftIcons = [],
  headerRightIcons = [],
  header,
  gradientWrapper,
  backgroundColor = "#F5F5F5",
  headerBackgroundColor,
  centerContent = false,
  statusBarStyle,
  backgroundImage,
}: Props) => {
  const insets = useSafeAreaInsets();
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });
  const pathname = usePathname();
  const showCartFooterRoutes = ["/cartScreen", "/checkout"];
  const shouldShowCartFooter = showCartFooterRoutes.includes(pathname);

  const computedStatusBarStyle: StatusBarStyle | undefined = useMemo(() => {
    if (statusBarStyle) return statusBarStyle;
    if (headerBackgroundColor)
      return isColorDark(headerBackgroundColor) ? "light" : "dark";
    return undefined;
  }, [statusBarStyle, headerBackgroundColor]);

  return (
    <ThemedScreen backgroundColor={backgroundColor} padding="$0">
      {headerBackgroundColor && (
        <StatusBar
          style={computedStatusBarStyle}
          backgroundColor={headerBackgroundColor}
        />
      )}

      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        keyboardShouldPersistTaps="handled"
        automaticallyAdjustKeyboardInsets={false}
        contentInsetAdjustmentBehavior="never"
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingBottom: insets.bottom,
            justifyContent: centerContent ? "center" : "flex-start",
          },
        ]}
      >
        {backgroundImage ? (
          <YStack position="relative">
            <SizableImage
              style={{
                height: 200,
                width: "100%",
                marginTop: 0,
              }}
              source={backgroundImage}
              resizeMode="cover"
            />
            <XStack
              position="absolute"
              top={60}
              left={0}
              right={0}
              paddingHorizontal="$4"
              justifyContent="space-between"
              alignItems="center"
            >
              <XStack gap="$2">
                {headerLeftIcons.map((icon, index) => (
                  <YStack key={index}>{icon}</YStack>
                ))}
              </XStack>

              <XStack gap="$3">
                {headerRightIcons.map((icon, index) => (
                  <YStack key={index}>{icon}</YStack>
                ))}
              </XStack>
            </XStack>
          </YStack>
        ) : gradientWrapper ? (
          gradientWrapper(header)
        ) : (
          header
        )}

        {children}
      </Animated.ScrollView>
      {shouldShowCartFooter && <CartFooter />}
    </ThemedScreen>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
  },
});
