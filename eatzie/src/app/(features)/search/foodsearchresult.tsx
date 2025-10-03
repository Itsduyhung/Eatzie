import { useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { YStack } from "tamagui";

import { SearchScreen } from "@/components/home/headerSearch";
import { ScrollScreenLayout } from "@/components/layout/ScrollScreenLayout";
import RenderFoodSearch from "@/components/search/renderFoodSearch";
import { BackButton } from "@/components/ui/BackButton";
import { useSearchStore } from "@/stores/searchStore";

export default function ResultScreen() {
  const { query } = useLocalSearchParams<{ query?: string }>();
  const { text, setText, setTrending } = useSearchStore();

  useEffect(() => {
    setTrending(["CoCo", "iPhone 17", "卡", "SU7", "1e1e"]);
  }, [setTrending]);

  useEffect(() => {
    if (query && query !== text) {
      setText(query);
    }
  }, [query, text]);

  return (
    <ScrollScreenLayout
      headerLeftIcons={[<BackButton key="back" />]}
      headerBackgroundColor="#F4F3F8"
      header={<SearchScreen readonly />}
    >
      <YStack>
        <RenderFoodSearch initialQuery={text ?? ""} />
      </YStack>
    </ScrollScreenLayout>
  );
}
