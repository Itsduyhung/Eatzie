import { ThemedText } from "@/app/hooks/ThemedTextColor";
import { CartItem } from "@/components/anima/CartShop";
import { CustomButton } from "@/components/ui/CustomButton";
import { useCartStore } from "@/stores/useCartStore";
import { X } from "@tamagui/lucide-icons";
import { Pressable } from "react-native";
import { ScrollView, Separator, Text, XStack, YStack } from "tamagui";
import { useRef, useEffect } from "react";

type CartScreenProps = {
  onClose?: () => void;
};
const MemoCartItem = CartItem;

export default function CartScreen({ onClose }: CartScreenProps) {
  const cart = useCartStore((s) => s.cart);
  const clearCart = useCartStore((s) => s.clearCart);
  const total = useCartStore((s) => s.total)();
  const itemCount = useCartStore((s) => s.itemCount)();

  const scrollRef = useRef<ScrollView>(null);
  const scrollYRef = useRef(0);

  const handleScroll = (e: any) => {
    scrollYRef.current = e.nativeEvent.contentOffset.y;
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ y: scrollYRef.current, animated: false });
    }
  }, [cart]);

  return (
    <YStack pb="$8">
      <XStack
        alignItems="center"
        justifyContent="space-between"
        paddingHorizontal="$5"
        paddingTop="$3"
        paddingBottom="$2"
        marginTop="$2"
      >
        <CustomButton
          paddingHorizontal={0}
          textfontsize="$4"
          textfontweight="600"
          onPress={clearCart}
          color="#6666FF"
        >
          Xóa tất cả
        </CustomButton>

        <XStack flex={1} justifyContent="center">
          <Text fontSize="$5" fontWeight="700" color="black">
            Giỏ hàng ({itemCount})
          </Text>
        </XStack>

        <Pressable
          hitSlop={10}
          style={{ borderRadius: 999 }}
          onPress={() => onClose?.()}
        >
          <X size={25} color="#000" />
        </Pressable>
      </XStack>

      <Separator borderColor="$gray10Dark" marginBottom="$2" />

      <ScrollView
        ref={scrollRef}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <YStack gap="$2" px="$4" pb="$14">
          {cart.length > 0 ? (
            cart.map((item, index) => (
              <YStack
                key={item.id}
                paddingVertical="$3"
                borderBottomWidth={index !== cart.length - 1 ? 0.5 : 0}
                borderBottomColor="#E5E5E5"
              >
                <MemoCartItem id={item.id} />
              </YStack>
            ))
          ) : (
            <ThemedText
              style={{
                textAlign: "center",
                marginTop: 40,
                fontWeight: "500",
              }}
            >
              Giỏ hàng trống
            </ThemedText>
          )}
        </YStack>
      </ScrollView>
    </YStack>
  );
}
