import { createContext, useContext } from "react";
import { SizableText, SizableTextProps, Text, TextProps } from "tamagui";

export const ThemedScreenContext = createContext<{
  textColor: string;
  isDarkMode?: boolean;
} | null>(null);

export const useThemedTextColor = () => {
  const context = useContext(ThemedScreenContext);
  if (!context) throw new Error("Must be used inside <ThemedScreen>");
  return context;
};

export const ThemedText = (props: TextProps) => {
  const { textColor } = useThemedTextColor();
  return <Text {...props} color={textColor} />;
};

export const ThemedSizableText = (props: SizableTextProps) => {
  const { textColor } = useThemedTextColor();
  return <SizableText {...props} color={textColor} />;
};
