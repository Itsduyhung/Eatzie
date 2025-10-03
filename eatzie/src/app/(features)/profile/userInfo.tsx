import { useAuthStore } from "@/applicaton/stores/authStores";
import { HeaderSetting } from "@/components/home/HeaderSetting";
import { ScrollScreenLayout } from "@/components/layout/ScrollScreenLayout";
import { CustomButton } from "@/components/ui/CustomButton";
import { ProfileService } from "@/domain/service/ProfileService";
import { useProfileStore } from "@/stores/profileStore";
import { ChevronRight } from "@tamagui/lucide-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { Avatar, Text, XStack, YStack } from "tamagui";

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
    <CustomButton
      backgroundColor="transparent"
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
        <XStack alignItems="center" gap="$3">
          {leftContent}
          {label ? (
            <Text fontSize="$5" color="#000">
              {label}
            </Text>
          ) : null}
        </XStack>

        <XStack alignItems="center">
          <Text fontSize="$4" color={value ? "#000" : "#999"}>
            {value ?? (label ? `Nhập ${label}` : "")}
          </Text>
          {editable && <ChevronRight size={20} color="#000" />}
        </XStack>
      </XStack>
    </CustomButton>
  );
};

const ProfileGroup = ({ items }: { items: ItemDef[] }) => {
  return (
    <YStack backgroundColor="#FFFFFF" borderRadius={10} overflow="hidden">
      {items.map((it, idx) => (
        <ProfileItem
          key={it.key}
          label={it.label}
          value={it.value}
          editable={it.editable}
          leftContent={it.leftContent}
          onPress={it.onPress}
          showDivider={idx !== items.length - 1}
        />
      ))}
    </YStack>
  );
};

const ProfileScreen = () => {
  const { user } = useAuthStore();
  const { profile, setProfile } = useProfileStore();
  const { title } = useLocalSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (user?.userId) {
      ProfileService.getProfile(Number(user.userId)).then(setProfile);
    }
  }, [user]);

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

  const maskedPhone = profile.phone
    ? "*******" + profile.phone.slice(-3)
    : undefined;

  const group1: ItemDef[] = [
    {
      key: "avatar",
      label: "",
      value: "Đổi hình đại diện",
      editable: true,
      leftContent: (
        <Avatar circular size="$6">
          <Avatar.Image src={profile.avatar} />
          <Avatar.Fallback backgroundColor="$gray6" />
        </Avatar>
      ),
      onPress: () =>
        router.push({
          pathname: "/profile/setAva",
          params: { title: "Ảnh Đại Diện" },
        }),
    },
    {
      key: "username",
      label: "Tên đăng nhập",
      value: profile.email,
    },
    {
      key: "phone",
      label: "Số điện thoại",
      value: maskedPhone,
      editable: true,
      onPress: () =>
        router.push({
          pathname: "/profile/setPhone",
          params: { title: "Số điện thoại" },
        }),
    },
  ];

  const group2: ItemDef[] = [
    {
      key: "name",
      label: "Tên",
      value: profile.fullname,
      editable: true,
      onPress: () =>
        router.push({
          pathname: "/profile/setName",
          params: { title: "Tên" },
        }),
    },
    {
      key: "email",
      label: "Email",
      value: profile.email,
      editable: false,
      onPress: undefined,
    },
  ];

  return (
    <ScrollScreenLayout
      header={<HeaderSetting nameTitle={title as string} />}
      headerBackgroundColor="white"
    >
      <YStack gap="$4" padding="$2">
        <ProfileGroup items={group1} />
        <ProfileGroup items={group2} />
      </YStack>
    </ScrollScreenLayout>
  );
};

export default ProfileScreen;
