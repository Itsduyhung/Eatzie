// screens/TestImagePickerUpload.tsx
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import { ActivityIndicator, Alert } from "react-native";
import { Avatar, YStack } from "tamagui";

import { useAuthStore } from "@/applicaton/stores/authStores";
import { HeaderSetting } from "@/components/home/HeaderSetting";
import { ScrollScreenLayout } from "@/components/layout/ScrollScreenLayout";
import { ProfileItemDetail } from "@/components/ui/ItemProfile";
import { ProfileService } from "@/domain/service/ProfileService";
import { useProfileStore } from "@/stores/profileStore";
import { useLocalSearchParams } from "expo-router";

const ImagePickerUpload = () => {
  const { title } = useLocalSearchParams();
  const { user } = useAuthStore();
  const { profile, updateField } = useProfileStore();
  const [loading, setLoading] = useState(false);

  const pickImageAndUpload = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Quyền bị từ chối", "Cần quyền truy cập ảnh để chọn ảnh.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setLoading(true);

      try {
        const response = await ProfileService.setProfileAvatar(
          Number(user?.userId),
          uri
        );

        if (response.isSuccess) {
          updateField("avatar", uri);
          Alert.alert("Thành công", "Avatar đã được cập nhật!");
        } else {
          Alert.alert(
            "Thất bại",
            response.message || "Không thể upload avatar"
          );
        }
      } catch (error) {
        console.error("❌ Lỗi upload avatar:", error);
        Alert.alert("Lỗi", "Có lỗi khi upload avatar");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <ScrollScreenLayout
      header={<HeaderSetting nameTitle={title as string} />}
      headerBackgroundColor="white"
    >
      <YStack padding="$2" gap="$4" alignItems="center">
        <ProfileItemDetail
          title="Ảnh đại diện"
          label=""
          value="Đổi ảnh đại diện"
          editable={true}
          onPress={pickImageAndUpload}
          leftContent={
            <Avatar circular size="$6" borderWidth={1} borderColor="#EDE3D1">
              <Avatar.Image src={profile?.avatar} />
              <Avatar.Fallback backgroundColor="$gray6" />
            </Avatar>
          }
        />

        {loading && <ActivityIndicator size="large" color="blue" />}
      </YStack>
    </ScrollScreenLayout>
  );
};

export default ImagePickerUpload;
