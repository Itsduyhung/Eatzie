import { ThemedText } from "@/app/hooks/ThemedTextColor";
import { cartRef } from "@/components/anima/cartRef";
import { useFlyToCart } from "@/components/anima/useFlyToCart";
import { CartFooter } from "@/components/footer/CardFooter";
import { ScrollScreenLayout } from "@/components/layout/ScrollScreenLayout";
import { BackButton } from "@/components/ui/BackButton";
import { CustomButton } from "@/components/ui/CustomButton";
import { StatItem } from "@/components/ui/StatItem";
import { useFoodStore } from "@/stores/FoodStore";
import { useCartStore } from "@/stores/useCartStore";
import { formatCurrency } from "@/utils/formatCurrency";
import { Feather, FontAwesome5 } from "@expo/vector-icons";
import { Eye, Star } from "@tamagui/lucide-icons";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useRef } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text, XStack, YStack } from "tamagui";

const FoodText = ({
  children,
  size,
  weight,
  color,
}: {
  children: React.ReactNode;
  size: number;
  weight: "400" | "700";
  color?: string;
}) => (
  <ThemedText style={{ fontSize: size, fontWeight: weight, color }}>
    {children}
  </ThemedText>
);

const DetailsFood = () => {
  const { id } = useLocalSearchParams();
  const foodId = Number(id);
  const { foods, loading, error, fetchFood } = useFoodStore();
  const item = foods[foodId];

  const addToCart = useCartStore((state) => state.addToCart);
  const { flyToCart } = useFlyToCart();
  const buttonRefs = useRef<Record<number, View | null>>({});
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (foodId) fetchFood(foodId);
  }, [foodId, fetchFood]);

  if (loading[foodId]) return <Text>Đang tải...</Text>;
  if (error[foodId]) return <Text>{error[foodId]}</Text>;
  if (!item) return <Text>Không tìm thấy món ăn</Text>;

  const handleAddToCart = (item: (typeof foods)[number]) => {
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
      backgroundImage={{ uri: item.image as any }}
      headerLeftIcons={[<BackButton key="back" />]}
      headerRightIcons={[<FontAwesome5 name="share" size={20} key="share" />]}
    >
      <YStack backgroundColor="white" paddingHorizontal="$4">
        <YStack paddingTop={15} gap="$3">
          <FoodText size={22} weight="700">
            {item.name}
          </FoodText>

          <FoodText size={20} weight="700" color="#6666FF">
            {formatCurrency(item.price)}
          </FoodText>

          <FoodText size={14} weight="400" color="gray">
            {item.description}
          </FoodText>
          <YStack justifyContent="center" alignItems="center" gap="$2">
            <XStack marginTop="$2" alignItems="center" gap="$4">
              <StatItem
                icon={<Star size={16} color="#6666FF" />}
                value={item.rating}
                label="Rating"
              />

              <YStack width={1} backgroundColor="black" alignSelf="stretch" />

              <StatItem
                icon={<Eye size={16} color="#6666FF" />}
                value={`${item.views.toLocaleString()}k`}
                label="Views"
              />
            </XStack>

            <CustomButton>
              <XStack alignItems="center" width="100%" gap="$2">
                <FoodText size={15} weight="400">
                  Xem đánh giá
                </FoodText>
                <Feather name="arrow-right" size={16} color="black" />
              </XStack>
            </CustomButton>
          </YStack>
          <CustomButton
            ref={(ref) => {
              if (ref) buttonRefs.current[item.id] = ref;
            }}
            borderRadius={20}
            backgroundColor="#6666FF"
            textfontsize="$4"
            textfontweight="600"
            onPress={() => handleAddToCart(item)}
          >
            Thêm vào giỏ hàng
          </CustomButton>
        </YStack>
      </YStack>

      <CartFooter />
    </ScrollScreenLayout>
  );
};

export default DetailsFood;
