import { ScrollScreenLayout } from "@/components/layout/ScrollScreenLayout";
import { BackButton } from "@/components/ui/BackButton";
import { CustomButton } from "@/components/ui/CustomButton";
import { SizableImage } from "@/components/ui/SizableImageProps";
import { welcomeScreenData } from "@/constant/welcomeScreen";
import { ThemedText } from "@/hooks/ThemedTextColor";
import { useRouter } from "expo-router";

import { useSafeAreaInsets } from "react-native-safe-area-context";
import { YStack } from "tamagui";

export default function WelcomeScreen() {
  const router = useRouter();
  const { titleLines, description, languageLabel } = welcomeScreenData;
  const insets = useSafeAreaInsets();

  return (
    <>
      <ScrollScreenLayout
        headerLeftIcons={[<BackButton key="back" />]}
        centerContent={true}
      >
        <YStack>
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
        </YStack>
      </ScrollScreenLayout>
    </>
  );
}
