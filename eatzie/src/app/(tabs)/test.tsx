import React, { useEffect, useState, useCallback } from "react";
import { ScrollScreenLayout } from "@/components/layout/ScrollScreenLayout";
import { HeaderSetting } from "@/components/home/HeaderSetting";
import { SizableImage } from "@/components/ui/SizableImageProps";
import { ThemedText } from "@/app/hooks/ThemedTextColor";
import { YStack, XStack, Input, Spinner } from "tamagui";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { useFoodStore } from "@/stores/FoodStore";
import { useFeedbackStore } from "@/stores/feedbackStore";
import { StartRating } from "@/components/feedback/StarRating";
import { CustomButton } from "@/components/ui/CustomButton";
import { ImagePickerSheet } from "@/components/ui/ImagePickerSheet";
import { pickImageAndUpload } from "../untils/pickImageAndUpload";

const FoodFeedbackItem = ({
  item,
  rating,
  content,
  image,
  onRatingChange,
  onContentChange,
  onPickImage,
}: {
  item: any;
  rating: number;
  content: string;
  image: string | null;
  onRatingChange: (value: number) => void;
  onContentChange: (text: string) => void;
  onPickImage: (fromCamera: boolean) => void;
}) => {
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <YStack key={item.id} borderRadius={12} gap="$3">
      <XStack alignItems="center" gap="$3">
        <SizableImage
          source={{ uri: item.image }}
          resizeMode="cover"
          borderRadius={8}
          width={60}
          height={60}
        />
        <ThemedText style={{ fontSize: 16, fontWeight: "500" }}>
          {item.name}
        </ThemedText>
      </XStack>

      <StartRating id={item.id} value={rating} onChange={onRatingChange} />

      <YStack padding="$4" backgroundColor="white">
        <Input
          placeholder="Bạn hãy để đánh giá ở đây nhé..."
          multiline
          placeholderTextColor="#999999"
          minHeight={150}
          borderWidth={0}
          paddingVertical={0}
          paddingHorizontal={0}
          value={content}
          onChangeText={onContentChange}
          backgroundColor="white"
        />

        <XStack alignItems="center" gap="$2">
          {image && (
            <SizableImage
              source={{ uri: image }}
              resizeMode="cover"
              width={120}
            />
          )}

          <CustomButton
            borderWidth={1}
            borderColor={"$gray12"}
            onPress={() => setSheetOpen(true)}
            paddingVertical="$5"
            paddingHorizontal="$5"
          >
            <YStack justifyContent="center" alignItems="center" gap="$3">
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

// --- FeedbackScreenCombined ---
const FeedbackScreenCombined = () => {
  const { id } = useLocalSearchParams();
  const foodId = Number(id);

  const item = useFoodStore((s) => s.foods[foodId]);
  const fetchFood = useFoodStore((s) => s.fetchFood);
  const isLoading = useFoodStore((s) => s.loading[foodId]);
  const error = useFoodStore((s) => s.error[foodId]);

  const rating = useFeedbackStore((s) => s.feedbackForm.rating);
  const content = useFeedbackStore((s) => s.feedbackForm.content);
  const image = useFeedbackStore((s) => s.feedbackForm.image);
  const submitting = useFeedbackStore((s) => s.submitting);

  const setFeedbackForm = useFeedbackStore((s) => s.setFeedbackForm);
  const submitFeedback = useFeedbackStore((s) => s.submitFeedback);

  useEffect(() => {
    if (foodId && !item && !isLoading) {
      fetchFood(foodId);
    }
  }, [foodId, item, isLoading, fetchFood]);

  const handleRatingChange = useCallback(
    (value: number) => {
      setFeedbackForm({ rating: value, foodId });
    },
    [setFeedbackForm, foodId]
  );

  const handleContentChange = useCallback(
    (text: string) => {
      setFeedbackForm({ content: text, foodId });
    },
    [setFeedbackForm, foodId]
  );

  const handlePickImage = useCallback(
    async (fromCamera: boolean) => {
      const uri = await pickImageAndUpload(fromCamera);
      if (uri) setFeedbackForm({ image: uri, foodId });
    },
    [setFeedbackForm, foodId]
  );

  //   if (isLoading) return <Text>Đang tải...</Text>;
  //   if (error) return <Text>{error}</Text>;
  //   if (!item) return <Text>Không tìm thấy món ăn</Text>;

  return (
    <ScrollScreenLayout
      header={<HeaderSetting nameTitle="Đánh giá quán và món" />}
      headerBackgroundColor="white"
    >
      <YStack backgroundColor="#F5F5F5" gap="$5">
        <FoodFeedbackItem
          item={item}
          rating={rating}
          content={content}
          image={image ?? null}
          onRatingChange={handleRatingChange}
          onContentChange={handleContentChange}
          onPickImage={handlePickImage}
        />

        <YStack padding="$3">
          <CustomButton
            onPress={() => submitFeedback(foodId)}
            disabled={submitting}
            backgroundColor="#6666FF"
            borderRadius="$2"
            paddingVertical="$3"
            mt="$2"
          >
            {submitting ? (
              <Spinner color="$white" />
            ) : (
              <ThemedText
                fontSize="$4"
                color="white"
                fontWeight="600"
                fontFamily="$mono"
              >
                Gửi Feedback
              </ThemedText>
            )}
          </CustomButton>
        </YStack>
      </YStack>
    </ScrollScreenLayout>
  );
};

export default FeedbackScreenCombined;
