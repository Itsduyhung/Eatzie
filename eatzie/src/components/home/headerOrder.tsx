import React from "react";
import { ThemedText } from "@/app/hooks/ThemedTextColor";
import { FontAwesome } from "@expo/vector-icons";
import { Tabs, Text, YStack, XStack, ScrollView } from "tamagui";

const TAB_ITEMS = [
  { key: "coming", label: "Đang đến" },
  { key: "deal", label: "Deal đã mua" },
  { key: "history", label: "Lịch sử" },
  { key: "review", label: "Đánh giá" },
  { key: "draft", label: "Đơn nháp" },
];

type Props = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
};

export const HeaderWithTabs = ({ activeTab, setActiveTab }: Props) => {
  return (
    <YStack bg="white" px="$3">
      {/* Header */}
      <XStack
        position="relative"
        alignItems="center"
        justifyContent="center"
        height={50}
      >
        <ThemedText
          style={{
            fontSize: 20,
            fontWeight: "700",
            textAlign: "center",
            position: "absolute",
            left: 0,
            right: 0,
          }}
        >
          Đơn hàng
        </ThemedText>

        <XStack position="absolute" right="$2">
          <FontAwesome name="search" size={20} color="#f94c43" />
        </XStack>
      </XStack>

      {/* Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          orientation="horizontal"
          flexDirection="column"
          flex={1}
          backgroundColor="white"
        >
          <Tabs.List
            backgroundColor="white"
            justifyContent="space-around"
            borderBottomWidth={1}
            borderBottomColor="#eee"
          >
            {TAB_ITEMS.map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <Tabs.Tab
                  key={tab.key}
                  value={tab.key}
                  onPress={() => setActiveTab(tab.key)}
                  unstyled
                  backgroundColor="transparent"
                  hoverStyle={{ backgroundColor: "transparent" }}
                  focusStyle={{ backgroundColor: "transparent" }}
                  pressStyle={{ opacity: 0.7 }}
                  {...{
                    "data-[state=active]": {
                      backgroundColor: "transparent", // ✅ tắt active background
                    },
                  }}
                >
                  <YStack alignItems="center">
                    <Text
                      fontSize="$5"
                      fontWeight="600"
                      color={isActive ? "#43f970ff" : "#555"}
                    >
                      {tab.label}
                    </Text>
                    {isActive && (
                      <YStack
                        mt="$1"
                        height={3}
                        width="60%"
                        backgroundColor="#f94c43"
                        borderRadius={9999}
                      />
                    )}
                  </YStack>
                </Tabs.Tab>
              );
            })}
          </Tabs.List>

          {/* Tab content */}
          {TAB_ITEMS.map((tab) => (
            <Tabs.Content
              key={tab.key}
              value={tab.key}
              flex={1}
              alignItems="center"
              justifyContent="center"
              paddingVertical="$4"
            >
              <Text fontSize="$6" color="#333">
                {tab.label} content
              </Text>
            </Tabs.Content>
          ))}
        </Tabs>
      </ScrollView>
    </YStack>
  );
};
