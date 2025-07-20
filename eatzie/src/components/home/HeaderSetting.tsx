import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text, XStack, YStack } from "tamagui";
import { BackButton } from "../ui/BackButton";

import { useThemedTextColor } from "@/app/hooks/ThemedTextColor";

type HeaderSettingProps = {
  nameTitle: string;
};

export const HeaderSetting = ({ nameTitle }: HeaderSettingProps) => {
  const insets = useSafeAreaInsets();
  const { textColor } = useThemedTextColor();

  return (
    <YStack
      width="100%"
      paddingTop={insets.top}
      height={insets.top + 56}
      backgroundColor="white"
      justifyContent="center"
    >
      <XStack
        width="100%"
        alignItems="center"
        justifyContent="center"
        position="relative"
      >
        <XStack position="absolute" left="$3">
          <BackButton />
        </XStack>

        <Text fontSize="$6" fontWeight="700" color={textColor}>
          {nameTitle}
        </Text>
      </XStack>
    </YStack>
  );
};
