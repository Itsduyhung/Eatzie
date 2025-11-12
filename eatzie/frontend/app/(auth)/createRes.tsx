import { HeaderSetting } from "@/components/home/HeaderSetting";
import { ScrollScreenLayout } from "@/components/layout/ScrollScreenLayout";
import { CustomButton } from "@/components/ui/CustomButton";
import { ImagePickerSheet } from "@/components/ui/ImagePickerSheet";
import { SizableImage } from "@/components/ui/SizableImageProps";
import { ThemedText } from "@/hooks/ThemedTextColor";

import { useRestaurantStore } from "@/stores/restaurantStore";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { Alert, Keyboard, Modal } from "react-native";
import { Input, XStack, YStack } from "tamagui";
import MapPickerScreen from "../(features)/map/MapPickerScreen";
import { pickImageAndUpload } from "../untils/pickImageAndUpload";

export default function AuthResScreen() {
  const { createRestaurant, loading } = useRestaurantStore();

  const [form, setForm] = useState({
    name: "",
    description: "",
    address: "",
    phone: "",
    image: "",
    lat: 0,
    lng: 0,
    status: "ACTIVE",
  });

  const [sheetOpen, setSheetOpen] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [sheetOpenPending, setSheetOpenPending] = useState(false);

  const [mapVisible, setMapVisible] = useState(false); // kiểm soát map modal

  useEffect(() => {
    if (!isInputFocused && sheetOpenPending) {
      setSheetOpen(true);
      setSheetOpenPending(false);
    }
  }, [isInputFocused, sheetOpenPending]);

  const handleAddImagePress = () => {
    if (isInputFocused) {
      Keyboard.dismiss();
      setSheetOpenPending(true);
      return;
    }
    setSheetOpen(true);
  };

  const onPickImage = async (fromCamera: boolean) => {
    const uri = await pickImageAndUpload(fromCamera);
    if (uri) setForm((prev) => ({ ...prev, image: uri }));
  };

  const handleSubmit = async () => {
    if (!form.name || !form.address || !form.image) {
      Alert.alert(
        "Thiếu thông tin",
        "Vui lòng nhập đầy đủ tên, địa chỉ và ảnh."
      );
      return;
    }

    try {
      await createRestaurant(form);
      Alert.alert("Thành công", "Tạo nhà hàng thành công!");
    } catch {
      Alert.alert("Lỗi", "Không thể tạo nhà hàng. Vui lòng thử lại.");
    }
  };

  const renderInput = (
    placeholder: string,
    value: string,
    onChange: (text: string) => void,
    multiline = false,
    minHeight = 50,
    keyboardType: "default" | "phone-pad" = "default",
    onPress?: () => void // thêm onPress cho input đặc biệt (ví dụ chọn map)
  ) => (
    <Input
      placeholder={placeholder}
      placeholderTextColor="#999"
      value={value}
      onChangeText={onChange}
      multiline={multiline}
      minHeight={minHeight}
      keyboardType={keyboardType}
      onFocus={() => setIsInputFocused(true)}
      onBlur={() => setIsInputFocused(false)}
      backgroundColor="white"
      color="black"
      borderWidth={1}
      borderColor="$gray6"
      borderRadius={8}
      padding="$3"
      onTouchStart={onPress} // sử dụng onTouchStart để mở map modal
    />
  );

  return (
    <ScrollScreenLayout
      backgroundColor="white"
      header={<HeaderSetting nameTitle=" Tạo Nhà Hàng" />}
    >
      <YStack
        backgroundColor="white"
        borderRadius={12}
        padding="$5"
        gap="$4"
        margin="$4"
      >
        {renderInput("Tên nhà hàng", form.name, (text) =>
          setForm((prev) => ({ ...prev, name: text }))
        )}
        {renderInput(
          "Mô tả",
          form.description,
          (text) => setForm((prev) => ({ ...prev, description: text })),
          true,
          80
        )}
        {renderInput(
          "Địa chỉ",
          form.address,
          (text) => setForm((prev) => ({ ...prev, address: text })),
          false,
          50,
          "default",
          () => setMapVisible(true) // mở map picker khi click vào input
        )}
        {renderInput(
          "Số điện thoại",
          form.phone,
          (text) => setForm((prev) => ({ ...prev, phone: text })),
          false,
          50,
          "phone-pad"
        )}

        <XStack alignItems="center" gap="$3" marginTop="$2" flexWrap="wrap">
          {form.image && (
            <SizableImage
              source={{ uri: form.image }}
              resizeMode="cover"
              style={{ width: 120, height: 100, borderRadius: 8 }}
            />
          )}

          <CustomButton
            borderWidth={1}
            borderColor="$gray10"
            onPress={handleAddImagePress}
            paddingVertical="$5"
            paddingHorizontal="$5"
          >
            <YStack justifyContent="center" alignItems="center" gap="$2">
              <Ionicons name="camera-outline" size={35} color="black" />
              <ThemedText fontSize="$4" fontWeight="600" fontFamily="$mono">
                Thêm ảnh
              </ThemedText>
            </YStack>
          </CustomButton>

          <ImagePickerSheet
            open={sheetOpen}
            onOpenChange={setSheetOpen}
            onPickCamera={() => {
              onPickImage(true);
              setSheetOpen(false);
            }}
            onPickLibrary={() => {
              onPickImage(false);
              setSheetOpen(false);
            }}
          />
        </XStack>

        <CustomButton
          backgroundColor="#6666FF"
          onPress={handleSubmit}
          disabled={loading}
          marginTop="$5"
          borderRadius={8}
        >
          <ThemedText color="white" fontSize="$5" fontWeight="700">
            {loading ? "Đang tạo..." : "Tạo nhà hàng"}
          </ThemedText>
        </CustomButton>
      </YStack>

      <Modal visible={mapVisible} animationType="slide">
        <MapPickerScreen
          initialLat={form.lat}
          initialLon={form.lng}
          onSelectLocation={(lat, lng, addr) => {
            setForm((prev) => ({ ...prev, lat, lng, address: addr }));
            setMapVisible(false);
          }}
        />
      </Modal>
    </ScrollScreenLayout>
  );
}
