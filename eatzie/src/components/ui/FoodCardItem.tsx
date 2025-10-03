import { useThemedTextColor } from "@/app/hooks/ThemedTextColor";
import { FoodItemD } from "@/types/foodCategory";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Card, Text, XStack, YStack } from "tamagui";
import { SizableImage } from "./SizableImageProps";

type CartItemSearchProps = {
  item: FoodItemD & {
    items?: {
      id: number;
      name: string;
      imageUrl: string | null;
      price: number;
    }[];
  };
};

export function CartItemSearch({ item }: CartItemSearchProps) {
  const { textColor } = useThemedTextColor();

  return (
    <Card size="$4" p="$3" bg="white" mb="$3">
      <XStack gap="$3">
        <SizableImage
          style={{ height: 80, width: 80, borderRadius: 8 }}
          source={{ uri: item.image as any }}
          resizeMode="cover"
        />

        <YStack flex={1} gap="$2">
          <Text
            flex={1}
            flexShrink={1}
            fontSize={16}
            fontWeight="700"
            lineHeight={20}
            numberOfLines={2}
            ellipsizeMode="tail"
            color={textColor}
          >
            {item.name} {item.address ? `- ${item.address}` : ""}
          </Text>

          <XStack gap="$3" alignItems="center" mt="$1">
            <InfoIcon icon="star-rate" color="orange" text={item.rating} />
            <InfoIcon icon="visibility" text={item.views} />
          </XStack>

          {/* {item.items && item.items.length > 0 && (
            <YStack gap="$2" mt="$2">
              {item.items.map((sub) => (
                <XStack key={sub.id} gap="$2" alignItems="center">
                  <SizableImage
                    style={{ height: 60, width: 60, borderRadius: 8 }}
                    source={{ uri: sub.imageUrl as any }}
                    resizeMode="cover"
                  />

                  <YStack flex={1} height={60} position="relative">
                    <Text
                      numberOfLines={2}
                      fontSize={13}
                      color={textColor}
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                      }}
                    >
                      {sub.name}
                    </Text>

                    <Text
                      fontSize={13}
                      fontWeight="700"
                      color={textColor}
                      style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                      }}
                    >
                      {sub.price.toLocaleString("vi-VN")}đ
                    </Text>
                  </YStack>
                </XStack>
              ))}
            </YStack>
          )} */}
        </YStack>
      </XStack>
    </Card>
  );
}

function InfoIcon({
  icon,
  text,
  color = "$color11",
}: {
  icon: keyof typeof MaterialIcons.glyphMap;
  text: string | number;
  color?: string;
}) {
  return (
    <XStack alignItems="center" gap="$1">
      <MaterialIcons name={icon} size={16} color={color as any} />
      <Text fontSize={13} color="black">
        {text}
      </Text>
    </XStack>
  );
}
