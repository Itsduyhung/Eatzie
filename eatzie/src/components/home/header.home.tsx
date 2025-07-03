import React from "react";

import { YStack } from "tamagui";
import { SearchBar } from "../ui/CustomSearchInput";
import { LocationBar } from "../ui/LocationBar";

const HeaderHome = () => {
  return (
    <YStack>
      <LocationBar />
      <SearchBar />
    </YStack>
  );
};

export default HeaderHome;
