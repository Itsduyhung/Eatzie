import { CartItem } from "@/components/anima/CartShop";
import { CartFooter } from "@/components/footer/CardFooter";
import { ScrollScreenLayout } from "@/components/layout/ScrollScreenLayout";
import { useCartStore } from "@/stores/useCartStore";
import { formatCurrency } from "@/utils/formatCurrency";
import { Text, XStack, YStack } from "tamagui";

export default function CartScreen() {
  const cart = useCartStore((s) => s.cart);
  const total = useCartStore((s) => s.total)();
  const itemCount = useCartStore((s) => s.itemCount)();

  return (
    <ScrollScreenLayout>
      <YStack gap="$2" px="$4" py="$2">
        {cart.map((item) => (
          <CartItem key={item.id} item={item} />
        ))}
      </YStack>

      <XStack
        px="$4"
        py="$3"
        justifyContent="space-between"
        alignItems="center"
        borderTopWidth={1}
        borderColor="#eee"
        bg="$background"
      >
        <YStack>
          <Text fontWeight="700">Tổng cộng:</Text>
          <Text color="$red10" fontSize="$6">
            {formatCurrency(total)}
          </Text>
        </YStack>
        <Text>{itemCount} món</Text>
      </XStack>
      <CartFooter />
    </ScrollScreenLayout>
  );
}
