import { HeaderProps } from "@/types/headerProps";
import { UserRound } from "@tamagui/lucide-icons";
import { useRouter } from "expo-router";
import { Button, XStack, YStack } from "tamagui";

export const Header = ({ user }: HeaderProps) => {
  const router = useRouter();

  const checkAuthUI = () =>
    !user && (
      <Button
        variant="outlined"
        size="$2"
        onPress={() => router.push("/(auth)/login1")}
      >
        Đăng nhập / Đăng kí
      </Button>
    );

  return (
    <YStack
      padding="$4"
      backgroundColor="#FF6A00"
      borderBottomWidth={1}
      borderColor="#e65c00"
    >
      <XStack alignItems="center" justifyContent="space-between">
        <XStack
          width={40}
          height={40}
          backgroundColor="white"
          borderRadius={20}
          alignItems="center"
          justifyContent="center"
        >
          <UserRound color="#FF6A00" size={20} />
        </XStack>

        {checkAuthUI()}
      </XStack>
    </YStack>
  );
};
