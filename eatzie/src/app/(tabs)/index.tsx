// app/(tabs)/home.tsx
import React from "react";
import { YStack } from "tamagui";

import { HeaderGradientBackground } from "@/app/untils/GradientBackground";
import { BannerCarousel } from "@/components/anima/BannerRender";
import { FlashCardRender } from "@/components/anima/FlashCardRender";
import { IconInlineList } from "@/components/anima/LoadingAnimation";
import HeaderHome from "@/components/home/header.home";
import { ScrollScreenLayout } from "@/components/layout/ScrollScreenLayout";

const HomeTab = () => {
  return (
    <ScrollScreenLayout
      header={<HeaderHome />}
      gradientWrapper={(children) => (
        <HeaderGradientBackground>{children}</HeaderGradientBackground>
      )}
    >
      <YStack backgroundColor="#F5F5F5">
        <BannerCarousel />
      </YStack>

      <YStack width="100%" paddingHorizontal="$2" marginTop="$3">
        <FlashCardRender />
      </YStack>

      <YStack width="100%" paddingHorizontal="$2" marginTop="$3">
        <IconInlineList />
      </YStack>
    </ScrollScreenLayout>
  );
};

export default HomeTab;
