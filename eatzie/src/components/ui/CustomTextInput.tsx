import { ReactNode } from "react";
import { Input, XStack } from "tamagui";

type CustomInputProps = {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  focused?: boolean;
  suffixIcon?: ReactNode;
  backgroundColor?: string;
  borderColor?: string;
  placeholder?: string;
  placeholderTextColor?: string;
  height?: number;
  paddingLeft?: number;
  focusStyle?: "none" | "default";
};

export function CustomInputText({
  label,
  value,
  onChangeText,
  onFocus,
  onBlur,
  focused,
  suffixIcon,
  backgroundColor = "white",
  borderColor = "#ccc",
  placeholder = "",
  placeholderTextColor = "#999",
  height = 48,
  paddingLeft = 12,
  focusStyle = "default",
}: CustomInputProps) {
  return (
    <XStack
      marginHorizontal="$3"
      alignItems="center"
      borderRadius={8}
      borderWidth={1}
      backgroundColor={backgroundColor}
      borderColor={focused ? "#007AFF" : borderColor}
      height={height}
      paddingHorizontal={12}
      gap={8}
    >
      <Input
        flex={1}
        value={value}
        onChangeText={onChangeText}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor}
        paddingLeft={paddingLeft}
        borderWidth={0}
        backgroundColor="transparent"
        color="black"
        fontSize={16}
        focusStyle={focusStyle === "none" ? {} : undefined}
      />
      {!!suffixIcon && suffixIcon}
    </XStack>
  );
}
