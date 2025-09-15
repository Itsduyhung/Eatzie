// src/components/home/headerSearch.tsx
import React, { useEffect, useRef, useState } from "react";
import { Keyboard, TouchableOpacity } from "react-native";
import { Text, YStack } from "tamagui";

import { SearchSuggestionList } from "@/components/search/SearchSuggestionList";
import { useSearchStore } from "@/stores/searchStore";
import { CustomInputText } from "../ui/CustomTextInput";

/**
 * SearchScreen (header)
 * - Dùng store (text, suggestions, fetchSuggestions, addHistory, clearSuggestions)
 * - Debounce khi user gõ
 * - Hiện suggestion dưới input khi focus
 */
export function SearchScreen() {
  const {
    text,
    setText,
    suggestions,
    fetchSuggestions,
    clearSuggestions,
    addHistory,
  } = useSearchStore();

  const [focused, setFocused] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounce tìm suggestion
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!text) {
      clearSuggestions();
      return;
    }

    debounceRef.current = setTimeout(() => {
      fetchSuggestions(text);
    }, 250);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [text, fetchSuggestions, clearSuggestions]);

  // suggestions trong store có thể là object (FoodSuggestion) hoặc string.
  const suggestionLabels = (suggestions as any[]).map((s) =>
    typeof s === "string" ? s : s?.name ?? String(s)
  );

  const onSelect = (val: string) => {
    addHistory(val);
    setText(val);
    clearSuggestions();
    setFocused(false);
    Keyboard.dismiss();
    // nếu dùng navigation: chuyển trang kết quả ở đây
    // router.push(`/search/results?query=${encodeURIComponent(val)}`)
  };

  return (
    <YStack>
      <CustomInputText
        marginRight={20}
        value={text}
        onChangeText={setText}
        onFocus={() => setFocused(true)}
        onBlur={() => setTimeout(() => setFocused(false), 120)}
        focused={focused}
        placeholder="Tìm kiếm..."
        suffixIcon={
          text ? (
            <TouchableOpacity
              onPress={() => {
                setText("");
                clearSuggestions();
              }}
            >
              <Text>✖</Text>
            </TouchableOpacity>
          ) : undefined
        }
      />

      {focused && suggestionLabels.length > 0 && (
        <YStack
          marginTop="$2"
          borderRadius={8}
          overflow="hidden"
          backgroundColor="white"
          // tamagui props; nếu không dùng tamagui theme, thay bằng style thông thường
        >
          <SearchSuggestionList
            suggestions={suggestionLabels}
            onSelect={onSelect}
          />
        </YStack>
      )}
    </YStack>
  );
}
