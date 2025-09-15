import {
  foodCategoryData,
  foodCategoryData1,
} from "@/app/constant/FoodCategoryData";
import { ThemedText } from "@/app/hooks/ThemedTextColor";
import { useCartStore } from "@/stores/useCartStore";
import { FoodItem } from "@/types/foodCategory";
import { formatCurrency } from "@/utils/formatCurrency";
import { useRouter } from "expo-router";
import { useRef } from "react";
import { Pressable, View } from "react-native";
import { XStack, YStack } from "tamagui";
import { CustomButton } from "../ui/CustomButton";
import { SizableImage } from "../ui/SizableImageProps";
import { cartRef } from "./cartRef";
import { useFlyToCart } from "./useFlyToCart";

type Props = {
  id: string;
  variant?: "default" | "compact";
};

export const FoodCardContent = ({ id, variant = "default" }: Props) => {
  const router = useRouter();
  const category =
    foodCategoryData.find((f) => f.id === id) ??
    foodCategoryData1.find((f) => f.id === id);
  const items = category?.items || [];
  const addToCart = useCartStore((state) => state.addToCart);
  const decreaseQuantity = useCartStore((state) => state.decreaseQuantity);
  const increaseQuantity = useCartStore((state) => state.increaseQuantity);
  const cart = useCartStore((state) => state.cart);
  const { flyToCart } = useFlyToCart();
  const buttonRefs = useRef<Record<string, View | null>>({});

  const handleAddToCart = (item: FoodItem, quantity: number) => {
    const ref = buttonRefs.current[item.id];

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

  const handleDecrease = (item: FoodItem, quantity: number) => {
    if (quantity > 0) {
      decreaseQuantity(item.id);
    }
  };

  return (
    <YStack
      gap="$3"
      paddingVertical="$2"
      paddingHorizontal="$3"
      backgroundColor="white"
    >
      <XStack>
        <ThemedText
          style={{
            fontSize: 18,
            fontWeight: "700",
            color: "#6666FF",
          }}
        >
          Menu
        </ThemedText>
      </XStack>

      {items.map((item, index) => {
        const quantity = cart.find((i) => i.id === item.id)?.quantity ?? 0;

        return (
          <YStack key={item.id}>
            <Pressable
              disabled={variant === "compact"}
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
                paddingBottom={variant === "compact" ? "$1.5" : 15}
              >
                <XStack alignItems="center">
                  <SizableImage
                    source={item.image}
                    resizeMode="cover"
                    borderRadius={20}
                    style={{
                      width: variant === "compact" ? 60 : 100,
                      height: variant === "compact" ? 60 : 100,
                    }}
                  />

                  <YStack
                    paddingTop="$2"
                    paddingHorizontal="$1.5"
                    marginLeft="$4"
                    gap="$2"
                    flex={1}
                  >
                    {variant !== "compact" && (
                      <>
                        <XStack alignItems="center">
                          <ThemedText
                            style={{
                              fontSize: 18,
                              fontWeight: "500",
                              textAlign: "center",
                            }}
                          >
                            {item.name}
                          </ThemedText>
                        </XStack>

                        <XStack alignItems="center" gap="$3">
                          <ThemedText
                            style={{
                              fontSize: 12,
                              fontWeight: "700",
                              color: "#989898",
                            }}
                          >
                            {item.salePrice} đã mua
                          </ThemedText>
                          <ThemedText
                            style={{
                              fontSize: 12,
                              fontWeight: "700",
                              color: "#989898",
                            }}
                          >
                            {item.likes} lượt thích
                          </ThemedText>
                        </XStack>
                      </>
                    )}

                    <XStack alignItems="center" justifyContent="space-between">
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
                              onPress={() => handleDecrease(item, quantity)}
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
                          onPress={() => handleAddToCart(item, quantity)}
                        >
                          +
                        </CustomButton>
                      </XStack>
                    </XStack>
                  </YStack>
                </XStack>
              </YStack>
            </Pressable>

            {variant !== "compact" && index !== items.length - 1 && (
              <YStack
                height={1}
                backgroundColor="#e0e0e0"
                marginVertical="$2"
                marginHorizontal="$3"
              />
            )}
          </YStack>
        );
      })}
    </YStack>
  );
};
