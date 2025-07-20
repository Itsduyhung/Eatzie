import { ThemedText } from "@/app/hooks/ThemedTextColor";
import { CartItem } from "@/components/anima/CartShop";
import { CartFooter } from "@/components/footer/CardFooter";
import { ScrollScreenLayout } from "@/components/layout/ScrollScreenLayout";
import { BackButton } from "@/components/ui/BackButton";
import { CustomButton } from "@/components/ui/CustomButton";
import { useCartStore } from "@/stores/useCartStore";
import { X } from "@tamagui/lucide-icons";
import { useRouter } from "expo-router";
import { Pressable } from "react-native";
import { Separator, XStack, YStack } from "tamagui";

export default function CartScreen() {
  const cart = useCartStore((s) => s.cart);
  const total = useCartStore((s) => s.total)();
  const itemCount = useCartStore((s) => s.itemCount)();
  const clearCart = useCartStore((s) => s.clearCart);
  const router = useRouter();

  return (
    <ScrollScreenLayout headerLeftIcons={[<BackButton key="back" />]}>
      <XStack
        alignItems="center"
        justifyContent="space-between"
        paddingHorizontal="$4"
        paddingTop="$4"
        paddingBottom="$2"
        marginTop="$10"
        position="relative"
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

        <ThemedText
          style={{
            fontSize: 16,
            fontWeight: "900",
            position: "absolute",
            left: "50%",
            transform: [{ translateX: -10 }, { translateY: 5 }], // Căn giữa tuyệt đối
          }}
        >
          Giỏ hàng
        </ThemedText>

        <Pressable
          onPress={() => router.back()}
          hitSlop={10}
          style={{
            padding: 8,
            borderRadius: 999,
          }}
        >
          <X size={20} color="#000" />
        </Pressable>
      </XStack>

      <Separator marginBottom="$2" />

      <YStack gap="$2" px="$4" pb="$10">
        {cart.map((item) => (
          <CartItem key={item.id} item={item} />
        ))}
      </YStack>

      <CartFooter />
    </ScrollScreenLayout>
  );
}
