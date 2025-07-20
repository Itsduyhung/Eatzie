// app/(tabs)/test.tsx
import { foodCategoryData } from "@/app/constant/FoodCategoryData";
import { ThemedText } from "@/app/hooks/ThemedTextColor";
import { FoodCardContent } from "@/components/anima/CardFood";
import { FavoriteButton } from "@/components/FavoriteButton";
import FlashListFavoritesFood from "@/components/FlashListFavoritesFood";
import { CartFooter } from "@/components/footer/CardFooter";
import { ScrollScreenLayout } from "@/components/layout/ScrollScreenLayout";
import { RatingStars } from "@/components/RatingStars";
import { BackButton } from "@/components/ui/BackButton";
import { EvilIcons, FontAwesome5 } from "@expo/vector-icons";
import { BadgeCheck } from "@tamagui/lucide-icons";
import { useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text, XStack, YStack } from "tamagui";

const ContentFood = () => {
  const { id } = useLocalSearchParams();
  const item = foodCategoryData.find((f) => f.id === id);
  const image = item?.imageClick;
  const insets = useSafeAreaInsets();

  if (!item) return <Text>Không tìm thấy món ăn</Text>;

  return (
    <ScrollScreenLayout
      backgroundImage={image as any}
      headerLeftIcons={[<BackButton key="back" />]}
      headerRightIcons={[
        <EvilIcons key="search" name="search" size={26} color="black" />,
        <FontAwesome5 name="share" size={20} key="share" />,
      ]}
    >
      <YStack gap="$4">
        <YStack
          paddingHorizontal="$3"
          paddingVertical={15}
          backgroundColor="white"
        >
          <XStack gap="$2" justifyContent="flex-start" alignItems="center">
            <BadgeCheck size={18} color="#4F46E5" />
            <ThemedText
              key={item.id}
              style={{
                fontSize: 20,
                fontWeight: "700",
                textAlign: "center",
              }}
            >
              {item.nameFood}
            </ThemedText>
          </XStack>

          <YStack position="relative" width="100%">
            <XStack marginTop="$3" alignItems="center" gap="$4" width="100%">
              <XStack alignItems="center" gap="$1">
                <RatingStars value={item.rating} />

                <ThemedText
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    textAlign: "center",
                  }}
                >
                  {item.rating}
                </ThemedText>

                <ThemedText
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    textAlign: "center",
                  }}
                >
                  ({item.comment} Bình luận)
                </ThemedText>
              </XStack>
            </XStack>
            <YStack
              position="absolute"
              right={0}
              top="50%"
              transform={[{ translateY: -6 }]}
            >
              <FavoriteButton key="favorite" />,
            </YStack>
          </YStack>
        </YStack>

        <YStack width="100%">
          <FlashListFavoritesFood id={item.id} />
        </YStack>

        <FoodCardContent id={item.id} />
      </YStack>
      <CartFooter />
    </ScrollScreenLayout>
  );
};

export default ContentFood;
