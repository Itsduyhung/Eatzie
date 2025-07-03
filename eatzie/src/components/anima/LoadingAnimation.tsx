import { IconInlineData } from "@/app/constant/IconInlineData";
import { useThemedTextColor } from "@/app/hooks/ThemedTextColor";
import type { IconInline } from "@/types/iconInline";
import { useRouter } from "expo-router";
import LottieView, { AnimationObject } from "lottie-react-native";
import React from "react";
import { Dimensions, FlatList, Pressable } from "react-native";
import { Text, YStack } from "tamagui";

const screenWidth = Dimensions.get("window").width;

export const IconInlineList = () => {
  const router = useRouter();
  const { textColor } = useThemedTextColor();

  const renderItem = ({ item }: { item: IconInline }) => (
    <Pressable
      onPress={() => item.path && router.push(item.path as any)}
      style={{
        alignItems: "center",
        justifyContent: "flex-start",
        width: screenWidth / 3,
        marginHorizontal: 2,
      }}
    >
      <YStack height={60} justifyContent="center" alignItems="center">
        {item.iconType === "lottie" && item.icon ? (
          <LottieView
            source={item.icon as unknown as AnimationObject}
            autoPlay
            loop
            style={{ width: 50, height: 50 }}
          />
        ) : item.iconType === "component" && item.iconComponent ? (
          <item.iconComponent {...item.iconProps} />
        ) : null}
      </YStack>

      <YStack height={40} width={90} justifyContent="flex-start">
        <Text
          fontSize="$4"
          textAlign="center"
          color={textColor}
          numberOfLines={2}
        >
          {item.title}
        </Text>
      </YStack>
    </Pressable>
  );

  return (
    <FlatList
      data={IconInlineData}
      horizontal
      keyExtractor={(item, index) => `${item.title}-${index}`}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 0, flexGrow: 1 }}
      renderItem={renderItem}
    />
  );
};
