import React from "react";
import { Tabs, YStack, ScrollView, XStack } from "tamagui";

import { ScrollScreenLayout } from "@/components/layout/ScrollScreenLayout";
import { OrderTabsContent } from "@/components/order/ordertabscontent";
import { CustomTab } from "@/components/ui/CustomTab";
import { HeaderSetting } from "@/components/home/HeaderSetting";

const TAB_ITEMS = ["Đang đến", "Đã giao", "Lịch sử"];

export default function TabsWithContent() {
  const [activeTab, setActiveTab] = React.useState("Đang đến");

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
                forceMount
                display={activeTab === tab ? "flex" : "none"}
              >
                <OrderTabsContent forOrder={true} activeTab={tab} />
              </Tabs.Content>
            ))}
          </YStack>
        </Tabs>
      </YStack>
    </ScrollScreenLayout>
  );
}
