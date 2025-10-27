import { useAuthStore } from "@/applicaton/stores/authStores";
import { useProfileStore } from "@/stores/profileStore";
import { UserRound } from "@tamagui/lucide-icons";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Avatar, XStack, YStack } from "tamagui";
import { CustomButton } from "../ui/CustomButton";

export const HeaderProfile = () => {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();

  const fetchProfile = useProfileStore((s) => s.fetchProfile);
  const profiles = useProfileStore((s) => s.profileById);

  const userId = Number(user?.userId);

  useEffect(() => {
    if (isAuthenticated && userId) {
      fetchProfile(userId);
    }
  }, [isAuthenticated, userId]);

  const profile = profiles[userId];

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
      marginLeft={20}
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
            <Avatar.Image
              src={profile?.avatar || "https://picsum.photos/100"}
            />
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
