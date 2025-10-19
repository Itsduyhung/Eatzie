import React from "react";

import { ScrollScreenLayout } from "@/components/layout/ScrollScreenLayout";
import { HeaderSetting } from "@/components/home/HeaderSetting";
import { useLocalSearchParams } from "expo-router";

const SavedFoodScreen = () => {
  const { title } = useLocalSearchParams();
  return (
    <ScrollScreenLayout
      header={
        <HeaderSetting
          nameTitle={(title as string) || "Món ăn đã lưu gần đây"}
        />
      }
    ></ScrollScreenLayout>
  );
};

export default SavedFoodScreen;
