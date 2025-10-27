import React from "react";
import { Sheet, YStack, Button, Text } from "tamagui";
import { PickerButton } from "./PickerButton";

type Props = {
  open: boolean;
  onOpenChange: (val: boolean) => void;
  onPickCamera: () => void;
  onPickLibrary: () => void;
};

export const ImagePickerSheet = ({
  open,
  onOpenChange,
  onPickCamera,
  onPickLibrary,
}: Props) => {
  return (
    <Sheet
      modal
      open={open}
      onOpenChange={onOpenChange}
      snapPoints={[35]}
      dismissOnSnapToBottom
    >
      <Sheet.Overlay opacity={0.4} />
      <Sheet.Handle />
      <Sheet.Frame
        elevation={0}
        backgroundColor="transparent"
        padding="$2"
        gap="$4"
      >
        <YStack
          justifyContent="center"
          alignItems="center"
          borderRadius={12}
          overflow="hidden"
          backgroundColor="white"
        >
          {/* Header */}
          <YStack paddingVertical={16} backgroundColor="#F9F9F9" width="100%">
            <Text textAlign="center" color="gray">
              Thêm ảnh
            </Text>
          </YStack>

          <PickerButton label="Máy ảnh" onPress={onPickCamera} withSeparator />
          <PickerButton label="Hình ảnh" onPress={onPickLibrary} />
        </YStack>

        <Button backgroundColor="white" onPress={() => onOpenChange(false)}>
          <Text
            fontSize={20}
            fontWeight="500"
            color="#3D90F9"
            fontFamily="mono"
          >
            Hủy
          </Text>
        </Button>
      </Sheet.Frame>
    </Sheet>
  );
};
