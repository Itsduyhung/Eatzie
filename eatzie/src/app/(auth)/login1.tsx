import { ScrollScreenLayout } from "@/components/layout/ScrollScreenLayout";
import { BackButton } from "@/components/ui/BackButton";
import { CustomButton } from "@/components/ui/CustomButton";
import { SizableImage } from "@/components/ui/SizableImageProps";
import { Globe } from "@tamagui/lucide-icons";
import { useRouter } from "expo-router";

import { useSafeAreaInsets } from "react-native-safe-area-context";
import { XStack, YStack } from "tamagui";
import { welcomeScreenData } from "../constant/welcomeScreen";
import { ThemedSizableText, ThemedText } from "../hooks/ThemedTextColor";

export default function WelcomeScreen() {
  const router = useRouter();
  const { titleLines, description, languageLabel } = welcomeScreenData;
  const insets = useSafeAreaInsets();

  return (
    <>
      <ScrollScreenLayout centerContent={true}>
        <XStack position="absolute" top={insets.top + 8} left="$1">
          <BackButton />
        </XStack>

        <YStack alignItems="center" gap="$2" marginTop={insets.top}>
          {titleLines.map((line, index) => (
            <ThemedText
              key={index}
              style={{
                fontSize: 32,
                fontWeight: "700",
                textAlign: "center",
              }}
            >
              {line}
            </ThemedText>
          ))}
        </YStack>

        <YStack alignItems="center" overflow="hidden" aspectRatio={3 / 2}>
          <SizableImage
            resizeMode="contain"
            source={require("@/assets/images/food 1.png")}
          />
        </YStack>

        <YStack width="100%" marginTop="$9" gap="$3" paddingHorizontal="$9">
          <CustomButton
            size="$5"
            backgroundColor="#6666FF"
            onPress={() => router.push("/(auth)/login")}
            textfontsize="$4"
            textfontweight="600"
          >
            Đăng nhập
          </CustomButton>
          <CustomButton
            size="$5"
            backgroundColor="#ffffff"
            onPress={() => router.push("/(auth)/signup")}
            textfontsize="$4"
            textfontweight="600"
          >
            Đăng kí
          </CustomButton>
        </YStack>

        <YStack width="100%" paddingHorizontal="$9" marginTop="$9">
          <XStack justifyContent="center" alignItems="center" gap="$2">
            <Globe size={16} color="black" />
            <ThemedSizableText fontSize="$2">{languageLabel}</ThemedSizableText>
          </XStack>
        </YStack>
      </ScrollScreenLayout>
    </>
  );
}
