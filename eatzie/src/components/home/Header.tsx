import { useAuthStore } from "@/applicaton/stores/authStores";
import { HeaderProps } from "@/types/headerProps";
import { UserRound } from "@tamagui/lucide-icons";
import { useRouter } from "expo-router";
import { Avatar, XStack, YStack } from "tamagui";
import { CustomButton } from "../ui/CustomButton";

export const HeaderProfile = ({ user1 }: HeaderProps) => {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const checkAuthUI = () =>
    !user && (
      <CustomButton
        backgroundColor="#9B59B6"
        paddingHorizontal="$3"
        paddingVertical="$2"
        borderRadius="$2"
        textfontsize="$4"
        textfontweight="$4"
        position="absolute"
        bottom={-25}
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
        bottom={-30}
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
        {user?.userId === "8" ? (
          <Avatar circular size="$6">
            <Avatar.Image src="http://picsum.photos/200/300" />
            <Avatar.Fallback bc="red" />
          </Avatar>
        ) : (
          <UserRound color={"$blue2Dark"} size={35} />
        )}
      </XStack>

      {checkAuthUI()}
    </YStack>
  );
};
