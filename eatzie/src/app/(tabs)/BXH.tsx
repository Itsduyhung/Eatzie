import { ScrollScreenLayout } from "@/components/layout/ScrollScreenLayout";
import { ChevronRight, Moon, Sun } from "@tamagui/lucide-icons";
import { useEffect, useRef, useState } from "react";
import { Animated, Image, TouchableOpacity } from "react-native";
import { Text, View, XStack, YStack } from "tamagui";
import { HeaderGradientBackground } from "../untils/GradientBackground";

const categories = [
  { label: "Lượt đánh giá", icon: require("../../assets/icons/points.png") },
  { label: "Lượt xem", icon: require("../../assets/icons/eye.png") },
] as const;
type CategoryKey = (typeof categories)[number]["label"];

const tabs = ["Ngày", "Tuần", "Tháng", "Năm"] as const;
type TabKey = (typeof tabs)[number];

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
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryKey>("Lượt đánh giá");
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  const bgAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(bgAnim, {
      toValue: isDarkTheme ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [isDarkTheme]);

  const bgColor = bgAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["#FFFFFF", "#1C1C1E"],
  });

  const textColor = isDarkTheme ? "#FFD700" : "#111";
  const tabSelectedColor = isDarkTheme ? "#FFD700" : "#5B5FEF";
  const categorySelectedBg = isDarkTheme ? "#FFD700" : "#5B5FEF";
  const categoryUnselectedBg = isDarkTheme ? "#2C2C2E" : "#F2F4F7";
  const borderColor = isDarkTheme ? "#3C3C3C" : "#E5E7EB";

  let ranking = rankingData[tabs[selectedTab]];
  if (selectedCategory === "Lượt xem") ranking = [...ranking].reverse();

  return (
    <ScrollScreenLayout
      gradientWrapper={(children) => (
        <HeaderGradientBackground>{children}</HeaderGradientBackground>
      )}
    >
      <Animated.View style={{ flex: 1, padding: 20, backgroundColor: bgColor }}>
        <XStack
          alignItems="center"
          justifyContent="space-between"
          marginBottom={16}
        >
          <XStack alignItems="center">
            <Image
              source={require("../../assets/icons/trophy.png")}
              style={{ width: 28, height: 28, marginRight: 8 }}
            />
            <Text fontSize={26} fontWeight="700" color={textColor}>
              Bảng xếp hạng
            </Text>
          </XStack>
          <TouchableOpacity onPress={() => setIsDarkTheme(!isDarkTheme)}>
            {isDarkTheme ? (
              <Sun color="#FFD700" width={28} height={28} />
            ) : (
              <Moon color="#111" width={28} height={28} />
            )}
          </TouchableOpacity>
        </XStack>

        <XStack alignItems="center" justifyContent="center" marginBottom={16}>
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.label;
            return (
              <TouchableOpacity
                key={cat.label}
                onPress={() => setSelectedCategory(cat.label)}
                activeOpacity={0.8}
              >
                <YStack
                  width={90}
                  height={90}
                  borderRadius={16}
                  backgroundColor={
                    isSelected ? categorySelectedBg : categoryUnselectedBg
                  }
                  alignItems="center"
                  justifyContent="center"
                  marginHorizontal={12}
                  borderWidth={isSelected ? 2 : 0}
                  borderColor={isSelected ? "#3B3FCF" : "transparent"}
                >
                  <Image
                    source={cat.icon}
                    style={{
                      width: 36,
                      height: 36,
                      marginBottom: 8,
                      tintColor: isSelected ? "#fff" : undefined,
                    }}
                    resizeMode="contain"
                  />
                  <Text
                    fontSize={13}
                    fontWeight={isSelected ? "700" : "400"}
                    color={isSelected ? "#fff" : "#888"}
                    textAlign="center"
                  >
                    {cat.label}
                  </Text>
                </YStack>
              </TouchableOpacity>
            );
          })}
        </XStack>

        <XStack marginBottom={16}>
          {tabs.map((tab, idx) => {
            const isSelected = selectedTab === idx;
            return (
              <TouchableOpacity
                key={tab}
                onPress={() => setSelectedTab(idx)}
                style={{ flex: 1, alignItems: "center" }}
              >
                <YStack alignItems="center" width="100%">
                  <Text
                    fontSize={15}
                    fontWeight={isSelected ? "700" : "400"}
                    color={isSelected ? tabSelectedColor : textColor}
                  >
                    {tab}
                  </Text>
                  {isSelected && (
                    <Image
                      source={require("../../assets/icons/hinhthoi.png")}
                      style={{ width: 16, height: 8, marginTop: 2 }}
                      resizeMode="contain"
                    />
                  )}
                </YStack>
              </TouchableOpacity>
            );
          })}
        </XStack>

        <View
          style={{
            height: 1,
            backgroundColor: borderColor,
            marginBottom: 4,
          }}
        />

        <YStack>
          {ranking.map((item, idx) => (
            <XStack
              key={item.rank + "-" + item.name}
              alignItems="center"
              paddingVertical={10}
              borderBottomWidth={idx < ranking.length - 1 ? 1 : 0}
              borderColor={borderColor}
            >
              {idx < 3 ? (
                <Image
                  source={rankIcons[idx]}
                  style={{ width: 32, height: 32, marginRight: 8 }}
                />
              ) : (
                <Text
                  fontSize={22}
                  fontWeight="700"
                  color="#888"
                  width={32}
                  textAlign="center"
                >
                  {idx + 1}
                </Text>
              )}
              <Text flex={1} fontSize={16} fontWeight="500" color={textColor}>
                {item.name}
              </Text>
              <ChevronRight size={18} color={textColor} />
            </XStack>
          ))}
        </YStack>
      </Animated.View>
    </ScrollScreenLayout>
  );
};

export default BXHScreen;
