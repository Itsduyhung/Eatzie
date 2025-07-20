import { foodCategoryData } from "@/app/constant/FoodCategoryData";
import { ThemedText } from "@/app/hooks/ThemedTextColor";
import { cartRef } from "@/components/anima/cartRef";
import { useFlyToCart } from "@/components/anima/useFlyToCart";
import { Rating } from "@/components/feedback/Rating";
import { CartFooter } from "@/components/footer/CardFooter";
import { ScrollScreenLayout } from "@/components/layout/ScrollScreenLayout";
import { BackButton } from "@/components/ui/BackButton";
import { CustomButton } from "@/components/ui/CustomButton";
import { useCartStore } from "@/stores/useCartStore";
import { FoodItem } from "@/types/foodCategory";
import { formatCurrency } from "@/utils/formatCurrency";
import { FontAwesome5 } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { useRef } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text, XStack, YStack } from "tamagui";

const DetailsFood = () => {
  const { id } = useLocalSearchParams();

  const addToCart = useCartStore((state) => state.addToCart);
  const { flyToCart } = useFlyToCart();
  const buttonRefs = useRef<Record<string, View | null>>({});
  const insets = useSafeAreaInsets();

  const category = foodCategoryData.find((f) =>
    f.items.some((item) => item.id === id)
  );
  const item = category?.items.find((item) => item.id === id);
  const image = item?.image;

  if (!item || !category) {
    return <Text>Không tìm thấy món ăn</Text>;
  }

  const handleAddToCart = (item: FoodItem) => {
    const ref = buttonRefs.current[item.id];

    ref?.measureInWindow?.((x, y, width, height) => {
      const start = { x: x + width / 2, y: y + height / 2 };

      cartRef.current?.measureInWindow?.((endX, endY, endW, endH) => {
        const end = { x: endX + endW / 2, y: endY + endH / 2 };
        flyToCart(start, end);
      });
    });

    addToCart(item);
  };

  return (
    <ScrollScreenLayout
      backgroundImage={image as any}
      headerLeftIcons={[<BackButton key="back" />]}
      headerRightIcons={[<FontAwesome5 name="share" size={20} key="share" />]}
    >
      <YStack backgroundColor="white" paddingHorizontal="$4">
        <YStack paddingTop={15}>
          <XStack gap="$2" justifyContent="flex-start" alignItems="center">
            <ThemedText
              key={item.id}
              style={{
                fontSize: 20,
                fontWeight: "700",
                textAlign: "center",
              }}
            >
              {item.name}
            </ThemedText>
          </XStack>

          <YStack position="relative" width="100%" gap="$3">
            <XStack marginTop="$3" alignItems="center" gap="$4" width="100%">
              <XStack alignItems="center" gap="$1">
                <ThemedText
                  style={{
                    fontSize: 12,
                    fontWeight: "700",
                    color: "#989898",
                  }}
                >
                  {item.decription}
                </ThemedText>
              </XStack>
            </XStack>

            <XStack alignItems="center" gap="$3" flexWrap="wrap">
              <ThemedText
                style={{
                  fontSize: 13,
                  fontWeight: "700",
                  color: "#989898",
                }}
              >
                {item.salePrice} đã bán
              </ThemedText>

              <YStack width={1} height={12} backgroundColor="#c0c0c0" />

              <ThemedText
                style={{
                  fontSize: 13,
                  fontWeight: "700",
                  color: "#989898",
                }}
              >
                {item.likes} lượt thích
              </ThemedText>
            </XStack>
            <XStack
              width="full"
              alignItems="center"
              marginTop="$2"
              position="relative"
            >
              <ThemedText
                style={{
                  fontSize: 15,
                  fontWeight: "700",
                  color: "#6666FF",
                }}
              >
                {formatCurrency(item.price)}
              </ThemedText>
              <XStack position="absolute" right={0}>
                <CustomButton
                  ref={(ref) => {
                    if (ref) buttonRefs.current[item.id] = ref;
                  }}
                  borderRadius={4}
                  backgroundColor="#6666FF"
                  textfontsize="$4"
                  textfontweight="600"
                  paddingHorizontal={8}
                  paddingVertical={1}
                  paddingBottom={4}
                  onPress={() => handleAddToCart(item)}
                >
                  +
                </CustomButton>
              </XStack>
            </XStack>
          </YStack>
        </YStack>

        {/* Optional: Section for more food items */}
        <Text fontSize="$5" fontWeight="600" marginTop="$4">
          Danh sách món ăn
        </Text>
        <Rating id={item.id} />
      </YStack>

      <CartFooter />
    </ScrollScreenLayout>
  );
};

export default DetailsFood;
