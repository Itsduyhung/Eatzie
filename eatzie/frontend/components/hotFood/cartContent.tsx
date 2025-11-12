import { useThemedTextColor } from "@/hooks/ThemedTextColor";
import { FoodItemD } from "@/types/foodCategory";
import { BadgeCheck, Eye, Star } from "@tamagui/lucide-icons";
import { useRouter } from "expo-router";

import { SizableImageProps } from "@/types/SizableImageProps";
import { Pressable } from "react-native";
import { Text, XStack, YStack, YStackProps } from "tamagui";
import { CustomButton } from "../ui/CustomButton";
import { SizableImage } from "../ui/SizableImageProps";

type Props = {
  item: FoodItemD;
  containerProps?: YStackProps;
  imageProps?: SizableImageProps;
  hasRatingOrView?: boolean;
  hasDetailFoodCard?: boolean;
  highlightBorder?: boolean;
};

export const FoodCard = ({
  item,
  containerProps,
  imageProps,
  hasRatingOrView = false,
  hasDetailFoodCard = false,
  highlightBorder = false,
}: Props) => {
  const router = useRouter();
  const { textColor } = useThemedTextColor();

  const rawMaxHeight = containerProps?.maxHeight;
  const rawMaxWidth = containerProps?.maxWidth;

  let cardWidth: number;
  let cardHeight: number;
  const ratio = 1.1;

  if (typeof rawMaxHeight === "number") {
    cardHeight = rawMaxHeight;
    cardWidth = Math.round(cardHeight / ratio);
  } else if (typeof rawMaxWidth === "number") {
    cardWidth = rawMaxWidth;
    cardHeight = Math.round(cardWidth * (1 / ratio));
  } else {
    cardWidth = 200;
    cardHeight = Math.round(cardWidth * (1 / ratio));
  }

  return (
    <Pressable
      key={item.id}
      onPress={() =>
        router.push({
          pathname: "/(features)/food/detailsfood",
          params: { id: item.id },
        })
      }
    >
      <YStack width={cardWidth} borderRadius={8} overflow="hidden">
        <YStack
          width={cardWidth}
          height={cardHeight}
          borderRadius={8}
          overflow="hidden"
          elevation="$2"
          marginVertical="$2"
          {...containerProps}
        >
          <SizableImage
            source={{ uri: item.image as any }}
            resizeMode="cover"
            style={{ width: cardWidth, height: cardHeight }}
            {...imageProps}
          />
        </YStack>

        <YStack
          gap={8}
          alignItems="flex-start"
          width={cardWidth}
          borderWidth={highlightBorder ? 1 : 0}
          borderTopWidth={0}
          borderColor={highlightBorder ? "#F5F5F5" : "transparent"}
          borderBottomLeftRadius={highlightBorder ? 8 : 0}
          borderBottomRightRadius={highlightBorder ? 8 : 0}
          paddingBottom="$3"
          paddingHorizontal={highlightBorder ? 2 : 0}
        >
          <YStack gap="$1">
            <XStack alignItems="center" gap="$1">
              <BadgeCheck size={16} color="#4F46E5" />
              <Text fontSize="$3" fontWeight="600" color={textColor}>
                {item.name}
              </Text>
            </XStack>
            {hasDetailFoodCard && (
              <XStack alignItems="center" gap="$1">
                <Text fontSize="$3" fontWeight="600" color={textColor}>
                  {item.restaurantName ?? "Duy Hùng Res"}
                </Text>
              </XStack>
            )}
          </YStack>

          {hasRatingOrView && (
            <YStack marginTop={6} width={cardWidth}>
              <XStack gap={2} justifyContent="space-between">
                <XStack alignItems="center" gap="$1">
                  <Star size={12} color="#4F46E5" />
                  <Text fontSize="$1" fontWeight="600" color={textColor}>
                    {(item.rating ?? 0).toFixed(1)}
                  </Text>
                </XStack>

                <XStack alignItems="center" gap="$1">
                  <Eye size={12} color="#4F46E5" />
                  <Text fontSize="$1" fontWeight="600" color={textColor}>
                    {item.views ?? 0}
                  </Text>
                </XStack>
              </XStack>
            </YStack>
          )}

          {hasDetailFoodCard && (
            <YStack width={cardWidth}>
              <XStack justifyContent="space-between" marginTop="$2">
                <XStack alignItems="center" gap="$3">
                  <YStack alignItems="center">
                    <XStack alignItems="center" gap="$2">
                      <Star size={14} color="#6666FF" />
                      <Text fontSize="$2" color={textColor}>
                        {item.rating}
                      </Text>
                    </XStack>
                    <Text fontSize="$1" color="$gray10">
                      Rating
                    </Text>
                  </YStack>

                  <YStack
                    width={1}
                    backgroundColor="black"
                    alignSelf="stretch"
                  />

                  <YStack alignItems="center">
                    <XStack alignItems="center" gap="$2">
                      <Eye size={14} color="#6666FF" />
                      <Text fontSize="$2" color={textColor}>
                        {item.views.toLocaleString()}k
                      </Text>
                    </XStack>
                    <Text fontSize="$1" color="$gray10">
                      Views
                    </Text>
                  </YStack>
                </XStack>

                <CustomButton
                  backgroundColor="#6666FF"
                  paddingHorizontal="$3"
                  paddingVertical="$2"
                  borderRadius="$8"
                  textfontsize="$4"
                  textfontweight="$4"
                  marginRight={10}
                >
                  Xem thêm
                </CustomButton>
              </XStack>
            </YStack>
          )}
        </YStack>
      </YStack>
    </Pressable>
  );
};
