import React from "react";
import { Dimensions, FlatList, Platform, View } from "react-native";
import { YStack } from "tamagui";
import { SizableImage } from "../ui/SizableImageProps";

const { width: screenWidth } = Dimensions.get("window");

const banners = [
  {
    id: "1",
    image: require("@/assets/banner/Fresh-and-healthy-vegetables-banner-design-template-scaled.jpg"),
  },
  {
    id: "2",
    image: require("@/assets/banner/banner2.jpg"),
  },
  {
    id: "3",
    image: require("@/assets/banner/banner3.jpg"),
  },
];

export const BannerCarousel = () => {
  const itemWidth = 400;
  const pixelFix = Platform.OS === "ios" ? 0 : 0;
  const separator = Math.max(screenWidth - itemWidth, 0);

  const snapInterval = itemWidth + separator;
  const halfSeparator = Math.round((separator - pixelFix) / 2);
  const aspectRatio = 3;
  const imageHeight = itemWidth / aspectRatio;

  return (
    <YStack marginTop={-32} zIndex={10}>
      <FlatList
        data={banners}
        horizontal
        pagingEnabled
        snapToInterval={snapInterval}
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={<View style={{ width: halfSeparator }} />}
        ListFooterComponent={<View style={{ width: halfSeparator }} />}
        ItemSeparatorComponent={() => <View style={{ width: separator }} />}
        contentContainerStyle={{ paddingHorizontal: 0 }}
        renderItem={({ item }) => (
          <View
            style={{
              width: itemWidth,
              height: imageHeight,
            }}
          >
            <SizableImage
              source={item.image}
              width={itemWidth}
              aspectRatio={aspectRatio}
              resizeMode="cover"
              borderRadius={14}
            />
          </View>
        )}
      />
    </YStack>
  );
};
