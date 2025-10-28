import { CartItem } from "@/stores/useCartStore";
import { ThemedText } from "@/app/hooks/ThemedTextColor";
import { SizableImage } from "@/components/ui/SizableImageProps";
import { FontAwesome5 } from "@expo/vector-icons";
import { XStack, YStack } from "tamagui";
import { formatCurrency } from "@/utils/formatCurrency";
import { Pressable } from "react-native";
import { useRouter } from "expo-router";

type CartItemsProps = {
  cart: CartItem[];
  orderId?: number;
};

export const CartItems = ({ cart, orderId }: CartItemsProps) => {
  const router = useRouter();
  return (
    <YStack
      backgroundColor="white"
      gap="$3"
      borderRadius={8}
      paddingVertical={20}
    >
      {cart.map((item) => (
        <YStack
          key={item.id}
          gap="$4"
          paddingHorizontal="$2"
          paddingVertical="$2"
        >
          <XStack gap={10} alignItems="center">
            <FontAwesome5 name="store" size={18} color="#6666FF" />
            <ThemedText style={{ fontSize: 15, fontWeight: "500" }}>
              {item.restaurantName}
            </ThemedText>
          </XStack>

          <XStack gap={20} position="relative">
            <Pressable
              key={item.id}
              hitSlop={10}
              onPress={() => {
                router.push({
                  pathname: "/feedback/postf",
                  params: {
                    id: item.id,
                    ...(orderId !== undefined ? { orderId } : {}),
                  },
                });
              }}
            >
              <SizableImage
                source={{ uri: item.image as any }}
                resizeMode="cover"
                borderRadius={8}
                style={{ width: 60, height: 60 }}
              />
            </Pressable>

            <YStack gap={8}>
              <ThemedText style={{ fontSize: 16, fontWeight: "500" }}>
                {item.quantity} x {item.name}
              </ThemedText>
              {item.note && (
                <ThemedText
                  style={{
                    fontSize: 14,
                    fontWeight: "500",
                    color: "#A0A0A0",
                  }}
                >
                  {item.note}
                </ThemedText>
              )}
            </YStack>
            <YStack position="absolute" right={0}>
              <ThemedText style={{ fontSize: 16, fontWeight: "500" }}>
                {formatCurrency(item.price * item.quantity)}
              </ThemedText>
            </YStack>
          </XStack>
        </YStack>
      ))}
    </YStack>
  );
};
