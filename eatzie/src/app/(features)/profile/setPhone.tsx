import React, { useState } from "react";
import { ActivityIndicator, Alert, TextInput } from "react-native";
import { Button, Text, XStack, YStack } from "tamagui";

import { useAuthStore } from "@/applicaton/stores/authStores";
import { HeaderSetting } from "@/components/home/HeaderSetting";
import { ScrollScreenLayout } from "@/components/layout/ScrollScreenLayout";
import { ProfileService } from "@/domain/service/ProfileService";
import { useProfileStore } from "@/stores/profileStore";
import { useLocalSearchParams } from "expo-router";

const SetPhone = () => {
  const { title } = useLocalSearchParams();
  const { user } = useAuthStore();
  const { profile, updateField } = useProfileStore();

  const [newPhone, setNewPhone] = useState(profile?.phone || "");
  const [loading, setLoading] = useState(false);

  const savePhone = async () => {
    const trimmed = newPhone.trim();
    if (!trimmed) return Alert.alert("Số điện thoại không được để trống");
    if (!user?.userId) return Alert.alert("Người dùng không hợp lệ");

    setLoading(true);
    try {
      const res = await ProfileService.updateProfile(Number(user.userId), {
        phone: trimmed,
      });

      if (res.isSuccess) {
        updateField("phone", trimmed);
        Alert.alert("Thành công", "Số điện thoại đã được cập nhật!");
      } else {
        Alert.alert(
          "Thất bại",
          res.message || "Không thể cập nhật số điện thoại"
        );
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Lỗi", "Có lỗi khi cập nhật số điện thoại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollScreenLayout
      header={<HeaderSetting nameTitle={title as string} />}
      headerBackgroundColor="white"
    >
      <YStack padding="$3" gap="$3">
        <XStack
          alignItems="center"
          borderWidth={1}
          borderColor="#ddd"
          borderRadius={8}
          paddingHorizontal={12}
          height={50}
          backgroundColor="white"
        >
          <Text style={{ fontSize: 16, color: "#555" }}>Số điện thoại</Text>
          <TextInput
            value={newPhone}
            onChangeText={setNewPhone}
            placeholder="Nhập số điện thoại"
            placeholderTextColor="#999"
            style={{
              flex: 1,
              textAlign: "right",
              fontSize: 16,
              paddingVertical: 0,
              paddingHorizontal: 0,
              marginLeft: 10,
              color: "black",
            }}
            keyboardType="phone-pad"
          />
        </XStack>

        <XStack alignItems="center" justifyContent="center" marginTop={20}>
          <Button
            onPress={savePhone}
            disabled={loading}
            backgroundColor="#DFDFF5"
            paddingHorizontal={30}
            paddingVertical={10}
            borderRadius={8}
            pressStyle={{ backgroundColor: "#9B59B6" }}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text color="white">Lưu</Text>
            )}
          </Button>
        </XStack>
      </YStack>
    </ScrollScreenLayout>
  );
};

export default SetPhone;
