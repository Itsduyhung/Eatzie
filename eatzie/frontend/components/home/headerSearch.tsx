import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import { TouchableOpacity } from "react-native";
import { YStack } from "tamagui";

import { toTiltleCase } from "@/app/untils/string";
import { useSearchStore } from "@/stores/searchStore";
import { CustomInputText } from "../ui/CustomTextInput";

type SearchScreenProps = {
  onTextChange?: (val: string, submitted?: boolean) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  readonly?: boolean;
};

export function SearchScreen({
  onTextChange,
  onFocus,
  onBlur,
  readonly,
}: SearchScreenProps) {
  const { text, setText, fetchSuggestions, clearSuggestions } =
    useSearchStore();
  const [focused, setFocused] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (readonly) return;

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
  }, [text, fetchSuggestions, clearSuggestions, readonly]);

  return (
    <YStack>
      <CustomInputText
        marginRight={20}
        value={text}
        editable={!readonly}
        onChangeText={(val) => {
          if (!readonly) {
            setText(val);
            onTextChange?.(val);
          }
        }}
        onFocus={() => {
          if (!readonly) {
            setFocused(true);
            onFocus?.();
          }
        }}
        onBlur={() => {
          if (!readonly) {
            setFocused(false);
            onBlur?.();
          }
        }}
        focused={focused}
        placeholder="Tìm kiếm..."
        onSubmitEditing={() => {
          if (!readonly) {
            const formatted = toTiltleCase(text);
            onTextChange?.(formatted, true);
            console.log("🔍 Text đã chuẩn hóa:", formatted);
          }
        }}
        suffixIcon={
          !readonly && text ? (
            <TouchableOpacity
              onPress={() => {
                setText("");
                clearSuggestions();
                onTextChange?.("");
              }}
            >
              <Ionicons name="close-circle" size={16} color="gray" />
            </TouchableOpacity>
          ) : undefined
        }
      />
    </YStack>
  );
}
