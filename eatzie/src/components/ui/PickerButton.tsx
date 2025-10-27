import React from "react";
import { Button, Separator, Text, YStack } from "tamagui";

type PickerButtonProps = {
  label: string;
  onPress: () => void;
  withSeparator?: boolean;
};

export const PickerButton = ({
  label,
  onPress,
  withSeparator,
}: PickerButtonProps) => {
  return (
    <YStack width="100%">
      <Button
        pressStyle={{ backgroundColor: "#F0F0F0", borderColor: "transparent" }}
        backgroundColor="transparent"
        onPress={onPress}
      >
        <Text fontSize={18} color="#007AFF">
          {label}
        </Text>
      </Button>

      {withSeparator && (
        <Separator borderColor="#E5E5EA" borderWidth={0.5} width="100%" />
      )}
    </YStack>
  );
};
