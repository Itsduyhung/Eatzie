// app/(tabs)/home.tsx
import React from "react";
import { ScrollView } from "react-native";
import { YStack } from "tamagui";

import { BannerCarousel } from "@/components/anima/BannerRender";
import { FlashCardRender } from "@/components/anima/FlashCardRender";
import { IconInlineList } from "@/components/anima/LoadingAnimation";
import HeaderHome from "@/components/home/header.home";
import { ScrollScreenLayout } from "@/components/layout/ScrollScreenLayout";

const HomeTab = () => {
  return (
    <ScrollScreenLayout header={<HeaderHome />}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        <YStack backgroundColor="#F5F5F5" marginTop={16}>
          <BannerCarousel />
        </YStack>

        <YStack width="100%" paddingHorizontal="$2" marginTop="$3">
          <FlashCardRender />
        </YStack>

        <YStack width="100%" paddingHorizontal="$2" marginTop="$3">
          <IconInlineList />
        </YStack>
      </ScrollView>
    </ScrollScreenLayout>
  );
};

export default HomeTab;
