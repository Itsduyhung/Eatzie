import { ChevronLeft } from "@tamagui/lucide-icons";
import { useRouter } from "expo-router";
import { PressableIcon } from "../layout/HoverableIconWrapper";

interface BackButtonProps {
  color?: string;
  pressColor?: string;
}

export function BackButton({
  color = "white",
  pressColor = "#f3b8b8ff",
}: BackButtonProps) {
  const router = useRouter();

  return (
    <PressableIcon
      icon={ChevronLeft}
      onPress={() => router.back()}
      defaultColor={color}
      pressColor={pressColor}
    />
  );
}
