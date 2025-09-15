import {
  foodCategoryData,
  foodCategoryData1,
} from "@/app/constant/FoodCategoryData";
import { ThemedText } from "@/app/hooks/ThemedTextColor";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Avatar, XStack, YStack } from "tamagui";
import { RatingStars } from "../RatingStars";

type Props = {
  id: string;
};

export const Rating = ({ id }: Props) => {
  const insets = useSafeAreaInsets();
  const category =
    foodCategoryData.find((f) => f.items.some((item) => item.id === id)) ??
    foodCategoryData1.find((f) => f.items.some((item) => item.id === id));
  const item = category?.items.find((item) => item.id === id);
  const feedbacks = item?.feedbacks || [];

  return (
    <YStack gap="$3" marginTop="$2" backgroundColor="white">
      <XStack alignItems="center" justifyContent="space-between" width="100%">
        <ThemedText
          style={{
            fontSize: 18,
            fontWeight: "500",
            textAlign: "center",
          }}
        >
          Bình luận
        </ThemedText>
      </XStack>

      {feedbacks.map((fb, index) => (
        <YStack
          key={index}
          gap="$2"
          padding="$2"
          borderBottomWidth={1}
          borderColor="#eee"
        >
          <XStack gap="$2" alignItems="center">
            <Avatar circular size="$2">
              <Avatar.Image src="http://picsum.photos/200/300" />
              <Avatar.Fallback bc="red" />
            </Avatar>
            <ThemedText
              style={{
                fontSize: 15,
                fontWeight: "500",
              }}
            >
              {fb.userName ?? "Ẩn Danh"}
            </ThemedText>
          </XStack>

          <YStack marginLeft={34} gap="$2">
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

            <ThemedText
              style={{
                fontSize: 14,
                fontWeight: "600",
              }}
            >
              {fb.comment}
            </ThemedText>
          </YStack>
        </YStack>
      ))}
    </YStack>
  );
};
