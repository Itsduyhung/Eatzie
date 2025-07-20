import { ScrollScreenLayout } from "@/components/layout/ScrollScreenLayout";
import { Text, YStack, XStack, View } from "tamagui";
import { HeaderGradientBackground } from "../untils/GradientBackground";
import { useState } from "react";
import { ChevronDown, ChevronRight } from '@tamagui/lucide-icons';
import { Image, TouchableOpacity, Dimensions } from "react-native";

const categories = [
  { label: "Lượt đánh giá", icon: require('../../assets/icons/points.png') },
  { label: "Lượt xem", icon: require('../../assets/icons/eye.png') },
] as const;
type CategoryKey = typeof categories[number]["label"];

const tabs = ["Ngày", "Tuần", "Tháng", "Năm"] as const;
type TabKey = typeof tabs[number];

const rankingData: Record<TabKey, { rank: number; name: string }[]> = {
  Ngày: [
    { rank: 1, name: "Phở bắc gia truyền Nam Định" },
    { rank: 2, name: "Bún Bò Huế" },
    { rank: 3, name: "Bánh mì truyền thống" },
    { rank: 4, name: "Cơm tấm Sài Gòn" },
    { rank: 5, name: "Lẩu 1 người" },
  ],
  Tuần: [
    { rank: 1, name: "KFC" },
    { rank: 2, name: "Gà ủ muối" },
    { rank: 3, name: "Spaghetti" },
    { rank: 4, name: "Bún bò Huế" },
    { rank: 5, name: "Mỳ cay Seoul" },
  ],
  Tháng: [
    { rank: 1, name: "Bún bò Huế" },
    { rank: 2, name: "Cháo lòng bánh hỏi" },
    { rank: 3, name: "Bánh xèo" },
    { rank: 4, name: "Bánh tráng trộn" },
    { rank: 5, name: "Dookki" },
  ],
  Năm: [
    { rank: 1, name: "Cơm gà Mỹ Tâm" },
    { rank: 2, name: "Bánh canh chả cá" },
    { rank: 3, name: "Bún chả Hà Nội" },
    { rank: 4, name: "Bánh bèo chén" },
    { rank: 5, name: "Bánh đa cá" },
  ],
};

const rankIcons = [
  require("../../assets/icons/ranking1.png"),
  require("../../assets/icons/ranking2.png"),
  require("../../assets/icons/ranking3.png"),
];

const BXHScreen = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey>('Lượt đánh giá');
  const screenWidth = Dimensions.get('window').width;
  let ranking = rankingData[tabs[selectedTab]];
  if (selectedCategory === 'Lượt xem') {
    ranking = [...ranking].reverse();
  }
  return (
    <ScrollScreenLayout
      gradientWrapper={(children) => (
        <HeaderGradientBackground>{children}</HeaderGradientBackground>
      )}
    >
      <YStack background="#FFFFFF" flex={1} padding={20}>
        {/* Title with trophy icon */}
        <XStack alignItems="center" marginBottom={16}>
          <Image source={require('../../assets/icons/trophy.png')} style={{ width: 28, height: 28, marginRight: 8 }} />
          <Text fontSize={26} fontWeight="700" color="#111">Bảng xếp hạng</Text>
        </XStack>
        {/* Danh mục */}
        <XStack alignItems="center" justifyContent="center" marginBottom={16}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat.label}
              onPress={() => setSelectedCategory(cat.label)}
              activeOpacity={0.8}
            >
              <YStack
                width={90}
                height={90}
                borderRadius={16}
                backgroundColor={selectedCategory === cat.label ? '#E5E7EB' : '#F2F4F7'}
                alignItems="center"
                justifyContent="center"
                marginHorizontal={12}
                borderWidth={selectedCategory === cat.label ? 2 : 0}
                borderColor={selectedCategory === cat.label ? '#5B5FEF' : 'transparent'}
              >
                <Image source={cat.icon} style={{ width: 36, height: 36, marginBottom: 8 }} resizeMode="contain" />
                <Text fontSize={13} color="#888" textAlign="center">{cat.label}</Text>
              </YStack>
            </TouchableOpacity>
          ))}
        </XStack>
        {/* Tabs */}
        <XStack marginBottom={16}>
          {tabs.map((tab, idx) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setSelectedTab(idx)}
              style={{ flex: 1, alignItems: 'center' }}
            >
              <YStack alignItems="center" width="100%">
                <Text
                  fontSize={15}
                  fontWeight={selectedTab === idx ? "700" : "400"}
                  color={selectedTab === idx ? "#5B5FEF" : "#111"}
                >
                  {tab}
                </Text>
                {selectedTab === idx && (
                  <Image
                    source={require('../../assets/icons/hinhthoi.png')}
                    style={{ width: 16, height: 8, marginTop: 2 }}
                    resizeMode="contain"
                  />
                )}
              </YStack>
            </TouchableOpacity>
          ))}
        </XStack>
        {/* Đường kẻ ngang phân cách */}
        <View style={{ height: 1, backgroundColor: '#E5E7EB', marginBottom: 4 }} />
        {/* Danh sách xếp hạng */}
        <YStack>
          {ranking.map((item: { rank: number; name: string }, idx: number) => (
            <XStack
              key={item.rank + '-' + item.name}
              alignItems="center"
              paddingVertical={10}
              borderBottomWidth={idx < ranking.length - 1 ? 1 : 0}
              borderColor="#E5E7EB"
              space
            >
              {idx < 3 ? (
                <Image
                  source={rankIcons[idx]}
                  style={{ width: 32, height: 32, marginRight: 8 }}
                />
              ) : (
                <Text fontSize={22} fontWeight="700" color="#888" width={32} textAlign="center">{idx + 1}</Text>
              )}
              <Text flex={1} fontSize={16} fontWeight="500" color="#111">{item.name}</Text>
              <ChevronRight size={18} color="#888" />
            </XStack>
          ))}
        </YStack>
      </YStack>
    </ScrollScreenLayout>
  );
};

export default BXHScreen;
