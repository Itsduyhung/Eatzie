import React from "react";
import { ScrollScreenLayout } from "@/components/layout/ScrollScreenLayout";
import { YStack, XStack, Text, View, Separator, Image } from "tamagui";

const TAB_ITEMS = [
  "Chờ xác nhận",
  "Đang giao",
  "Đã giao",
];

export default function TabsWithContent() {
  const [activeTab, setActiveTab] = React.useState("Chờ xác nhận");
  const activeIndex = TAB_ITEMS.findIndex(tab => tab === activeTab);

  return (
    <ScrollScreenLayout
      backgroundColor="white"
      header={
        <YStack py="$3">
          {/* ✅ Đây chính là title */}
          <Text top={20} color={"black"} fontSize={22} fontWeight="bold" textAlign="center">
            Đơn hàng
          </Text>

          {/* Tabs */}
          <XStack justifyContent="space-between" alignItems="center" px="$3" mt="$6">
            {TAB_ITEMS.map(tab => (
              <Text
                key={tab}
                color={activeTab === tab ? "#4F5FFF" : "#888"}
                fontWeight={activeTab === tab ? "bold" : "500"}
                fontSize={16}
                flex={1}
                textAlign="center"
                onPress={() => setActiveTab(tab)}
              >
                {tab}
              </Text>
            ))}
          </XStack>

          <XStack alignItems="center" px="$0" mt="$-6">
            {/* Thanh gạch tab dưới nếu cần */}
          </XStack>
        </YStack>
      }
    >
      {/* Nội dung danh sách đơn */}
      <YStack px="$3" py="$3" bg="white" minHeight={200}>
        <YStack backgroundColor="#fff" borderRadius={16} p="$4" shadowColor="#000" shadowOpacity={0.06} shadowRadius={8}>
          <XStack alignItems="center" px="$4" mt="$2" position="relative" height={28}>
            <View flex={0} height={2} backgroundColor="#E5E5E5" />
            <XStack position="relative" width={80} height={24} alignItems="center" justifyContent="center">
              <View width={80} height={4} backgroundColor="#4F5FFF" borderRadius={2} position="absolute" top={10} left={0} />
              <Image
                source={require("../../assets/icons/hinhthoi.png")}
                width={24}
                height={24}
                style={{ position: "absolute", top: -5, left: 28 }}
              />
            </XStack>
            <View flex={1} height={2} backgroundColor="#E5E5E5" />
          </XStack>

          {[1].map((item, idx) => (
            <XStack key={idx} alignItems="center" mb="$3" mt="$3">
              <Image
                source={require("../../assets/icons/bun-pho.png")}
                width={120}
                height={120}
                borderRadius={8}
                mr="$3"
              />
              <YStack flex={1}>
                <Text color={"black"} fontWeight="bold">Bún Bò Huế</Text>
                <Text color={"black"} fontSize={14} mt="$1">Lẩu dê Nhất Nhất</Text>
                <Text color="#888" fontSize={13}>Tô lớn</Text>
                <Text color="#888" fontSize={13}>x5</Text>
              </YStack>
              <Text fontWeight="bold" fontSize={15}>100.000đ</Text>
            </XStack>
          ))}

          <Separator />

          <XStack justifyContent="space-between" mt="$3">
            <Text fontWeight="bold" fontSize={16} color={"black"}>Tổng thanh toán</Text>
            <Text fontWeight="bold" fontSize={16} color="#4F5FFF">404.000đ</Text>
          </XStack>
        </YStack>
      </YStack>
    </ScrollScreenLayout>
  );
}
