import { useThemedTextColor } from "@/app/hooks/ThemedTextColor";
import { FoodCategory } from "@/types/foodCategory";
import { BadgeCheck } from "@tamagui/lucide-icons";
import { useRouter } from "expo-router";
import { Pressable } from "react-native";
import { Stack, Text, YStack } from "tamagui";
import { SizableImage } from "../ui/SizableImageProps";

export const FoodInlineList = () => {
  const router = useRouter();
  const { textColor } = useThemedTextColor();

  const renderFood = ({ item }: { item: FoodCategory }) => (
    <Pressable onPress={() => item.path && router.push(item.path as any)}>
      <YStack id={item.id}>
        <SizableImage source={item.image} borderRadius={10} />
        <Stack>
          <BadgeCheck size={18} color="black" />
          <Text fontSize="$4" color={textColor} numberOfLines={2}>
            {item.nameFood}
          </Text>
          <Text fontSize="$3" color={textColor} numberOfLines={2}>
            {item.location}
          </Text>
        </Stack>
      </YStack>
    </Pressable>
  );
  return <YStack></YStack>;
};
