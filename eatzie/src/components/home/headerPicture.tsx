import React from "react";
import { Image } from "react-native";
import { YStack } from "tamagui";
import { SearchBar } from "../ui/CustomSearchInput";
import { LocationBar } from "../ui/LocationBar";

const HeaderHome1 = () => {
  return (
    <YStack
      width="100%"
      height={100}
      position="relative"
      justifyContent="center"
      alignItems="center"
    >
      {/* Logo trái */}
      <Image
        source={require("@/assets/images/good.png")}
        style={{
          position: "absolute",
          top: 16, // ⬅️ gần giữa hơn
          left: 100,
          width: 70, // ⬅️ nhỏ hơn
          height: 24,
        }}
        resizeMode="contain"
      />

      {/* Logo phải */}
      <Image
        source={require("@/assets/images/morning.png")}
        style={{
          position: "absolute",
          top: 16, // ⬅️ thấp hơn tí
          right: 80,
          width: 100, // ⬅️ nhỏ hơn
          height: 24,
        }}
        resizeMode="contain"
      />

      <Image
        source={require("@/assets/icons/hinhthoi.png")}
        style={{
          position: "absolute",
          top: 6,
          left: "50%",
          marginLeft: -25,
          width: 50,
          height: 50,
          opacity: 0.12,
        }}
        resizeMode="contain"
      />

      <YStack
        gap={8}
        position="absolute"
        bottom={8}
        left={-20}
        right={-20}
        px={14}
      >
        <LocationBar />
        <SearchBar />
      </YStack>
    </YStack>
  );
};

export default HeaderHome1;
