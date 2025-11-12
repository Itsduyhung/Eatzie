import CartScreen from "@/app/(features)/cart/screencart";
import { ThemedText } from "@/hooks/ThemedTextColor";
import { useCartStore } from "@/stores/useCartStore";
import { formatCurrency } from "@/utils/formatCurrency";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable } from "react-native";
import { XStack, YStack } from "tamagui";
import { cartRef } from "../anima/cartRef";
import { BottomSheet } from "../bottom-sheet/BottomSheet";
import { CustomButton } from "../ui/CustomButton";

export const CartFooter = () => {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);

  const getTotal = useCartStore((s) => s.total);
  const getItemCount = useCartStore((s) => s.itemCount);
  const cart = useCartStore((s) => s.cart);

  const total = useMemo(() => getTotal(), [cart]);
  const itemCount = useMemo(() => getItemCount(), [cart]);

  const openSheet = () => setIsVisible(true);
  const closeSheet = () => setIsVisible(false);

  if (cart.length === 0) return null;

  return (
    <>
      {isVisible && (
        <BottomSheet visible={isVisible} onClose={closeSheet}>
          <CartScreen onClose={closeSheet} />
        </BottomSheet>
      )}

      <YStack
        position="absolute"
        bottom={0}
        left={0}
        right={0}
        backgroundColor="white"
        borderTopWidth={1}
        borderColor="#ccc"
        padding="$3"
        justifyContent="space-between"
        zIndex={100}
      >
        <XStack
          alignItems="center"
          justifyContent="space-between"
          marginBottom={2}
        >
          <Pressable
            onPress={openSheet}
            ref={(ref) => {
              if (ref) cartRef.current = ref;
            }}
          >
            <YStack position="relative">
              <Feather name="shopping-cart" size={32} color="black" />
              {itemCount > 0 && (
                <YStack
                  position="absolute"
                  top={-12}
                  right={-12}
                  backgroundColor="#FF3B30"
                  borderRadius={9999}
                  minWidth={18}
                  height={18}
                  paddingHorizontal={4}
                  alignItems="center"
                  justifyContent="center"
                >
                  <ThemedText
                    style={{
                      color: "white",
                      fontSize: 8,
                      fontWeight: "700",
                    }}
                  >
                    {itemCount}
                  </ThemedText>
                </YStack>
              )}
            </YStack>
          </Pressable>

          <XStack alignItems="center" gap={10}>
            <ThemedText
              style={{
                fontSize: 18,
                fontWeight: "700",
                color: "#6666FF",
              }}
            >
              {formatCurrency(total)}
            </ThemedText>

            <CustomButton
              backgroundColor="#6666FF"
              textfontsize="$4"
              textfontweight="600"
              paddingHorizontal={20}
              paddingVertical={8}
              onPress={() =>
                router.push({
                  pathname: "/(features)/cart/confirmorderscreen",
                  params: { title: "Xác nhận đơn hàng" },
                })
              }
            >
              Đặt hàng
            </CustomButton>
          </XStack>
        </XStack>
      </YStack>
    </>
  );
};
