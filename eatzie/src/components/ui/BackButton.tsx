import { ChevronLeft } from "@tamagui/lucide-icons";
import { useRouter } from "expo-router";
import { PressableIcon } from "../layout/HoverableIconWrapper";

export function BackButton() {
  const router = useRouter();

  return (
    <PressableIcon
      icon={ChevronLeft}
      onPress={() => router.back()}
      defaultColor="black"
      pressColor="#f87171" 
    />
  );
}
