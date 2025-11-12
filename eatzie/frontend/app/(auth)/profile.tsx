import { useAuthStore } from "@/applicaton/stores/authStores";
import { HeaderSetting } from "@/components/home/HeaderSetting";
import { ScrollScreenLayout } from "@/components/layout/ScrollScreenLayout";
import { CustomButton } from "@/components/ui/CustomButton";
import { SettingData } from "@/constant/ProfileData";
import { ChevronRight } from "@tamagui/lucide-icons";
import { useLocalSearchParams, useRouter } from "expo-router";

import { Text, XStack, YStack } from "tamagui";

const SettingAuth1 = () => {
  const router = useRouter();
  const { title } = useLocalSearchParams();

  return (
    <>
      <ScrollScreenLayout
        header={<HeaderSetting nameTitle={title as string} />}
        headerBackgroundColor="white"
      >
        <YStack backgroundColor="#F5F5F5" flex={1}>
          <YStack>
            {SettingData.map((section, sectionIndex) => (
              <YStack key={sectionIndex}>
                <Text padding="$4" color="#888">
                  {section.title}
                </Text>

                {section.items.map((item, index) => (
                  <YStack key={index}>
                    <CustomButton
                      backgroundColor="#FFFFFF"
                      onPress={() => router.push(item.path as any)}
                      paddingVertical="$4"
                      marginHorizontal="$2"
                    >
                      <XStack
                        width="100%"
                        alignItems="center"
                        justifyContent="space-between"
                      >
                        <Text fontSize="$5" color="#000">
                          {item.content}
                        </Text>
                        <ChevronRight size={20} color="#000" />
                      </XStack>
                    </CustomButton>

                    {index !== section.items.length - 1 && (
                      <YStack
                        height={1}
                        backgroundColor="#E0E0E0"
                        marginHorizontal="$3"
                      />
                    )}
                  </YStack>
                ))}
              </YStack>
            ))}
          </YStack>

          <YStack marginTop="auto" padding="$2" marginBottom="$6">
            <CustomButton
              backgroundColor="#FFFFFF"
              onPress={() => useAuthStore.getState().logout()}
              paddingVertical="$2"
              marginHorizontal="$1"
              textfontsize="$5"
            >
              Đăng xuất
            </CustomButton>
          </YStack>
        </YStack>
      </ScrollScreenLayout>
    </>
  );
};

export default SettingAuth1;
