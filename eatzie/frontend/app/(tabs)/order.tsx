// TabsWithContent.tsx
import React, { useState } from "react";
import { Tabs, XStack, YStack } from "tamagui";

import { HeaderSetting } from "@/components/home/HeaderSetting";
import { ScrollScreenLayout } from "@/components/layout/ScrollScreenLayout";
import { OrderTabsContent } from "@/components/order/ordertabscontent";
import { CustomTab } from "@/components/ui/CustomTab";
import { useCartStore } from "@/stores/useCartStore";

const TAB_ITEMS = ["Đang đến", "Đã giao", "Lịch sử"];

export default function TabsWithContent() {
  const [activeTab, setActiveTab] = useState("Đang đến");
  const cartSnapshots = useCartStore((s) => s.cartSnapshots);

  // Lấy tất cả orderId từ cartSnapshots
  const allOrderIds = cartSnapshots
    .map((s) => s.orderId)
    .filter(Boolean) as number[];

  return (
    <ScrollScreenLayout
      backgroundColor="white"
      header={<HeaderSetting nameTitle="Đơn hàng" order={true} />}
    >
      <YStack backgroundColor="#F5F5F5">
        <Tabs
          flexDirection="column"
          value={activeTab}
          onValueChange={setActiveTab}
          gap="$3"
        >
          <YStack paddingHorizontal="$3" backgroundColor="white">
            <Tabs.List justifyContent="space-around">
              <XStack width="100%" justifyContent="space-between">
                {TAB_ITEMS.map((tab) => (
                  <CustomTab
                    key={tab}
                    value={tab}
                    label={tab}
                    active={activeTab === tab}
                    style={{
                      backgroundColor:
                        activeTab === tab ? "white" : "transparent",
                    }}
                  />
                ))}
              </XStack>
            </Tabs.List>
          </YStack>

          <YStack px="$2" gap="$2" my="$2" minHeight={200}>
            {TAB_ITEMS.map((tab) => (
              <Tabs.Content
                key={tab}
                value={tab}
                display={activeTab === tab ? "flex" : "none"}
              >
                <OrderTabsContent
                  key={tab}
                  forOrder={true}
                  activeTab={tab}
                  orderIds={allOrderIds} // chỉ truyền orderId
                />
              </Tabs.Content>
            ))}
          </YStack>
        </Tabs>
      </YStack>
    </ScrollScreenLayout>
  );
}
