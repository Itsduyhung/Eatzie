import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { YStack } from "tamagui";

import { toTiltleCase } from "@/app/untils/string";
import { SearchScreen } from "@/components/home/headerSearch";
import { ScrollScreenLayout } from "@/components/layout/ScrollScreenLayout";
import { SearchBody } from "@/components/search/SearchBody";
import { SearchSuggestionList } from "@/components/search/SearchSuggestionList";
import { BackButton } from "@/components/ui/BackButton";
import { useSearchStore } from "@/stores/searchStore";

export default function SearchCategories() {
  const { setTrending, addHistory, setText, suggestions, text } =
    useSearchStore();
  const [showSuggestions, setShowSuggestions] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setTrending(["CoCo", "iPhone 17", "卡", "SU7", "1e1e"]);
  }, [setTrending]);

  const suggestionLabels = (suggestions as any[]).map((s) =>
    typeof s === "string" ? s : s?.name ?? String(s)
  );

  useEffect(() => {
    setShowSuggestions(!!text && suggestionLabels.length > 0);
  }, [text, suggestionLabels]);

  const handleSelect = (val: string, submitted = false) => {
    if (submitted) {
      const formatted = toTiltleCase(val);
      addHistory(formatted);
      console.log("🔍 Text đã chuẩn hóa để gửi API / history:", formatted);

      router.push({
        pathname: "/search/foodsearchresult",
        params: { query: formatted },
      });
    } else {
      addHistory(val);
    }
    setShowSuggestions(false);
  };

  return (
    <ScrollScreenLayout
      headerLeftIcons={[<BackButton key="back" />]}
      headerBackgroundColor="#F4F3F8"
      header={
        <SearchScreen
          onTextChange={(val, submitted) => {
            if (!val) setShowSuggestions(false);
            if (submitted && val) handleSelect(val, true);
          }}
          onFocus={() => {
            if (text && suggestionLabels.length > 0) {
              setShowSuggestions(true);
            }
          }}
          onBlur={() => {
            setShowSuggestions(false);
          }}
        />
      }
    >
      {!showSuggestions && <SearchBody onSelect={(val) => handleSelect(val)} />}

      {showSuggestions && suggestionLabels.length > 0 && (
        <YStack
          position="absolute"
          top={80}
          left={0}
          right={0}
          bottom={0}
          zIndex={100}
          backgroundColor="white"
        >
          <SearchSuggestionList
            suggestions={suggestionLabels}
            onSelect={(val) => handleSelect(val, true)}
          />
        </YStack>
      )}
    </ScrollScreenLayout>
  );
}
