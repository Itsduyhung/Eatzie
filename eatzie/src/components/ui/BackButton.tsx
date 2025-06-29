import { ChevronLeft } from "@tamagui/lucide-icons";
import { useRouter } from "expo-router";
import { Button, styled } from "tamagui";

const CustomBackButton = styled(Button, {
  name: "CustomBackButton",
  chromeless: true,
  backgroundColor: "transparent",
  pressStyle: {
    opacity: 0.5,
  },
  hoverStyle: {
    opacity: 0.7,
  },
});

export function BackButton() {
  const router = useRouter();

  return (
    <CustomBackButton
      onPress={() => router.back()}
      icon={<ChevronLeft size={24} color="black" />}
    />
  );
}
