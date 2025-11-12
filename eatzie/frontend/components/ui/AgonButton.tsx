import React from "react";
import { Button, YStack } from "tamagui";
import Svg, { Polygon } from "react-native-svg";
import { Check } from "@tamagui/lucide-icons";

interface TriangularCornerButtonProps {
  children: React.ReactNode;
  onPress?: () => void;
  borderColor?: string;
  backgroundColor?: string;
  triangleSize?: number;
  selected?: boolean;
  style?: any;
}

export function TriangularCornerButton({
  children,
  onPress,
  borderColor = "#000",
  backgroundColor = "white",
  triangleSize = 20,
  selected = false,
  style = {},
}: TriangularCornerButtonProps) {
  const tickSize = triangleSize * 0.6;
  const tickOffset = triangleSize * 0.04;

  return (
    <Button
      onPress={onPress}
      borderWidth={2}
      borderColor={borderColor}
      borderStyle="solid"
      style={{
        position: "relative",
        overflow: "hidden",
        backgroundColor,
        paddingVertical: 10,
        paddingHorizontal: 16,
        justifyContent: "center",
        alignItems: "center",
        ...style,
      }}
    >
      {selected && (
        <>
          <Svg
            width={triangleSize}
            height={triangleSize}
            viewBox={`0 0 ${triangleSize} ${triangleSize}`}
            style={{ position: "absolute", top: 0, left: 0 }}
          >
            <Polygon
              points={`0,0 ${triangleSize},0 0,${triangleSize}`}
              fill={borderColor}
            />
          </Svg>

          <YStack
            style={{
              position: "absolute",
              top: tickOffset,
              left: tickOffset,
              width: tickSize,
              height: tickSize,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Check color="#fff" size={tickSize} />
          </YStack>
        </>
      )}

      <YStack
        style={{ zIndex: 1, justifyContent: "center", alignItems: "center" }}
      >
        {children}
      </YStack>
    </Button>
  );
}
