import { HeaderWithTabs } from "@/components/home/headerOrder";
import { ScrollScreenLayout } from "@/components/layout/ScrollScreenLayout";
import React from "react";
import { Tabs, Text, YStack } from "tamagui";

const TABS_CONTENT: Record<string, string> = {
  "Đang đến": "Các đơn hàng sắp đến.",
  "Deal đã mua": "Tất cả deal bạn đã mua.",
  "Lịch sử": "Lịch sử đơn hàng của bạn.",
  "Đánh giá": "Đơn cần đánh giá.",
  "Đơn nháp": "Đơn hàng bạn chưa hoàn tất.",
};

export default function TabsWithContent() {
  const [activeTab, setActiveTab] = React.useState("Deal đã mua");

  return (
    <ScrollScreenLayout
      backgroundColor="white"
      header={
        <HeaderWithTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      }
    >
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <YStack px="$4" py="$3" bg="white" minHeight={200}>
          {Object.entries(TABS_CONTENT).map(([tab, content]) => (
            <Tabs.Content
              key={tab}
              value={tab}
              forceMount
              display={activeTab === tab ? "flex" : "none"}
            >
              <Text fontSize="$5" color="black">
                {content}
              </Text>
            </Tabs.Content>
          ))}
        </YStack>
      </Tabs>
    </ScrollScreenLayout>
  );
}
