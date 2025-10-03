import { useAuthStore } from "@/applicaton/stores/authStores";
import { Profile, ProfileService } from "@/domain/service/ProfileService";
import { UserRound } from "@tamagui/lucide-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Avatar, XStack, YStack } from "tamagui";
import { CustomButton } from "../ui/CustomButton";

export const HeaderProfile = () => {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    if (user?.userId) {
      ProfileService.getProfile(Number(user.userId)).then(setProfile);
    }
  }, [user]);
  const checkAuthUI = () =>
    !isAuthenticated && (
      <CustomButton
        backgroundColor="#9B59B6"
        paddingHorizontal="$3"
        paddingVertical="$2"
        borderRadius="$2"
        textfontsize="$4"
        textfontweight="$4"
        position="absolute"
        bottom={0}
        right={16}
        onPress={() => router.push("/(auth)/login1")}
      >
        Đăng nhập / Đăng kí
      </CustomButton>
    );
  return (
    <YStack
      paddingHorizontal="$4"
      paddingTop="$4"
      paddingBottom="$2"
      height={80}
      position="relative"
    >
      <XStack
        position="absolute"
        bottom={0}
        left={16}
        width={48}
        height={48}
        backgroundColor="white"
        borderRadius={9999}
        alignItems="center"
        justifyContent="center"
        borderWidth={1}
        borderColor="$gray5"
      >
        {isAuthenticated ? (
          <Avatar circular size="$6">
            <Avatar.Image src={profile?.avatar} />
            <Avatar.Fallback backgroundColor="$gray6" />
          </Avatar>
        ) : (
          <UserRound color={"$blue2Dark"} size={35} />
        )}
      </XStack>
      {checkAuthUI()}
    </YStack>
  );
};
