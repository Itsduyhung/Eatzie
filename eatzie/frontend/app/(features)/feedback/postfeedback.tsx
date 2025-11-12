import { SizableImage } from "@/components/ui/SizableImageProps";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { Keyboard } from "react-native";
import { Input, XStack, YStack } from "tamagui";

import { StartRating } from "@/components/feedback/StarRating";
import { CustomButton } from "@/components/ui/CustomButton";
import { ImagePickerSheet } from "@/components/ui/ImagePickerSheet";
import { ThemedText } from "@/hooks/ThemedTextColor";

type Props = {
  item: any;
  form: { rating: number; content: string; image: string | null };
  onRatingChange: (value: number) => void;
  onContentChange: (text: string) => void;
  onPickImage: (fromCamera: boolean) => void;
};

export const FoodFeedbackItem = ({
  item,
  form,
  onRatingChange,
  onContentChange,
  onPickImage,
}: Props) => {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [sheetOpenPending, setSheetOpenPending] = useState(false);

  useEffect(() => {
    if (!isInputFocused && sheetOpenPending) {
      setSheetOpen(true);
      setSheetOpenPending(false);
    }
  }, [isInputFocused, sheetOpenPending]);

  const handleAddImagePress = () => {
    if (isInputFocused) {
      Keyboard.dismiss();
      setSheetOpenPending(true);
      return;
    }

    setSheetOpen(true);
  };

  return (
    <YStack key={item.id} borderRadius={12} gap="$3">
      <YStack backgroundColor="white" gap="$4" paddingVertical="$4">
        <YStack alignItems="center" gap="$3">
          <SizableImage
            source={{ uri: item.image }}
            resizeMode="cover"
            style={{ width: 60, height: 60 }}
            borderRadius={6}
          />
          <ThemedText
            style={{ fontSize: 16, fontWeight: "500", color: "gray" }}
          >
            {item.name}
          </ThemedText>
        </YStack>

        <StartRating
          id={item.id}
          value={form.rating}
          onChange={onRatingChange}
        />
      </YStack>

      <YStack padding="$4" backgroundColor="white">
        <Input
          placeholder="Bạn hãy để đánh giá ở đây nhé..."
          multiline
          placeholderTextColor="#999999"
          minHeight={150}
          borderWidth={0}
          value={form.content || ""}
          onChangeText={onContentChange}
          backgroundColor="white"
          color="black"
          padding={0}
          onFocus={() => setIsInputFocused(true)}
          onBlur={() => setIsInputFocused(false)}
        />

        <XStack alignItems="center" gap="$2" marginTop="$2">
          {form.image && (
            <SizableImage
              source={{ uri: form.image }}
              resizeMode="cover"
              style={{ width: 110 }}
            />
          )}

          <CustomButton
            borderWidth={1}
            borderColor="$gray12"
            onPress={handleAddImagePress}
            paddingVertical="$5"
            paddingHorizontal="$5"
          >
            <YStack justifyContent="center" alignItems="center" gap="$2">
              <Ionicons name="camera-outline" size={35} color="black" />
              <ThemedText fontSize="$4" fontWeight="600" fontFamily="$mono">
                Thêm ảnh
              </ThemedText>
            </YStack>
          </CustomButton>

          <ImagePickerSheet
            open={sheetOpen}
            onOpenChange={setSheetOpen}
            onPickCamera={() => {
              onPickImage(true);
              setSheetOpen(false);
            }}
            onPickLibrary={() => {
              onPickImage(false);
              setSheetOpen(false);
            }}
          />
        </XStack>
      </YStack>
    </YStack>
  );
};
