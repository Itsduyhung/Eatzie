import React, { ReactNode } from "react";
import { StyleSheet } from "react-native";
import { XStack, YStack } from "tamagui";
import { BlurView } from "expo-blur";

type Props = {
  children: ReactNode;
  size?: number;
  backgroundColor?: string;
  blurIntensity?: number;
  blurTint?: "light" | "dark" | "default";
};

export const HeaderIconButton = ({
  children,
  size = 40,
  backgroundColor = "rgba(144, 3, 12, 0.3)",
  blurIntensity = 50,
  blurTint = "light",
}: Props) => {
  const borderRadius = size / 2;

  return (
    <XStack
      width={size}
      height={size}
      borderRadius={borderRadius}
      overflow="hidden"
      alignItems="center"
      justifyContent="center"
    >
      <BlurView
        intensity={blurIntensity}
        tint={blurTint}
        style={StyleSheet.absoluteFill}
      />

      <XStack
        width={size}
        height={size}
        backgroundColor={backgroundColor}
        alignItems="center"
        justifyContent="center"
      >
        <YStack>{children}</YStack>
      </XStack>
    </XStack>
  );
};
