import { ChevronLeft } from "@tamagui/lucide-icons";
import { useRouter } from "expo-router";
import { PressableIcon } from "../layout/HoverableIconWrapper";

export function BackButton() {
  const router = useRouter();

  return (
    <PressableIcon
      icon={ChevronLeft}
      onPress={() => router.back()}
      defaultColor="white"
      pressColor="#f3b8b8ff"
    />
  );
}
