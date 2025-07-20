import { ThemedText } from "@/app/hooks/ThemedTextColor";
import { useCartStore } from "@/stores/useCartStore";
import { FoodItem } from "@/types/foodCategory";
import { formatCurrency } from "@/utils/formatCurrency";
import { useRouter } from "expo-router";
import { useRef } from "react";
import { Pressable, TextInput, View } from "react-native";
import { XStack, YStack } from "tamagui";
import { CustomButton } from "../ui/CustomButton";
import { SizableImage } from "../ui/SizableImageProps";
import { cartRef } from "./cartRef";
import { useFlyToCart } from "./useFlyToCart";

type Props = {
  item: FoodItem;
};

export const CartItem = ({ item }: Props) => {
  const router = useRouter();
  const addToCart = useCartStore((state) => state.addToCart);
  const increaseQuantity = useCartStore((state) => state.increaseQuantity);
  const decreaseQuantity = useCartStore((state) => state.decreaseQuantity);
  const updateNote = useCartStore((state) => state.updateNote);

  const cartItem = useCartStore((state) =>
    state.cart.find((i) => i.id === item.id)
  );
  const quantity = cartItem?.quantity ?? 0;
  const note = cartItem?.note ?? "";

  const { flyToCart } = useFlyToCart();
  const buttonRefs = useRef<Record<string, View | null>>({});

  const handleAddToCart = () => {
    const ref = buttonRefs.current[item.id];
    ref?.measureInWindow?.((x, y, width, height) => {
      const start = { x: x + width / 2, y: y + height / 2 };
      cartRef.current?.measureInWindow?.((endX, endY, endW, endH) => {
        const end = { x: endX + endW / 2, y: endY + endH / 2 };
        flyToCart(start, end);
      });
    });

    if (quantity === 0) {
      addToCart({ ...item, note: "" });
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
    <YStack gap={1}>
      <Pressable
        onPress={() =>
          router.push({
            pathname: "/(features)/food/detailsfood",
            params: { id: item.id },
          })
        }
      >
        <XStack padding="$3" gap="$3">
          <SizableImage
            source={item.image}
            resizeMode="cover"
            borderRadius={8}
            style={{ width: 60, height: 60 }}
          />

          <YStack flex={1} justifyContent="space-between">
            <ThemedText fontWeight="700" fontSize="$5">
              {item.name}
            </ThemedText>

            {!!item.description && (
              <ThemedText fontSize="$2" color="$gray10Dark">
                {item.description}
              </ThemedText>
            )}

            <TextInput
              placeholder="Thêm ghi chú..."
              value={note}
              onChangeText={(text) => updateNote(item.id, text)}
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
                {formatCurrency(item.price)}
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
                  ref={(ref) => {
                    if (ref) buttonRefs.current[item.id] = ref;
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
