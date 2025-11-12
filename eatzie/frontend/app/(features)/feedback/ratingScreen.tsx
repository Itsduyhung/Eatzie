import { ScrollScreenLayout } from "@/components/layout/ScrollScreenLayout";
import { ThemedText } from "@/hooks/ThemedTextColor";
import React, { useEffect } from "react";
import { Avatar, Spinner, XStack, YStack } from "tamagui";

import { HeaderSetting } from "@/components/home/HeaderSetting";
import { RatingStars } from "@/components/RatingStars";
import { BackButton } from "@/components/ui/BackButton";
import { SizableImage } from "@/components/ui/SizableImageProps";
import { useFeedbackStore } from "@/stores/feedbackStore";
import { useProfileStore } from "@/stores/profileStore";
import { useLocalSearchParams } from "expo-router";

const Rating = () => {
  const { title, id } = useLocalSearchParams();
  const foodId = Number(id);

  const feedbacks = useFeedbackStore((s) => s.feedbackFood[foodId]);
  const fetchFeedback = useFeedbackStore((s) => s.fetchFeedback);
  const isLoading = useFeedbackStore((s) => s.loadingFood[foodId]);
  const error = useFeedbackStore((s) => s.errorFood[foodId]);

  const fetchProfile = useProfileStore((s) => s.fetchProfile);
  const profileById = useProfileStore((s) => s.profileById);

  useEffect(() => {
    if (foodId && !feedbacks && !isLoading) {
      fetchFeedback(foodId);
    }
  }, [foodId, feedbacks, fetchFeedback]);

  useEffect(() => {
    if (feedbacks) {
      feedbacks.forEach((fb) => {
        if (fb.userId && !profileById[fb.userId]) {
          fetchProfile(fb.userId);
        }
      });
    }
  }, [feedbacks, profileById, fetchProfile]);

  return (
    <ScrollScreenLayout
      header={<HeaderSetting nameTitle={title as string} />}
      headerBackgroundColor="white"
      headerLeftIcons={[<BackButton key="back" />]}
    >
      <YStack gap="$3" marginTop="$2" backgroundColor="white" padding="$3">
        <XStack alignItems="center" justifyContent="center" width="100%">
          <ThemedText
            style={{
              fontSize: 18,
              fontWeight: "600",
              textAlign: "center",
            }}
          >
            Bình luận
          </ThemedText>
        </XStack>

        {isLoading && (
          <YStack alignItems="center" justifyContent="center" padding="$6">
            <Spinner size="large" />
            <ThemedText style={{ marginTop: 8 }}>
              Đang tải feedback...
            </ThemedText>
          </YStack>
        )}

        {!isLoading && error && (
          <YStack alignItems="center" justifyContent="center" padding="$6">
            <ThemedText style={{ color: "red" }}>{error}</ThemedText>
          </YStack>
        )}

        {!isLoading && !error && feedbacks?.length === 0 && (
          <YStack alignItems="center" justifyContent="center" padding="$6">
            <ThemedText>Chưa có đánh giá nào cho món này</ThemedText>
          </YStack>
        )}

        {!isLoading &&
          !error &&
          feedbacks?.map((fb) => {
            const userProfile = profileById[fb.userId];
            const displayName = userProfile?.fullname || "Ẩn danh";
            const avatarUrl =
              userProfile?.avatar || "https://picsum.photos/100";

            return (
              <YStack
                key={fb.id}
                gap="$2"
                padding="$3"
                borderBottomWidth={1}
                borderColor="#eee"
                justifyContent="flex-start"
              >
                <XStack gap="$3" alignItems="flex-start">
                  <Avatar circular size="$3">
                    <Avatar.Image src={avatarUrl} />
                    <Avatar.Fallback bc="#ccc" />
                  </Avatar>

                  <YStack flex={1} gap="$2">
                    <YStack>
                      <ThemedText
                        style={{
                          fontSize: 15,
                          fontWeight: "500",
                        }}
                      >
                        {displayName}
                      </ThemedText>

                      <XStack alignItems="center" gap="$2">
                        <RatingStars value={fb.rating} />
                        <ThemedText
                          style={{
                            fontSize: 14,
                            fontWeight: "600",
                          }}
                        >
                          {fb.rating}
                        </ThemedText>
                      </XStack>
                    </YStack>

                    <ThemedText
                      style={{
                        fontSize: 14,
                        fontWeight: "400",
                        lineHeight: 20,
                      }}
                    >
                      {fb.content ?? ""}
                    </ThemedText>

                    {fb.imageUrl && (
                      <SizableImage
                        source={{ uri: fb.imageUrl }}
                        resizeMode="cover"
                        style={{
                          width: 110,
                          height: 120,
                          borderRadius: 8,
                          marginTop: 6,
                        }}
                      />
                    )}
                  </YStack>
                </XStack>
              </YStack>
            );
          })}
      </YStack>
    </ScrollScreenLayout>
  );
};

export default Rating;
