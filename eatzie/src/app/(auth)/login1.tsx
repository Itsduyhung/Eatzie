import { ThemedScreen } from "@/components/layout/ThemedScreen";
import { BackButton } from "@/components/ui/BackButton";
import { CustomButton } from "@/components/ui/CustomButton";
import { Globe } from "@tamagui/lucide-icons";
import { useRouter } from "expo-router";
import { SizableText, XStack, YStack } from "tamagui";
import { welcomeScreenData } from "../constant/welcomeScreen";

export default function WelcomeScreen() {
  const router = useRouter();
  const { titleLines, description, languageLabel } = welcomeScreenData;

  return (
    <ThemedScreen backgroundColor="#ffffff">
      {({ textColor }) => (
        <>
          <XStack position="absolute" top="$2" left="$1">
            <BackButton />
          </XStack>

          <YStack alignItems="center" gap="$4" marginTop="$8">
            {titleLines.map((line, index) => (
              <SizableText
                key={index}
                fontSize="$8"
                fontWeight="700"
                textAlign="center"
                color={textColor}
              >
                {line}
              </SizableText>
            ))}
            <SizableText fontSize="$3" textAlign="center" color="$gray10">
              {description}
            </SizableText>
          </YStack>

          <YStack width="100%" marginTop="$20" gap="$3">
            <CustomButton
              size="$5"
              backgroundColor="black"
              onPress={() => router.push("/(auth)/login")}
            >
              Đăng nhập
            </CustomButton>
            <CustomButton
              size="$5"
              backgroundColor="white"
              borderWidth={2}
              onPress={() => router.push("/(auth)/signup")}
            >
              Đăng kí
            </CustomButton>
          </YStack>

          <XStack
            marginTop="auto"
            alignItems="center"
            alignSelf="center"
            gap="$2"
          >
            <Globe size={16} color={textColor} />
            <SizableText color={textColor} fontSize="$2">
              {languageLabel}
            </SizableText>
          </XStack>
        </>
      )}
    </ThemedScreen>
  );
}
