import { ThemedText } from "@/app/hooks/ThemedTextColor";
import { CartItem } from "@/components/anima/CartShop";
import { CustomButton } from "@/components/ui/CustomButton";
import { useCartStore } from "@/stores/useCartStore";
import { X } from "@tamagui/lucide-icons";
import { Pressable } from "react-native";
import { Separator, Text, XStack, YStack } from "tamagui";

export default function CartScreen() {
  const cart = useCartStore((s) => s.cart);
  const clearCart = useCartStore((s) => s.clearCart);
  const total = useCartStore((s) => s.total)();
  const itemCount = useCartStore((s) => s.itemCount)();

  return (
    <YStack pb="$8">
      <XStack
        alignItems="center"
        justifyContent="space-between"
        paddingHorizontal="$4"
        paddingTop="$3"
        paddingBottom="$2"
        marginTop="$2"
      >
        <CustomButton
          borderRadius={4}
          textfontsize="$4"
          textfontweight="600"
          paddingHorizontal={8}
          paddingVertical={1}
          onPress={clearCart}
          color="#6666FF"
        >
          Xóa tất cả
        </CustomButton>

        <Text fontSize="$5" fontWeight="700" color="black">
          Giỏ hàng ({itemCount})
        </Text>

        <Pressable hitSlop={10} style={{ padding: 8, borderRadius: 999 }}>
          <X size={25} color="#000" />
        </Pressable>
      </XStack>
      <Separator marginBottom="$2" />
      <YStack gap="$2" px="$4" pb="$6">
        {cart.length > 0 ? (
          cart.map((item) => <CartItem key={item.id} id={item.id} />)
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
    </YStack>
  );
}
