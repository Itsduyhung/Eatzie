import { ThemedText } from "@/app/hooks/ThemedTextColor";
import { useCartStore } from "@/stores/useCartStore";
import { useEffect, useRef, useState } from "react";
import { Pressable, TextInput, View } from "react-native";
import { XStack, YStack } from "tamagui";

import { useFoodStore } from "@/stores/FoodStore";
import { FoodItemD } from "@/types/foodCategory";
import { formatCurrency } from "@/utils/formatCurrency";
import { useRouter } from "expo-router";
import { CustomButton } from "../ui/CustomButton";
import { SizableImage } from "../ui/SizableImageProps";
import { cartRef } from "./cartRef";
import { useFlyToCart } from "./useFlyToCart";

type Props = {
  id: number;
};

export const CartItem = ({ id }: Props) => {
  const router = useRouter();

  const food = useFoodStore((s) => s.foods[id]);
  const fetchFood = useFoodStore((s) => s.fetchFood);

  useEffect(() => {
    if (!food) fetchFood(id).catch(() => {});
  }, [id, food, fetchFood]);

  const cartItem = useCartStore((s) => s.cart.find((i) => i.id === id));
  const quantity = cartItem?.quantity ?? 0;
  const note = cartItem?.note ?? "";

  const addToCart = useCartStore((s) => s.addToCart);
  const increaseQuantity = useCartStore((s) => s.increaseQuantity);
  const decreaseQuantity = useCartStore((s) => s.decreaseQuantity);
  const updateNote = useCartStore((s) => s.updateNote);

  // --- Fly to cart animation ---
  const { flyToCart } = useFlyToCart();
  const buttonRefs = useRef<Record<number, View | null>>({});

  // --- Local note state ---
  const [localNote, setLocalNote] = useState(note);
  useEffect(() => setLocalNote(note), [note]);

  const displayItem: FoodItemD | undefined = food;

  const safeAddOrIncrease = () => {
    if (!displayItem) return;
    if (quantity > 0) increaseQuantity(id);
    else addToCart({ ...displayItem, note: "" });
  };

  const handleAddToCart = () => {
    const ref = buttonRefs.current[id];

    if (ref?.measureInWindow && cartRef.current?.measureInWindow) {
      ref.measureInWindow((x, y, w, h) => {
        cartRef.current?.measureInWindow((endX, endY, endW, endH) => {
          flyToCart(
            { x: x + w / 2, y: y + h / 2 },
            { x: endX + endW / 2, y: endY + endH / 2 }
          );
          safeAddOrIncrease();
        });
      });
    } else {
      safeAddOrIncrease();
    }
  };

  const handleDecrease = () => {
    if (quantity > 0) decreaseQuantity(id);
  };

  const handleNoteChange = (text: string) => {
    setLocalNote(text);
    updateNote(id, text);
  };

  if (!displayItem) {
    return (
      <YStack padding="$3">
        <ThemedText color="$gray10Dark">Đang tải món ăn...</ThemedText>
      </YStack>
    );
  }

  return (
    <YStack gap={1}>
      <Pressable
        onPress={() =>
          router.push({
            pathname: "/(features)/food/detailsfood",
            params: { id },
          })
        }
      >
        <XStack padding="$3" gap="$3">
          <SizableImage
            source={{ uri: displayItem.image as any }}
            resizeMode="cover"
            borderRadius={8}
            style={{ width: 60, height: 60 }}
          />

          <YStack flex={1} justifyContent="space-between">
            <ThemedText fontWeight="700" fontSize="$5">
              {displayItem.name}
            </ThemedText>

            {!!displayItem.description && (
              <ThemedText fontSize="$2" color="$gray10Dark">
                {displayItem.description}
              </ThemedText>
            )}

            <TextInput
              placeholder="Thêm ghi chú..."
              value={localNote}
              onChangeText={handleNoteChange}
              style={{
                fontSize: 13,
                color: "#555",
                marginTop: 6,
                paddingVertical: 4,
                paddingHorizontal: 0,
              }}
              placeholderTextColor="#aaa"
            />

            <XStack
              justifyContent="space-between"
              alignItems="center"
              marginTop="$2"
            >
              <ThemedText fontWeight="700" fontSize="$4" color="#6666FF">
                {formatCurrency(displayItem.price)}
              </ThemedText>

              <XStack alignItems="center" gap="$2">
                {quantity > 0 && (
                  <>
                    <CustomButton
                      backgroundColor="#6666FF"
                      borderRadius={4}
                      paddingHorizontal={8}
                      paddingVertical={2}
                      textfontsize="$4"
                      textfontweight="600"
                      onPress={handleDecrease}
                    >
                      -
                    </CustomButton>

                    <ThemedText
                      fontSize="$4"
                      fontWeight="700"
                      minWidth={20}
                      textAlign="center"
                    >
                      {quantity}
                    </ThemedText>
                  </>
                )}

                <CustomButton
                  ref={(ref: any) => {
                    if (ref) buttonRefs.current[id] = ref;
                  }}
                  backgroundColor="#6666FF"
                  borderRadius={4}
                  paddingHorizontal={8}
                  paddingVertical={2}
                  textfontsize="$4"
                  textfontweight="600"
                  onPress={handleAddToCart}
                >
                  +
                </CustomButton>
              </XStack>
            </XStack>
          </YStack>
        </XStack>
      </Pressable>

      <View
        style={{
          height: 1,
          backgroundColor: "#E0E0E0",
          marginHorizontal: 12,
        }}
      />
    </YStack>
  );
};
