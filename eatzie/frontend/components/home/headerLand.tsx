import React, { useState } from "react";
import { Modal } from "react-native";
import { YStack } from "tamagui";

import MapPickerScreen from "@/app/(features)/map/MapPickerScreen";

import { useLocationStore } from "@/stores/locationStores";
import { SearchBar } from "../ui/CustomSearchInput";
import { LocationBar } from "../ui/LocationBar";

const HeaderLand = () => {
  const { lat, lon, address, setLocation } = useLocationStore();
  const [showMap, setShowMap] = useState(false);

  return (
    <YStack
      width="100%"
      height={100}
      position="relative"
      justifyContent="center"
      alignItems="center"
    >
      <Modal visible={showMap} animationType="slide" transparent={false}>
        <MapPickerScreen
          initialLat={lat || 16.0544}
          initialLon={lon || 108.2022}
          onSelectLocation={(newLat, newLon, newAddress) => {
            setLocation(newLat, newLon, newAddress);
            setShowMap(false);
          }}
        />
      </Modal>

      <YStack gap={8} position="absolute" bottom={8} left={0} right={0} px={14}>
        <LocationBar
          locationName={address || "Chọn vị trí"}
          onPress={() => setShowMap(true)}
        />
        <SearchBar />
      </YStack>
    </YStack>
  );
};

export default HeaderLand;
