import React from "react";
import { YStack } from "tamagui";
import { Image } from "react-native";
import { SearchBar } from "../ui/CustomSearchInput";
import { LocationBar } from "../ui/LocationBar";

const HeaderHome = () => {
  return (
    <YStack width="100%" height={180} position="relative" justifyContent="center" alignItems="center" backgroundColor="#F8FAFC">
      {/* Layered header images */}
      <Image
        source={require('@/assets/images/header.png')}
        style={{ position: 'absolute', width: '100%', height: 180, top: 0, left: 0 }}
        resizeMode="cover"
      />
      <Image
        source={require('@/assets/images/good.png')}
        style={{ position: 'absolute', top: 32, left: 24, width: 120, height: 40 }}
        resizeMode="contain"
      />
      <Image
        source={require('@/assets/images/morning.png')}
        style={{ position: 'absolute', top: 32, right: 24, width: 160, height: 40 }}
        resizeMode="contain"
      />
      <Image
        source={require('@/assets/icons/hinhthoi.png')}
        style={{ position: 'absolute', top: 24, left: '50%', marginLeft: -40, width: 80, height: 80, opacity: 0.2 }}
        resizeMode="contain"
      />
      {/* Search bar and location bar */}
      <YStack position="absolute" bottom={12} left={0} right={0} px={20}>
        <LocationBar />
        <SearchBar />
      </YStack>
    </YStack>
  );
};

export default HeaderHome;
