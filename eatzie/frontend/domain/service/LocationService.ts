import * as Location from "expo-location";
import { Alert, Linking, Platform } from "react-native";

export class LocationService {
  static async checkLocationPermission(): Promise<boolean> {
    const { status } = await Location.getForegroundPermissionsAsync();
    if (status === "granted") return true;

    const { status: requestStatus } =
      await Location.requestForegroundPermissionsAsync();
    if (requestStatus === "granted") return true;

    Alert.alert(
      "Quyền vị trí bị từ chối",
      "Ứng dụng cần quyền vị trí để định vị bản đồ.\nBạn có muốn mở cài đặt để cấp quyền?",
      [
        { text: "Huỷ", style: "cancel" },
        {
          text: "Mở cài đặt",
          onPress: () => {
            if (Platform.OS === "ios") Linking.openURL("app-settings:");
            else Linking.openSettings();
          },
        },
      ]
    );
    return false;
  }

  static async getCurrentPosition(): Promise<{
    latitude: number;
    longitude: number;
  } | null> {
    try {
      const hasPermission = await this.checkLocationPermission();
      if (!hasPermission) return null;

      const location = await Location.getCurrentPositionAsync({});
      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
    } catch (err) {
      console.error("LocationService getCurrentPosition error:", err);
      return null;
    }
  }
}
