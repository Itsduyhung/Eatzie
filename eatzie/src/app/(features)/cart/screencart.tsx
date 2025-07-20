import { CartItem } from "@/components/anima/CartShop";
import { CartFooter } from "@/components/footer/CardFooter";
import { ScrollScreenLayout } from "@/components/layout/ScrollScreenLayout";
import { useCartStore } from "@/stores/useCartStore";
import { YStack } from "tamagui";

export default function CartScreen() {
  const cart = useCartStore((s) => s.cart);
  const total = useCartStore((s) => s.total)();
  const itemCount = useCartStore((s) => s.itemCount)();

  return (
    <ScrollScreenLayout>
      <YStack marginTop={90} gap="$2" px="$4" py="$2">
        {cart.map((item) => (
          <CartItem key={item.id} item={item} />
        ))}
      </YStack>

      <CartFooter />
    </ScrollScreenLayout>
  );
}
