import { ScrollScreenLayout } from "@/components/layout/ScrollScreenLayout";
import { BackButton } from "@/components/ui/BackButton";
import { SizableImage } from "@/components/ui/SizableImageProps";
import { Separator, XStack, YStack } from "tamagui";

export default function QrScreen() {
  return (
    <ScrollScreenLayout headerLeftIcons={[<BackButton key="back" />]}>
      <YStack>
        <XStack>
          <BackButton key="back" />
        </XStack>

        <YStack>
          <SizableImage
            style={{ width: 150, height: 150 }}
            source={require("../../../assets/images/qr.jpg")}
          ></SizableImage>
        </YStack>
      </YStack>

      <Separator marginBottom="$2" />
    </ScrollScreenLayout>
  );
}
