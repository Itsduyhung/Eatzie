import { ThemedScreenContext } from "@/app/hooks/ThemedTextColor";
import { isColorDark } from "@/app/untils/isColorDark";
import { ThemedScreenProps } from "@/types/themedScreenProps";
import { StatusBar } from "expo-status-bar";
import { useMemo } from "react";
import { useTheme, YStack } from "tamagui";

export function ThemedScreen({
  children,
  backgroundColor = "$background",
  padding = "$0",
}: ThemedScreenProps) {
  const theme = useTheme();

  const resolvedBg = backgroundColor.startsWith("$")
    ? theme[backgroundColor.replace("$", "")]?.val || "#ffffff"
    : backgroundColor;

  const isDarkMode = useMemo(() => isColorDark(resolvedBg), [resolvedBg]);
  const textColor = useMemo(
    () => (isDarkMode ? "#ffffff" : "#000000"),
    [isDarkMode]
  );

  return (
    <ThemedScreenContext.Provider value={{ textColor, isDarkMode }}>
      <StatusBar style={isDarkMode ? "light" : "dark"} />
      <YStack flex={1} backgroundColor={backgroundColor} padding={padding}>
        {typeof children === "function" ? children({ textColor }) : children}
      </YStack>
    </ThemedScreenContext.Provider>
  );
}
