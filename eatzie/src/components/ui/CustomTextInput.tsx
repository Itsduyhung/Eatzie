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
  editable?: boolean;
  pointerEvents?: "auto" | "none" | "box-none" | "box-only";
  width?: number | string;
  marginHorizontal?: number;
  marginLeft?: number;
  marginRight?: number;
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
  height = 35,
  paddingLeft = 12,
  focusStyle = "default",
  editable,
  pointerEvents,
  width = "100%",
  marginHorizontal,
  marginLeft,
  marginRight,
}: CustomInputProps) {
  return (
    <XStack
      alignItems="center"
      borderRadius={12}
      borderWidth={1}
      backgroundColor={backgroundColor}
      borderColor={focused ? "#007AFF" : borderColor}
      height={height}
      paddingHorizontal={2}
      gap={8}
      pointerEvents={pointerEvents}
      width={typeof width === "string" && width === "100%" ? undefined : width}
      flex={width === "100%" ? 1 : undefined}
      marginHorizontal={marginHorizontal}
      marginLeft={marginLeft}
      marginRight={marginRight}
    >
      <Input
        editable={editable}
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
