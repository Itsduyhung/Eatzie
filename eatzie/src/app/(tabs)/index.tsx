import React from "react";
import { YStack } from "tamagui";

import { BannerCarousel } from "@/components/anima/BannerRender";
import HeaderLand from "@/components/home/headerLand";
import RecentFoodScreen from "@/components/hotFood/cartRecent";
import { ScrollScreenLayout } from "@/components/layout/ScrollScreenLayout";
import HotFoodScreen from "../(features)/food/hotFood";
import RecommentdedFoodScreen from "../(features)/food/recommendedfood";
import { HeaderGradientBackground } from "../untils/GradientBackground";

const HomeTab = () => {
  return (
    <ScrollScreenLayout
      header={<HeaderLand />}
      gradientWrapper={(children) => (
        <HeaderGradientBackground>{children}</HeaderGradientBackground>
      )}
    >
      <YStack backgroundColor="#F5F5F5">
        <BannerCarousel />
      </YStack>

      <YStack width="100%" paddingHorizontal="$2" marginTop="$3">
        <RecommentdedFoodScreen />
      </YStack>

      <YStack width="100%" paddingHorizontal="$2" marginTop="$3">
        <HotFoodScreen />
      </YStack>

      <YStack width="100%" marginTop="$3" paddingHorizontal="$2">
        <RecentFoodScreen title="Khám phá" />
      </YStack>
    </ScrollScreenLayout>
  );
};

export default HomeTab;
