import { useAuthStore } from "@/applicaton/stores/authStores";
import { HeaderProfile } from "@/components/home/Header";
import { ScrollScreenLayout } from "@/components/layout/ScrollScreenLayout";
import { CustomButton } from "@/components/ui/CustomButton";
import { ChevronRight } from "@tamagui/lucide-icons";
import { useRouter } from "expo-router";
import { Text, XStack, YStack } from "tamagui";
import { ProfileData } from "../constant/ProfileData";
import { HeaderGradientBackground } from "../untils/GradientBackground";

const AccountTab = () => {
  const user = useAuthStore((state) => state.user);
  const router = useRouter();
  return (
    <ScrollScreenLayout
      header={<HeaderProfile />}
      gradientWrapper={(children) => (
        <HeaderGradientBackground>{children}</HeaderGradientBackground>
      )}
    >
      <YStack background="#FFFFFF">
        {user?.userId === "8" && (
          <YStack padding="$6" gap="$3">
            {ProfileData.map((item, index) => {
              const Icon = item.iconComponent as React.ComponentType<any>;

              return (
                <CustomButton
                  key={index}
                  backgroundColor="#FFFFFF"
                  onPress={() => {
                    router.push({
                      pathname: "/(tabs)/order",
                      params: { title: item.title },
                    });
                  }}
                  paddingVertical="$4"
                >
                  <XStack
                    width="100%"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <XStack alignItems="center" gap="$3">
                      {Icon && <Icon {...item.iconProps} color="#000" />}
                      <Text fontSize="$5" color="#000">
                        {item.title}
                      </Text>
                    </XStack>
                    <ChevronRight size={20} color="#000" />
                  </XStack>
                </CustomButton>
              );
            })}
          </YStack>
        )}
      </YStack>
    </ScrollScreenLayout>
  );
};

export default AccountTab;
