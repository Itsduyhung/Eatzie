// 📁 utils/pickImageAndUpload.ts
import * as ImagePicker from "expo-image-picker";
import { Alert } from "react-native";

export const pickImageAndUpload = async (fromCamera: boolean = false) => {
  try {
    const permission = fromCamera
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permission.status !== "granted") {
      Alert.alert(
        "Thiếu quyền truy cập",
        fromCamera
          ? "Cần quyền truy cập camera để chụp ảnh."
          : "Cần quyền truy cập thư viện để chọn ảnh."
      );
      return null;
    }

    const result = fromCamera
      ? await ImagePicker.launchCameraAsync({
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        })
      : await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ["images"],
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        });

    if (!result.canceled && result.assets?.length > 0) {
      return result.assets[0].uri;
    }

    return null;
  } catch (error) {
    console.error("Lỗi chọn ảnh:", error);
    Alert.alert("Lỗi", "Không thể chọn ảnh. Vui lòng thử lại sau.");
    return null;
  }
};
