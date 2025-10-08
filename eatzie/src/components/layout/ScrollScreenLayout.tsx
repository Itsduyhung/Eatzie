import { StatusBar } from "expo-status-bar";
import React, { ReactNode, useState } from "react";
import {
  ImageSourcePropType,
  LayoutChangeEvent,
  StyleSheet,
} from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { XStack, YStack } from "tamagui";

import { usePathname } from "expo-router";
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
  statusBarStyle?: "light" | "dark";
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
  const pathname = usePathname();

  const [headerHeight, setHeaderHeight] = useState(0);

  const showCartFooterRoutes = ["/cartScreen", "/checkout"];
  const shouldShowCartFooter = showCartFooterRoutes.includes(pathname);

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  const headerTranslateStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      scrollY.value,
      [0, 100],
      [0, -50],
      Extrapolation.CLAMP
    );
    return { transform: [{ translateY }] };
  });

  const onHeaderLayout = (e: LayoutChangeEvent) => {
    setHeaderHeight(e.nativeEvent.layout.height);
  };

  return (
    <ThemedScreen backgroundColor={backgroundColor}>
      <StatusBar translucent backgroundColor="transparent" />

      {(backgroundImage ||
        gradientWrapper ||
        header ||
        headerLeftIcons.length ||
        headerRightIcons.length) && (
        <Animated.View
          onLayout={onHeaderLayout}
          style={[
            {
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              zIndex: 10,
              backgroundColor: headerBackgroundColor ?? "transparent",
            },
            headerTranslateStyle,
          ]}
        >
          {backgroundImage ? (
            <YStack position="relative" backgroundColor="red">
              <SizableImage
                style={{
                  height: 200,
                  width: "100%",
                }}
                source={backgroundImage}
                resizeMode="cover"
                borderRadius={0}
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
            <YStack paddingHorizontal="$3" paddingTop={insets.top}>
              <XStack alignItems="flex-start">
                <XStack gap="$2" flexShrink={0}>
                  {headerLeftIcons.map((icon, index) => (
                    <YStack key={index}>{icon}</YStack>
                  ))}
                </XStack>

                {!!header && (
                  <YStack flex={1} marginHorizontal="$1">
                    {header}
                  </YStack>
                )}

                <XStack gap="$2" flexShrink={0}>
                  {headerRightIcons.map((icon, index) => (
                    <YStack key={index}>{icon}</YStack>
                  ))}
                </XStack>
              </XStack>
            </YStack>
          )}
        </Animated.View>
      )}

      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        keyboardShouldPersistTaps="handled"
        automaticallyAdjustKeyboardInsets={false}
        contentInsetAdjustmentBehavior="never"
        bounces={true}
        overScrollMode="always"
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: headerHeight,
            paddingBottom: insets.bottom + 24,
            justifyContent: centerContent ? "center" : "flex-start",
          },
        ]}
      >
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
