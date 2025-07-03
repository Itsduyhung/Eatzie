import React, { useRef } from "react";
import { Animated, Dimensions, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { HeaderGradientBackground } from "@/app/untils/GradientBackground";

import { BannerCarousel } from "@/components/anima/BannerRender";
import { IconInlineList } from "@/components/anima/LoadingAnimation";
import HeaderHome from "@/components/home/header.home";
import { ThemedScreen } from "@/components/layout/ThemedScreen";
import { YStack } from "tamagui";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const HomeTab = () => {
  const scrollY = useRef(new Animated.Value(0)).current;
  const insets = useSafeAreaInsets();

  return (
    <ThemedScreen backgroundColor="#F5F5F5" padding="$0">
      <Animated.ScrollView
        style={styles.scrollView}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        contentContainerStyle={{}}
      >
        <HeaderGradientBackground>
          <HeaderHome />
        </HeaderGradientBackground>

        <YStack backgroundColor="#F5F5F5">
          <BannerCarousel />
        </YStack>

        <ThemedScreen backgroundColor="#F5F5F5">
          <YStack width="100%" paddingHorizontal="$2" marginTop="$3">
            <YStack width="100%" backgroundColor="#FFFFFF" borderRadius={14}>
              <IconInlineList />
            </YStack>
          </YStack>
        </ThemedScreen>
      </Animated.ScrollView>
    </ThemedScreen>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  section: {
    height: SCREEN_HEIGHT * 0.3,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#eee",
    marginBottom: 2,
    borderRadius: 8,
    marginHorizontal: 4,
  },
});

export default HomeTab;
