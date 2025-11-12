import { HeaderSetting } from "@/components/home/HeaderSetting";
import { ScrollScreenLayout } from "@/components/layout/ScrollScreenLayout";
import { useFoodStore } from "@/stores/FoodStore";
import { useFeedbackStore } from "@/stores/feedbackStore";
import { useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect } from "react";
import { Spinner, Text, YStack } from "tamagui";

import { pickImageAndUpload } from "@/app/untils/pickImageAndUpload";
import { CustomButton } from "@/components/ui/CustomButton";
import { ThemedText } from "@/hooks/ThemedTextColor";
import { FoodFeedbackItem } from "./postfeedback";

const FeedbackScreenCombined = () => {
  const { id, orderId } = useLocalSearchParams();
  const foodId = Number(id);
  const orderID = Number(orderId);
  const key = `${orderID}-${foodId}`;

  const item = useFoodStore((s) => s.foods[foodId]);
  const fetchFood = useFoodStore((s) => s.fetchFood);
  const isLoading = useFoodStore((s) => s.loading[foodId]);
  const error = useFoodStore((s) => s.error[foodId]);

  const feedbackForm = useFeedbackStore((s) => s.initialFeedback[key]);
  const setInitialFeedback = useFeedbackStore((s) => s.setInitialFeedback);
  const submitFeedback = useFeedbackStore((s) => s.submitFeedback);
  const submitting = useFeedbackStore((s) => s.submitting[key]);

  useEffect(() => {
    if (!feedbackForm) {
      setInitialFeedback(orderID, foodId, {
        content: "",
        rating: 0,
        image: null,
      });
    }
  }, [feedbackForm, setInitialFeedback, orderID, foodId]);

  useEffect(() => {
    if (foodId && !item && !isLoading) {
      fetchFood(foodId);
    }
  }, [foodId, item, isLoading, fetchFood]);

  const handleRatingChange = useCallback(
    (value: number) => setInitialFeedback(orderID, foodId, { rating: value }),
    [setInitialFeedback, orderID, foodId]
  );

  const handleContentChange = useCallback(
    (text: string) => setInitialFeedback(orderID, foodId, { content: text }),
    [setInitialFeedback, orderID, foodId]
  );

  const handlePickImage = useCallback(
    async (fromCamera: boolean) => {
      const uri = await pickImageAndUpload(fromCamera);
      if (uri) setInitialFeedback(orderID, foodId, { image: uri });
    },
    [setInitialFeedback, orderID, foodId]
  );

  if (isLoading) return <Text>Đang tải...</Text>;
  if (error) return <Text>{error}</Text>;
  if (!item) return <Text>Không tìm thấy món ăn</Text>;
  if (!feedbackForm) return null;

  return (
    <ScrollScreenLayout
      header={<HeaderSetting nameTitle="Đánh giá quán và món" />}
      headerBackgroundColor="white"
    >
      <YStack backgroundColor="#F5F5F5" gap="$5">
        <FoodFeedbackItem
          item={item}
          form={feedbackForm}
          onRatingChange={handleRatingChange}
          onContentChange={handleContentChange}
          onPickImage={handlePickImage}
        />

        <CustomButton
          onPress={() => submitFeedback(orderID, foodId)}
          disabled={!!submitting}
          backgroundColor="#6666FF"
          borderRadius="$2"
          paddingVertical="$3"
          mt="$2"
          marginHorizontal="$4"
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
    </ScrollScreenLayout>
  );
};

export default FeedbackScreenCombined;
