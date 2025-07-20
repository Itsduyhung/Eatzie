import { useThemedTextColor } from "@/app/hooks/ThemedTextColor";
import { FoodCategory } from "@/types/foodCategory";
import { BadgeCheck, Eye, Star } from "@tamagui/lucide-icons";
import { useRouter } from "expo-router";
import { Pressable } from "react-native";
import { Text, XStack, YStack } from "tamagui";
import { CustomButton } from "../ui/CustomButton";
import { SizableImage } from "../ui/SizableImageProps";

type Props = {
  item: FoodCategory;
};

export const FoodCard = ({ item }: Props) => {
  const router = useRouter();
  const { textColor } = useThemedTextColor();

  return (
    <Pressable
      key={item.id}
      onPress={() =>
        // item.path &&
        // router.push(item.path as any) &&
        router.push({
          pathname: "/(features)/food/contentfood",
          params: {
            id: item.id,
          },
        })
      }
    >
      <YStack
        borderRadius={8}
        overflow="hidden"
        elevation="$2"
        padding="$2"
        marginVertical="$2"
        maxWidth={270}
        backgroundColor="#F5F5F5"
      >
        <YStack borderRadius={8} overflow="hidden" aspectRatio={3 / 2}>
          <SizableImage
            source={item.image}
            resizeMode="cover"
            borderRadius={2}
          />
        </YStack>

        <YStack paddingTop="$2" paddingHorizontal="$1.5" gap="$1">
          <XStack alignItems="center" gap="$1">
            <Text fontSize="$3" fontWeight="600" color={textColor}>
              {item.nameFood}
            </Text>
            <BadgeCheck size={16} color="#4F46E5" />
          </XStack>

          <Text fontSize="$2" color="$gray10" numberOfLines={2} marginTop={5}>
            {item.location}
          </Text>

          <XStack alignItems="center" marginTop="$2" gap="$5">
            <XStack alignItems="center" gap="$4">
              <YStack alignItems="center">
                <XStack alignItems="center" gap="$1">
                  <Star size={14} color="#6366F1" />
                  <Text fontSize="$2" color={textColor}>
                    {item.rating}
                  </Text>
                </XStack>
                <Text fontSize="$1" color="$gray10">
                  Rating
                </Text>
              </YStack>

              <YStack height="100%" width={1} bg="$gray6" />

              <YStack alignItems="center">
                <XStack alignItems="center" gap="$1">
                  <Eye size={14} color="#6366F1" />
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
            >
              Xem thêm
            </CustomButton>
          </XStack>
        </YStack>
      </YStack>
    </Pressable>
  );
};
