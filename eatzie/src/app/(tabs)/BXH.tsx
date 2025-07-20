import { ScrollScreenLayout } from "@/components/layout/ScrollScreenLayout";
import { Text, YStack } from "tamagui";
import { HeaderGradientBackground } from "../untils/GradientBackground";

const bxhTab = () => {
  return (
    <ScrollScreenLayout
      gradientWrapper={(children) => (
        <HeaderGradientBackground>{children}</HeaderGradientBackground>
      )}
    >
      <YStack background="#FFFFFF">
        <Text>hello</Text>
      </YStack>
    </ScrollScreenLayout>
  );
};

export default bxhTab;
