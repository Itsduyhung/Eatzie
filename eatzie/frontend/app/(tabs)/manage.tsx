import React from "react";

import { HeaderSetting } from "@/components/home/HeaderSetting";
import { ScrollScreenLayout } from "@/components/layout/ScrollScreenLayout";
import { CustomButton } from "@/components/ui/CustomButton";
import { ThemedText } from "@/hooks/ThemedTextColor";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { XStack, YStack } from "tamagui";

const ManageStored = () => {
  const router = useRouter();
  return (
    <ScrollScreenLayout
      backgroundColor="white"
      header={<HeaderSetting order={true} nameTitle="Quản lý quán ăn " />}
    >
      <YStack px="$5" mt="$10" gap="$8">
        <CustomButton
          size="$5"
          backgroundColor="#6666FF"
          onPress={() => router.push("/(auth)/createRes")}
          textfontsize="$4"
          textfontweight="600"
        >
          <XStack gap="$3" alignItems="center">
            <ThemedText
              style={{
                fontSize: 18,
                fontWeight: "200",
                textAlign: "center",
                color: "white",
              }}
            >
              Thêm quán ăn
            </ThemedText>
            <Ionicons name="add" size={20} color="white" />
          </XStack>
        </CustomButton>

        <CustomButton
          size="$5"
          backgroundColor="#6666FF"
          onPress={() =>
            router.push({
              pathname: "/(auth)/createFood",
              params: { restaurantId: "16" },
            })
          }
          textfontsize="$4"
          textfontweight="600"
        >
          <XStack gap="$3" alignItems="center">
            <ThemedText
              style={{
                fontSize: 18,
                fontWeight: "200",
                textAlign: "center",
                color: "white",
              }}
            >
              Thêm món ăn
            </ThemedText>
            <Ionicons name="add" size={20} color="white" />
          </XStack>
        </CustomButton>
      </YStack>
    </ScrollScreenLayout>
  );
};

export default ManageStored;
