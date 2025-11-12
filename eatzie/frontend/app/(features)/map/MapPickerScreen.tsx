import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Dimensions,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import MapView, { Marker, Region } from "react-native-maps";
import { Button, Input, XStack, YStack } from "tamagui";

import { LocationService } from "@/domain/service/LocationService";
import { MapService } from "@/domain/service/MapService";

const { width, height } = Dimensions.get("window");

interface MapPickerProps {
  initialLat?: number;
  initialLon?: number;
  onSelectLocation: (lat: number, lon: number, address: string) => void;
}

export default function MapPickerScreen({
  initialLat = 21.028333,
  initialLon = 105.854444,
  onSelectLocation,
}: MapPickerProps) {
  const [address, setAddress] = useState("");
  const [region, setRegion] = useState<Region>({
    latitude: initialLat,
    longitude: initialLon,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });
  const [marker, setMarker] = useState({
    latitude: initialLat,
    longitude: initialLon,
  });

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const searchAddress = async () => {
    if (!address.trim()) return;
    const place = await MapService.searchAddress(address.trim());
    if (place?.lat != null && place?.lon != null) {
      setMarker({ latitude: place.lat, longitude: place.lon });
      setRegion((prev) => ({
        ...prev,
        latitude: place.lat,
        longitude: place.lon,
      }));
    } else {
      Alert.alert("Không tìm thấy địa chỉ");
    }
  };

  const onChangeAddress = (text: string) => {
    setAddress(text);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => searchAddress(), 800);
  };

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const locateCurrentPosition = async () => {
    const pos = await LocationService.getCurrentPosition();
    if (!pos) return;

    setMarker({ latitude: pos.latitude, longitude: pos.longitude });
    setRegion((prev) => ({
      ...prev,
      latitude: pos.latitude,
      longitude: pos.longitude,
    }));

    const place = await MapService.reverseGeocode(pos.latitude, pos.longitude);
    if (place?.display_name) setAddress(place.display_name);
  };

  const onMarkerDragEnd = async (e: any) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setMarker({ latitude, longitude });

    const place = await MapService.reverseGeocode(latitude, longitude);
    if (place?.display_name) setAddress(place.display_name);
  };

  const onMapPress = async (e: any) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setMarker({ latitude, longitude });

    const place = await MapService.reverseGeocode(latitude, longitude);
    if (place?.display_name) setAddress(place.display_name);
  };

  const confirmLocation = () => {
    onSelectLocation(marker.latitude, marker.longitude, address);
  };

  return (
    <YStack flex={1} paddingTop={StatusBar.currentHeight || 20}>
      <XStack padding="$3" gap="$2">
        <Input
          placeholder="Nhập địa chỉ"
          value={address}
          onChangeText={onChangeAddress}
          flex={1}
          backgroundColor="white"
          borderRadius={8}
          padding="$3"
          color="black"
        />
        <Button backgroundColor="#6666FF" color="white" onPress={searchAddress}>
          Tìm
        </Button>
      </XStack>

      <TouchableOpacity
        style={styles.locateButton}
        onPress={locateCurrentPosition}
      >
        <Ionicons name="locate-outline" size={28} color="white" />
      </TouchableOpacity>

      <MapView style={{ flex: 1 }} region={region} onPress={onMapPress}>
        <Marker coordinate={marker} draggable onDragEnd={onMarkerDragEnd} />
      </MapView>

      <Button
        borderRadius={0}
        backgroundColor="$green10"
        onPress={confirmLocation}
      >
        Chọn vị trí này
      </Button>
    </YStack>
  );
}

const styles = StyleSheet.create({
  locateButton: {
    position: "absolute",
    top: (StatusBar.currentHeight || 20) + 80,
    left: 15,
    backgroundColor: "#1E90FF",
    borderRadius: 50,
    padding: 10,
    zIndex: 10,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
});
