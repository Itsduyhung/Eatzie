import { HeaderProps } from "@/types/headerProps";
import { UserRound } from "@tamagui/lucide-icons";
import { useRouter } from "expo-router";
import { XStack, YStack } from "tamagui";
import { CustomButton } from "../ui/CustomButton";

export const HeaderProfile = ({ user }: HeaderProps) => {
  const router = useRouter();

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
        <UserRound color={"$blue2Dark"} size={35} />
      </XStack>

      {checkAuthUI()}
    </YStack>
  );
};
