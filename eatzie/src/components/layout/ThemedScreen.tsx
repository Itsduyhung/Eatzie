import { ThemedScreenContext } from "@/app/hooks/ThemedTextColor";
import { isColorDark } from "@/app/untils/isColorDark";
import { ThemedScreenProps } from "@/types/themedScreenProps";
import { useMemo } from "react";
import { useTheme, YStack } from "tamagui";

export function ThemedScreen({
  children,
  backgroundColor = "$background",
  padding = "$6",
}: ThemedScreenProps) {
  const theme = useTheme();

  const resolvedBg = backgroundColor.startsWith("$")
    ? theme[backgroundColor.replace("$", "")]?.val || "#ffffff"
    : backgroundColor;

  const textColor = useMemo(() => {
    return isColorDark(resolvedBg) ? "white" : "black";
  }, [resolvedBg]);

  return (
    <ThemedScreenContext.Provider value={{ textColor }}>
      <YStack flex={1} backgroundColor={backgroundColor} padding={padding}>
        {typeof children === "function" ? children({ textColor }) : children}
      </YStack>
    </ThemedScreenContext.Provider>
  );
}
