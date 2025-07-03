import { ScanLine, Search } from "@tamagui/lucide-icons";

import { NoFocusStyle } from "@/app/constant/inputStyles";
import { useState } from "react";
import { XStack, YStack } from "tamagui";
import { CustomInput } from "./CustomInput";

export function SearchBar() {
  const [searchText, setSearchText] = useState("");

  return (
    <XStack padding="$4" alignItems="center">
      <YStack
        height={40}
        backgroundColor="white"
        borderRadius={20}
        paddingRight={12}
        flex={1}
        position="relative"
        justifyContent="center"
        overflow="hidden"
      >
        <CustomInput
          value={searchText}
          onChangeText={setSearchText}
          placeholder="Search đi"
          paddingLeft={36}
          backgroundColor="transparent"
          borderColor="transparent"
          suffixIcon={<ScanLine size={18} color="#999" />}
          height={40}
          focusStyle={NoFocusStyle}
        />
        <SearchIconOverlay />
      </YStack>
    </XStack>
  );
}

function SearchIconOverlay() {
  return (
    <XStack
      position="absolute"
      left={12}
      top="50%"
      transform={[{ translateY: -9 }]}
      zIndex={10}
      pointerEvents="none"
    >
      <Search size={18} color="#999" />
    </XStack>
  );
}
