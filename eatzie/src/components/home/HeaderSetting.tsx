import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text, XStack, YStack } from "tamagui";
import { BackButton } from "../ui/BackButton";

import { useThemedTextColor } from "@/app/hooks/ThemedTextColor";

type HeaderSettingProps = {
  nameTitle: string;
  order?: boolean;
};

export const HeaderSetting = ({
  nameTitle,
  order = false,
}: HeaderSettingProps) => {
  const insets = useSafeAreaInsets();
  const { textColor } = useThemedTextColor();

  return (
    <YStack
      width="100%"
      height={insets.top}
      backgroundColor="white"
      justifyContent="center"
    >
      <XStack
        width="100%"
        alignItems="center"
        justifyContent="center"
        position="relative"
      >
        {!order && (
          <XStack position="absolute" left="$3">
            <BackButton />
          </XStack>
        )}

        <Text fontSize="$7" fontWeight="700" color={textColor}>
          {nameTitle}
        </Text>
      </XStack>
    </YStack>
  );
};
