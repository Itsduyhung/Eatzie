import { ThemedText } from "@/app/hooks/ThemedTextColor";
import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ScrollView, Text, XStack, YStack } from "tamagui";

const TAB_ITEMS = [
  "Đang đến",
  "Deal đã mua",
  "Lịch sử",
  "Đánh giá",
  "Đơn nháp",
];

type Props = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
};

export const HeaderWithTabs = ({ activeTab, setActiveTab }: Props) => {
  const insets = useSafeAreaInsets();

  return (
    <YStack pt={insets.top + 10} px="$3" bg="white">
      <XStack
        position="relative"
        alignItems="center"
        justifyContent="center"
        height={50}
      >
        {/* Chữ ở giữa */}
        <ThemedText
          style={{
            fontSize: 20,
            fontWeight: "700",
            textAlign: "center",
            position: "absolute",
            left: 0,
            right: 0,
            textAlignVertical: "center",
          }}
        >
          Đơn hàng
        </ThemedText>

        <XStack position="absolute" right="$2">
          <FontAwesome name="search" size={20} color="#f94c43" />
        </XStack>
      </XStack>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <XStack gap="$5" pb="$1">
          {TAB_ITEMS.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <YStack
                key={tab}
                alignItems="center"
                onPress={() => setActiveTab(tab)}
                pressStyle={{ opacity: 0.7 }}
              >
                <Text
                  fontSize="$5"
                  fontWeight="600"
                  color={isActive ? "#f94c43" : "#555"}
                >
                  {tab}
                </Text>
                {isActive && (
                  <YStack
                    h={3}
                    w="80%"
                    bg="#f94c43"
                    borderRadius={9999}
                    mt="$1"
                  />
                )}
              </YStack>
            );
          })}
        </XStack>
      </ScrollView>
    </YStack>
  );
};
