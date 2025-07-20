import { SizableImageProps } from "@/types/SizableImageProps";
import { EvilIcons, FontAwesome5 } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { XStack, YStack } from "tamagui";
import { BackButton } from "../ui/BackButton";
import { SizableImage } from "../ui/SizableImageProps";

type HeaderItemProps = {
  imageType: SizableImageProps;
};

export const HeaderItem = ({ imageType }: HeaderItemProps) => {
  const insets = useSafeAreaInsets();

  return (
    <YStack
      position="absolute"
      top={insets.top + 10}
      left={0}
      right={0}
      zIndex={10}
      paddingHorizontal="$3"
    >
      <XStack alignItems="center" justifyContent="space-between" width="100%">
        <BackButton />
        <SizableImage
          source={imageType as any}
          resizeMode="cover"
          borderRadius={2}
        />

        <XStack gap="$2">
          <EvilIcons name="search" size={26} color="white" />
          <FontAwesome5 name="share" size={20} color="white" />
        </XStack>
      </XStack>
    </YStack>
  );
};
