import { ThemedText } from "@/hooks/ThemedTextColor";
import { useFoodStore } from "@/stores/FoodStore";
import { useCartStore } from "@/stores/useCartStore";
import { FoodItemD } from "@/types/foodCategory";
import { formatCurrency } from "@/utils/formatCurrency";
import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import { Pressable, View } from "react-native";
import { XStack, YStack } from "tamagui";
import { CustomButton } from "../ui/CustomButton";
import { SizableImage } from "../ui/SizableImageProps";
import { cartRef } from "./cartRef";
import { useFlyToCart } from "./useFlyToCart";

type Props = {
  id: number;
};

export const FoodCardItem = ({ id }: Props) => {
  const router = useRouter();

  const food = useFoodStore((s) => s.foods[id]);
  const fetchFood = useFoodStore((s) => s.fetchFood);

  useEffect(() => {
    if (!food) {
      fetchFood(id).catch(() => {});
    }
  }, [id, food, fetchFood]);

  const cartItem = useCartStore((s) => s.cart.find((i) => i.id === id));
  const quantity = cartItem?.quantity ?? 0;

  const addToCart = useCartStore((s) => s.addToCart);
  const increaseQuantity = useCartStore((s) => s.increaseQuantity);
  const decreaseQuantity = useCartStore((s) => s.decreaseQuantity);

  const { flyToCart } = useFlyToCart();
  const buttonRefs = useRef<Record<number, View | null>>({});

  const item: FoodItemD | undefined = food;

  if (!item) {
    return (
      <YStack padding="$3">
        <ThemedText>Đang tải món ăn...</ThemedText>
      </YStack>
    );
  }

  const handleAddToCart = () => {
    const ref = buttonRefs.current[id];

    ref?.measureInWindow?.((x, y, width, height) => {
      const start = { x: x + width / 2, y: y + height / 2 };

      cartRef.current?.measureInWindow?.((endX, endY, endW, endH) => {
        const end = { x: endX + endW / 2, y: endY + endH / 2 };
        flyToCart(start, end);
      });
    });

    if (quantity === 0) {
      addToCart(item);
    } else {
      increaseQuantity(item.id);
    }
  };

  const handleDecrease = () => {
    if (quantity > 0) {
      decreaseQuantity(item.id);
    }
  };

  return (
    <Pressable
      onPress={() =>
        router.push({
          pathname: "/(features)/food/detailsfood",
          params: { id: item.id },
        })
      }
    >
      <YStack
        borderRadius={10}
        overflow="hidden"
        elevation="$2"
        backgroundColor="white"
        paddingBottom="$1.5"
      >
        <XStack alignItems="center" overflow="hidden">
          <SizableImage
            source={{ uri: item.image as any }}
            resizeMode="cover"
            borderRadius={10}
            style={{ width: 80, height: 80 }}
          />

          <YStack
            paddingTop="$1"
            paddingHorizontal="$2"
            marginLeft="$4"
            gap="$2"
            flex={1}
          >
            <XStack>
              <ThemedText
                style={{
                  fontSize: 15,
                  fontWeight: "700",
                }}
              >
                {item.name}
              </ThemedText>
            </XStack>

            <XStack gap={9} alignItems="center" justifyContent="space-between">
              <ThemedText
                style={{
                  fontSize: 15,
                  fontWeight: "700",
                  color: "#6666FF",
                }}
              >
                {formatCurrency(item.price)}
              </ThemedText>

              <XStack gap="$3" alignItems="center">
                {quantity >= 1 && (
                  <>
                    <CustomButton
                      borderRadius={4}
                      backgroundColor="#6666FF"
                      textfontsize="$4"
                      textfontweight="600"
                      paddingHorizontal={8}
                      paddingVertical={2}
                      onPress={handleDecrease}
                      hitSlop={10}
                    >
                      -
                    </CustomButton>

                    <ThemedText
                      style={{
                        fontSize: 15,
                        fontWeight: "700",
                        minWidth: 20,
                        textAlign: "center",
                      }}
                    >
                      {quantity}
                    </ThemedText>
                  </>
                )}

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
                  hitSlop={10}
                  onPress={handleAddToCart}
                >
                  +
                </CustomButton>
              </XStack>
            </XStack>
          </YStack>
        </XStack>
      </YStack>
    </Pressable>
  );
};
