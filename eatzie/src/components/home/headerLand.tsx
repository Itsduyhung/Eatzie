import React from "react";
import { YStack } from "tamagui";

import { SearchBar } from "../ui/CustomSearchInput";
import { LocationBar } from "../ui/LocationBar";

const HeaderLand = () => {
  const hotsearches = [
    "Pizza ngon nhất gần bạn",
    "Bún bò Huế đặc biệt",
    "Gà rán KFC",
    "Cà phê sữa đá",
  ];
  return (
    <YStack
      width="100%"
      height={100}
      position="relative"
      justifyContent="center"
      alignItems="center"
    >
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

export default HeaderLand;
