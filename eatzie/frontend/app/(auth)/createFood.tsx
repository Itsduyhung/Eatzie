import { HeaderSetting } from "@/components/home/HeaderSetting";
import { ScrollScreenLayout } from "@/components/layout/ScrollScreenLayout";
import { CustomButton } from "@/components/ui/CustomButton";
import { ImagePickerSheet } from "@/components/ui/ImagePickerSheet";
import { SizableImage } from "@/components/ui/SizableImageProps";
import { ThemedText } from "@/hooks/ThemedTextColor";
import { useFoodStore } from "@/stores/FoodStore";
import { FoodModel } from "@/types/foodCategory";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Keyboard } from "react-native";
import { Input, XStack, YStack } from "tamagui";
import { pickImageAndUpload } from "../untils/pickImageAndUpload";

export default function CreateFoodScreen() {
  const { restaurantId } = useLocalSearchParams<{ restaurantId?: string }>();
  const { addFood, loading } = useFoodStore();

  const id = Number(restaurantId);

  const [form, setForm] = useState<FoodModel>({
    name: "",
    description: "",
    image: null,
    price: 0,
    isVegetarian: false,
    categoryNames: "",
  });

  const [sheetOpen, setSheetOpen] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [sheetOpenPending, setSheetOpenPending] = useState(false);

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
    if (!id || isNaN(id)) {
      Alert.alert("Lỗi", "Không tìm thấy ID nhà hàng hợp lệ.");
      return;
    }

    if (!form.name || !form.image || !form.price) {
      Alert.alert(
        "Thiếu thông tin",
        "Vui lòng nhập đầy đủ tên, giá và ảnh món ăn."
      );
      return;
    }

    try {
      const newFood = await addFood(form, id);
      if (newFood) {
        Alert.alert("Thành công", "Tạo món ăn thành công!");
      } else {
        throw new Error("API không trả về dữ liệu món ăn");
      }
    } catch (err) {
      Alert.alert("Lỗi", "Không thể tạo món ăn. Vui lòng thử lại.");
    }
  };

  const renderInput = (
    placeholder: string,
    value: string,
    onChange: (text: string) => void,
    multiline = false,
    minHeight = 50,
    keyboardType: "default" | "numeric" = "default"
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
    />
  );

  return (
    <ScrollScreenLayout
      backgroundColor="white"
      header={<HeaderSetting nameTitle="Tạo món ăn" />}
    >
      <YStack
        backgroundColor="white"
        borderRadius={12}
        padding="$5"
        gap="$4"
        margin="$4"
      >
        {renderInput("Tên món ăn", form.name, (text) =>
          setForm((prev) => ({ ...prev, name: text }))
        )}
        {renderInput(
          "Mô tả món ăn",
          form.description ?? "",
          (text) => setForm((prev) => ({ ...prev, description: text })),
          true,
          80
        )}
        {renderInput(
          "Giá món ăn (VNĐ)",
          form.price.toString(),
          (text) => setForm((prev) => ({ ...prev, price: Number(text) || 0 })),
          false,
          50,
          "numeric"
        )}
        {renderInput(
          "Danh mục (vd: Món chính, Nước uống...)",
          form.categoryNames ?? "",
          (text) => setForm((prev) => ({ ...prev, categoryNames: text }))
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
          disabled={loading[id]}
          marginTop="$5"
          borderRadius={8}
        >
          {loading[id] ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <ThemedText color="white" fontSize="$5" fontWeight="700">
              Tạo món ăn
            </ThemedText>
          )}
        </CustomButton>
      </YStack>
    </ScrollScreenLayout>
  );
}
