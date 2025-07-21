import { HeaderWithTabs } from "@/components/home/headerOrder";
import { ScrollScreenLayout } from "@/components/layout/ScrollScreenLayout";
import { OrderTabsContent } from "@/components/order/ordertabscontent";

import React from "react";
import { Tabs, YStack } from "tamagui";

const TAB_ITEMS = [
  "Đang đến",
  "Deal đã mua",
  "Lịch sử",
  "Đánh giá",
  "Đơn nháp",
];

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
          {TAB_ITEMS.map((tab) => (
            <Tabs.Content
              key={tab}
              value={tab}
              forceMount
              display={activeTab === tab ? "flex" : "none"}
            >
              <OrderTabsContent activeTab={tab} />
            </Tabs.Content>
          ))}
        </YStack>
      </Tabs>
    </ScrollScreenLayout>
  );
}
