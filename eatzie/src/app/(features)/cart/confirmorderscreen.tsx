// app/(features)/cart/ConfirmOrderScreen.tsx

import { ThemedText } from "@/app/hooks/ThemedTextColor";
import { ScrollScreenLayout } from "@/components/layout/ScrollScreenLayout";
import { BackButton } from "@/components/ui/BackButton";
import { CustomButton } from "@/components/ui/CustomButton";
import { SizableImage } from "@/components/ui/SizableImageProps";
import { useCartStore } from "@/stores/useCartStore";
import { formatCurrency } from "@/utils/formatCurrency";
import {
  FontAwesome5,
  FontAwesome6,
  MaterialCommunityIcons,
} from "@expo/vector-icons";

import { useRouter } from "expo-router";
import { XStack, YStack } from "tamagui";

export default function ConfirmOrderScreen() {
  const router = useRouter();
  const cart = useCartStore((s) => s.cart);
  const total = useCartStore((s) => s.total)();

  return (
    <ScrollScreenLayout headerLeftIcons={[<BackButton key="back" />]}>
      <YStack padding="$2" gap="$5">
        <YStack
          backgroundColor="white"
          paddingHorizontal="$2"
          paddingVertical="$2"
          borderRadius={8}
          gap={"$2"}
        >
          <YStack>
            <XStack gap={"$3"}>
              <MaterialCommunityIcons
                name="map-marker-radius-outline"
                size={24}
                color="black"
              />
              <ThemedText
                style={{
                  fontSize: 16,
                  fontWeight: "500",
                  textAlign: "center",
                }}
              >
                Nhơn Bình, Quy Nhơn
              </ThemedText>
            </XStack>
          </YStack>
          <XStack marginLeft={35}>
            <ThemedText
              style={{
                fontSize: 16,
                fontWeight: "500",
                textAlign: "center",
              }}
            >
              fooode_hqchfspri | 0901234567
            </ThemedText>
          </XStack>
          <YStack marginTop={20}>
            <YStack gap={"$3"}>
              <XStack gap={"$3"} position="relative" alignItems="center">
                <FontAwesome6 name="clock" size={24} color="black" />

                <ThemedText
                  style={{
                    fontSize: 16,
                    fontWeight: "500",
                    textAlign: "center",
                  }}
                >
                  Giao ngay
                </ThemedText>
                <XStack position="absolute" right="0">
                  <ThemedText
                    style={{
                      fontSize: 16,
                      fontWeight: "500",
                      textAlign: "center",
                      color: "#6666FF",
                    }}
                  >
                    Đổi sang giờ hẹn
                  </ThemedText>
                </XStack>
              </XStack>
              <CustomButton
                paddingVertical={15}
                borderColor="#6666FF"
                borderWidth={1}
                backgroundColor="transparent"
                minWidth="100%"
              >
                <ThemedText
                  style={{
                    fontSize: 16,
                    fontWeight: "500",
                    textAlign: "center",
                    color: "#6666FF",
                  }}
                >
                  Tiêu chuẩn - 17:15
                </ThemedText>
              </CustomButton>
            </YStack>
          </YStack>
        </YStack>

        <YStack backgroundColor="white" gap="$3" borderRadius={8}>
          {cart.map((item) => (
            <YStack
              key={item.id}
              gap="$4"
              paddingHorizontal="$2"
              paddingVertical="$2"
            >
              <XStack gap={10}>
                <FontAwesome5 name="store" size={18} color="#6666FF" />
                <ThemedText
                  style={{
                    fontSize: 15,
                    fontWeight: "500",
                    textAlign: "center",
                  }}
                >
                  Tiệm phở Nguyệt Trang Dương
                </ThemedText>
              </XStack>
              <XStack gap={20} position="relative">
                <SizableImage
                  source={item.image}
                  resizeMode="cover"
                  borderRadius={8}
                  style={{
                    width: 60,
                    height: 60,
                  }}
                />
                <YStack gap={20}>
                  <ThemedText
                    style={{
                      fontSize: 16,
                      fontWeight: "500",
                    }}
                  >
                    {item.quantity} x {item.name}
                  </ThemedText>
                  <ThemedText
                    style={{
                      fontSize: 14,
                      fontWeight: "500",
                      textAlign: "center",
                      color: "#A0A0A0",
                    }}
                  >
                    ít bún
                  </ThemedText>
                </YStack>

                <YStack position="absolute" right={0}>
                  <ThemedText
                    style={{
                      fontSize: 16,
                      fontWeight: "500",
                      textAlign: "center",
                    }}
                  >
                    {formatCurrency(item.price * (item.quantity ?? 1))}
                  </ThemedText>
                </YStack>
              </XStack>
            </YStack>
          ))}
        </YStack>

        <YStack
          backgroundColor="white"
          gap={8}
          paddingHorizontal="$2"
          paddingVertical="$2"
          borderRadius={8}
        >
          <XStack>
            <ThemedText
              style={{
                fontSize: 16,
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              Chi tiết thanh toán
            </ThemedText>
          </XStack>

          <XStack justifyContent="space-between">
            <ThemedText
              style={{
                fontSize: 16,
                fontWeight: "500",
                textAlign: "center",
              }}
            >
              Tổng giá trị món
            </ThemedText>
            <ThemedText
              style={{
                fontSize: 16,
                fontWeight: "500",
                textAlign: "center",
              }}
            >
              {formatCurrency(total)}
            </ThemedText>
          </XStack>
          <XStack justifyContent="space-between">
            <ThemedText
              style={{
                fontSize: 16,
                fontWeight: "500",
                textAlign: "center",
              }}
            >
              Phí giao hàng
            </ThemedText>
            <ThemedText
              style={{
                fontSize: 16,
                fontWeight: "500",
                textAlign: "center",
              }}
            >
              {formatCurrency(14000)}
            </ThemedText>
          </XStack>
          <XStack justifyContent="space-between">
            <ThemedText
              style={{
                fontSize: 16,
                fontWeight: "500",
                textAlign: "center",
              }}
            >
              Tổng cộng
            </ThemedText>
            <ThemedText
              style={{
                fontSize: 16,
                fontWeight: "500",
                textAlign: "center",
              }}
            >
              {formatCurrency(total + 14000)}
            </ThemedText>
          </XStack>
        </YStack>

        <XStack gap={10} alignItems="center" justifyContent="center">
          <CustomButton
            borderColor="#6666FF"
            borderWidth={1}
            backgroundColor="transparent"
            width={180}
          >
            <ThemedText
              style={{
                fontSize: 16,
                fontWeight: "500",
                textAlign: "center",
                color: "#6666FF",
              }}
            >
              Tiền Mặt
            </ThemedText>
          </CustomButton>
          <CustomButton
            borderColor="#6666FF"
            borderWidth={1}
            backgroundColor="transparent"
            width={180}
            // minWidth="50%"
          >
            <ThemedText
              style={{
                fontSize: 16,
                fontWeight: "500",
                textAlign: "center",
                color: "#6666FF",
              }}
            >
              Chuyển khoản
            </ThemedText>
          </CustomButton>
        </XStack>

        <XStack>
          <CustomButton
            paddingVertical={15}
            backgroundColor="#6666FF"
            textfontweight="600"
            minWidth="100%"
            onPress={() => {
              alert("Đặt hàng thành công!");
              useCartStore.getState().clearCart();
              router.push("/");
            }}
          >
            <ThemedText
              style={{
                fontSize: 16,
                fontWeight: "500",
                textAlign: "center",
                color: "white",
              }}
            >
              Đặt đơn - {formatCurrency(total + 14000)}
            </ThemedText>
          </CustomButton>
        </XStack>
      </YStack>
    </ScrollScreenLayout>
  );
}
