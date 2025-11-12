import { useAuthStore } from "@/applicaton/stores/authStores";
import { HeaderSetting } from "@/components/home/HeaderSetting";
import { ScrollScreenLayout } from "@/components/layout/ScrollScreenLayout";
import { CustomButton } from "@/components/ui/CustomButton";
import { ProfileService } from "@/domain/service/ProfileService";
import { UserDietService } from "@/domain/service/UserDietService";
import { useProfileStore } from "@/stores/profileStore";
import { DietType, DietTypeLabels } from "@/types/userDiet.types";
import { ChevronDown, ChevronLeft, ChevronRight } from "@tamagui/lucide-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert } from "react-native";
import { Input, Sheet, Text, XStack, YStack } from "tamagui";

type ItemDef = {
  key: string;
  label?: string;
  value?: string;
  editable?: boolean;
  leftContent?: React.ReactNode;
  onPress?: () => void;
};

const ProfileItem = ({
  label,
  value,
  editable,
  onPress,
  leftContent,
  showDivider = true,
}: {
  label?: string;
  value?: string;
  editable?: boolean;
  onPress?: () => void;
  leftContent?: React.ReactNode;
  showDivider?: boolean;
}) => {
  return (
    <YStack>
      {label && (
        <Text fontSize="$4" color="#666" marginBottom="$1" marginLeft="$3">
          {label}
        </Text>
      )}
      <CustomButton
        backgroundColor="#fff"
        onPress={onPress}
        paddingVertical="$3"
        disabled={!editable && !onPress}
        borderBottomWidth={showDivider ? 1 : 0}
        borderColor={showDivider ? "#F0F0F0" : "transparent"}
        paddingHorizontal="$3"
      >
        <XStack
          width="100%"
          alignItems="center"
          justifyContent="space-between"
          borderColor="#E0E0E0"
        >
          <XStack alignItems="center" gap="$3" flex={1}>
            {leftContent}
            <Text fontSize="$5" color="#000" numberOfLines={2}>
              {value || "Chưa có thông tin"}
            </Text>
          </XStack>
          {editable && <ChevronRight size={20} color="#999" />}
        </XStack>
      </CustomButton>
    </YStack>
  );
};

const ProfileGroup = ({ items }: { items: ItemDef[] }) => {
  return (
    <YStack backgroundColor="#FFFFFF" borderRadius="$3" overflow="hidden">
      {items.map((it, idx) => (
        <ProfileItem
          key={it.key}
          label={it.label}
          value={it.value}
          editable={it.editable}
          onPress={it.onPress}
          leftContent={it.leftContent}
          showDivider={idx !== items.length - 1}
        />
      ))}
    </YStack>
  );
};

const UserDietScreen = () => {
  const [showDietTypeDropdown, setShowDietTypeDropdown] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editDietType, setEditDietType] = useState<string>("");
  const [editAllergicFood, setEditAllergicFood] = useState<string>("");
  const [editFavoriteFood, setEditFavoriteFood] = useState<string>("");
  const [editMinSpending, setEditMinSpending] = useState<number | undefined>(
    undefined
  );
  const [editMaxSpending, setEditMaxSpending] = useState<number | undefined>(
    undefined
  );
  const { title } = useLocalSearchParams();
  const { profile, setProfile } = useProfileStore();
  const { user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    console.log("🔍 UserDietScreen: useEffect triggered, user:", user);
    if (user?.userId) {
      console.log(
        "🔍 UserDietScreen: Calling ProfileService.getProfile for userId:",
        user.userId
      );
      ProfileService.getProfile(Number(user.userId)).then((profileData) => {
        console.log(
          "✅ UserDietScreen: ProfileService.getProfile returned:",
          profileData
        );
        setProfile(profileData);
      });
    }
  }, [user]);

  const userDiet = profile?.userDiet;
  useEffect(() => {
    if (userDiet) {
      // Map diet_type (number) sang tên chế độ ăn (string)
      setEditDietType(
        DietTypeLabels[userDiet.diet_type as keyof typeof DietTypeLabels] || ""
      );
      setEditAllergicFood(userDiet.allergic_food || "");
      setEditFavoriteFood(userDiet.favorite_food || "");
      setEditMinSpending(userDiet.min_spending);
      setEditMaxSpending(userDiet.max_spending);
    }
  }, [userDiet]);
  // Reset dữ liệu input mỗi khi mở Sheet
  useEffect(() => {
    if (editOpen && userDiet) {
      setEditDietType(
        DietTypeLabels[userDiet.diet_type as keyof typeof DietTypeLabels] || ""
      );
      setEditAllergicFood(userDiet.allergic_food || "");
      setEditFavoriteFood(userDiet.favorite_food || "");
      setEditMinSpending(userDiet.min_spending);
      setEditMaxSpending(userDiet.max_spending);
    }
  }, [editOpen]);

  console.log("🔍 UserDietScreen: Current profile state:", profile);
  console.log("🔍 UserDietScreen: userDiet data:", userDiet);

  if (!profile) {
    return (
      <ScrollScreenLayout
        header={<HeaderSetting nameTitle={title as string} />}
        headerBackgroundColor="white"
      >
        <Text p="$4">⏳ Đang tải...</Text>
      </ScrollScreenLayout>
    );
  }

  const group1: ItemDef[] = [
    {
      key: "dietType",
      label: "Loại chế độ ăn",
      value: userDiet
        ? DietTypeLabels[userDiet.diet_type as DietType] || "Chưa chọn"
        : "Chưa có thông tin",
      editable: true,
      onPress: () => {
        // TODO: Navigate to diet type selection
        console.log("Navigate to diet type selection");
      },
    },
    {
      key: "allergicFood",
      label: "Thức ăn dị ứng",
      value: userDiet?.allergic_food || "Chưa có thông tin",
      editable: true,
      onPress: () => {
        // TODO: Navigate to allergic food editing
        console.log("Navigate to allergic food editing");
      },
    },
  ];

  const group2: ItemDef[] = [
    {
      key: "favoriteFood",
      label: "Thức ăn yêu thích",
      value: userDiet?.favorite_food || "Chưa có thông tin",
      editable: true,
      onPress: () => {
        // TODO: Navigate to favorite food editing
        console.log("Navigate to favorite food editing");
      },
    },
    {
      key: "spendingRange",
      label: "Khoảng chi tiêu (VNĐ)",
      value:
        userDiet?.min_spending && userDiet?.max_spending
          ? `${userDiet.min_spending.toLocaleString()} - ${userDiet.max_spending.toLocaleString()} VNĐ`
          : "Chưa có thông tin",
      editable: true,
      onPress: () => {
        // TODO: Navigate to spending range editing
        console.log("Navigate to spending range editing");
      },
    },
  ];

  return (
    <ScrollScreenLayout
      header={<HeaderSetting nameTitle={title as string} />}
      headerBackgroundColor="white"
    >
      <YStack gap="$1" padding="$2">
        <ProfileGroup items={group1} />
        <ProfileGroup items={group2} />
        <CustomButton
          backgroundColor="#6666FF"
          paddingVertical="$4"
          marginTop="$4"
          onPress={() => setEditOpen(true)}
        >
          <Text color="#fff" fontSize="$5" fontWeight="bold">
            Cập nhật hồ sơ vị giác
          </Text>
        </CustomButton>
        <Sheet
          open={editOpen}
          onOpenChange={setEditOpen}
          snapPoints={[80]}
          modal={false}
        >
          <YStack
            position="absolute"
            top={-150}
            left={0}
            right={-10}
            bottom={0}
            zIndex={999}
            backgroundColor="rgba(0,0,0,0.15)"
            justifyContent="flex-start"
            alignItems="center"
          >
            <YStack
              width="100%"
              padding="$5"
              backgroundColor="#fff"
              borderRadius={0}
              shadowColor="#000"
              shadowOpacity={0.15}
              shadowRadius={12}
              marginTop={40}
            >
              <XStack alignItems="center" marginBottom="$4">
                <CustomButton
                  backgroundColor="transparent"
                  paddingVertical={8}
                  paddingHorizontal={8}
                  borderRadius={999}
                  onPress={() => setEditOpen(false)}
                >
                  <ChevronLeft
                    size={24}
                    color="#050505ff"
                    style={{ transform: [{ rotate: "180deg" }] }}
                  />
                </CustomButton>
                <Text
                  fontSize="$6"
                  fontWeight="bold"
                  textAlign="center"
                  flex={1}
                  color="#000"
                >
                  Chỉnh sửa hồ sơ vị giác
                </Text>
              </XStack>
              <YStack gap="$3">
                <Text fontSize="$5" marginBottom={2} color="#000">
                  Loại chế độ ăn
                </Text>
                <CustomButton
                  backgroundColor="#f5f5f5"
                  borderRadius={8}
                  borderWidth={1}
                  borderColor="#131212ff"
                  paddingHorizontal="$3"
                  paddingVertical={12}
                  justifyContent="flex-start"
                  alignItems="flex-start"
                  onPress={() => setShowDietTypeDropdown(!showDietTypeDropdown)}
                >
                  <XStack
                    width="100%"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Text color="#000" fontSize="$5" textAlign="left">
                      {editDietType || "Chọn loại chế độ ăn"}
                    </Text>
                    <ChevronDown size={20} color="#999" />
                  </XStack>
                </CustomButton>
                {showDietTypeDropdown && (
                  <YStack
                    backgroundColor="#F5F5F5"
                    borderRadius={8}
                    shadowColor="#000"
                    shadowOpacity={0.1}
                    shadowRadius={8}
                    marginTop={4}
                  >
                    {["Ăn chay", "Ăn mặn", "Ăn cả chay lẫn mặn"].map(
                      (label) => (
                        <CustomButton
                          key={label}
                          backgroundColor="#F5F5F5"
                          paddingVertical={12}
                          borderBottomWidth={1}
                          borderColor="#F5F5F5"
                          borderRadius={8}
                          onPress={() => {
                            setEditDietType(label);
                            setShowDietTypeDropdown(false);
                          }}
                        >
                          <Text color="#000" fontSize="$5">
                            {label}
                          </Text>
                        </CustomButton>
                      )
                    )}
                  </YStack>
                )}
                const [showDietTypeDropdown, setShowDietTypeDropdown] =
                useState(false);
                <Text fontSize="$5" marginBottom={2} color="#000">
                  Thức ăn dị ứng
                </Text>
                <Input
                  value={editAllergicFood}
                  onChangeText={setEditAllergicFood}
                  placeholder="Nhập thức ăn dị ứng"
                  backgroundColor="#F5F5F5"
                  borderRadius={8}
                  paddingHorizontal="$3"
                  color="#000"
                />
                <Text fontSize="$5" marginBottom={2} color="#000">
                  Thức ăn yêu thích
                </Text>
                <Input
                  value={editFavoriteFood}
                  onChangeText={setEditFavoriteFood}
                  placeholder="Nhập thức ăn yêu thích"
                  backgroundColor="#F5F5F5"
                  borderRadius={8}
                  paddingHorizontal="$3"
                  color="#000"
                />
                <Text fontSize="$5" marginBottom={2} color="#000">
                  Khoảng chi tiêu tối thiểu (VNĐ)
                </Text>
                <Input
                  keyboardType="numeric"
                  value={editMinSpending?.toString() || ""}
                  onChangeText={(v) => setEditMinSpending(Number(v))}
                  placeholder="Nhập số tiền tối thiểu"
                  backgroundColor="#F5F5F5"
                  borderRadius={8}
                  paddingHorizontal="$3"
                  color="#000"
                />
                <Text fontSize="$5" marginBottom={2} color="#000">
                  Khoảng chi tiêu tối đa (VNĐ)
                </Text>
                <Input
                  keyboardType="numeric"
                  value={editMaxSpending?.toString() || ""}
                  onChangeText={(v) => setEditMaxSpending(Number(v))}
                  placeholder="Nhập số tiền tối đa"
                  backgroundColor="#F5F5F5"
                  borderRadius={8}
                  paddingHorizontal="$3"
                  color="#000"
                />
                <CustomButton
                  backgroundColor="#6666FF"
                  paddingVertical="$3"
                  marginTop="$4"
                  borderRadius={8}
                  borderWidth={1}
                  borderColor="#007AFF"
                  onPress={async () => {
                    try {
                      if (!user?.userId) {
                        Alert.alert(
                          "Lỗi",
                          "Không tìm thấy thông tin người dùng."
                        );
                        return;
                      }
                      let dietTypeNumber = 0;
                      if (editDietType === "Ăn chay") dietTypeNumber = 0;
                      else if (editDietType === "Ăn mặn") dietTypeNumber = 1;
                      else if (editDietType === "Ăn cả chay lẫn mặn")
                        dietTypeNumber = 2;
                      else {
                        Alert.alert(
                          "Lỗi",
                          "Loại chế độ ăn không hợp lệ. Vui lòng chọn đúng tên chế độ ăn."
                        );
                        return;
                      }
                      const updateData = {
                        userId: Number(user.userId),
                        allergicFood: editAllergicFood,
                        favoriteFood: editFavoriteFood,
                        minSpending: editMinSpending,
                        maxSpending: editMaxSpending,
                        dietType: dietTypeNumber,
                      };
                      const res = await UserDietService.updateUserDiet(
                        updateData
                      );
                      if (res.isSuccess) {
                        Alert.alert(
                          "Thành công",
                          "Cập nhật hồ sơ vị giác thành công!"
                        );
                        setEditOpen(false);
                        router.replace("/account");
                      } else {
                        Alert.alert(
                          "Lỗi",
                          "Cập nhật thất bại. Vui lòng thử lại."
                        );
                      }
                    } catch (err) {
                      Alert.alert(
                        "Lỗi",
                        "Có lỗi xảy ra khi cập nhật hồ sơ vị giác."
                      );
                    }
                  }}
                >
                  <Text color="#fff" fontSize="$5" fontWeight="bold">
                    Lưu thay đổi
                  </Text>
                </CustomButton>
              </YStack>
            </YStack>
          </YStack>
        </Sheet>
      </YStack>
    </ScrollScreenLayout>
  );
};

export default UserDietScreen;
