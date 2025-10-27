import { useState } from "react";
import { Pressable } from "react-native";
import { ScrollView, XStack, YStack, Text } from "tamagui";

type Tab = {
  key: string;
  label: string;
};

type FilterTabBarProps = {
  tabs: Tab[];
  initialTabKey?: string;
  onTabChange?: (key: string) => void;
};

export const FilterTabBar = ({
  tabs,
  initialTabKey,
  onTabChange,
}: FilterTabBarProps) => {
  const [selectedTab, setSelectedTab] = useState(initialTabKey || tabs[0]?.key);

  const handlePress = (key: string) => {
    setSelectedTab(key);
    onTabChange?.(key);
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        paddingHorizontal: 20,
        paddingVertical: 25,
      }}
      style={{
        backgroundColor: "white",
      }}
    >
      <XStack gap="$4" alignItems="center">
        {tabs.map((tab) => (
          <Pressable
            key={tab.key}
            onPress={() => handlePress(tab.key)}
            hitSlop={10}
          >
            <YStack alignItems="center">
              <Text
                fontWeight="00"
                fontSize={15}
                color={selectedTab === tab.key ? "$blue11Light" : "$gray10"}
              >
                {tab.label}
              </Text>
            </YStack>
          </Pressable>
        ))}
      </XStack>
    </ScrollView>
  );
};
