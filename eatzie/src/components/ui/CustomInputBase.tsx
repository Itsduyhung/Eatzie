import { NoFocusStyle } from "@/app/constant/inputStyles";
import { useThemedTextColor } from "@/app/hooks/ThemedTextColor";
import { CustomInputBaseProps } from "@/types/input/CustomInputBaseProps";
import { SizableText, View, YStack } from "tamagui";
import { FloatingLabel } from "../FloatingLabel";

export const CustomInputBase = ({
  label,
  value,
  focused,
  suffixIcon,
  children,
  size = "$6",
  color,
  backgroundColor,
  borderColor,
  paddingLeft = 12,
  height,
  focusStyle,
  showError,
  errorMessage,
}: CustomInputBaseProps) => {
  const { textColor } = useThemedTextColor();
  const resolvedFocusStyle =
    focusStyle === "none" ? NoFocusStyle : focusStyle ?? undefined;

  return (
    <YStack position="relative" justifyContent="center">
      {label && (
        <FloatingLabel label={label} focused={!!focused} filled={!!value} />
      )}

      <View
        backgroundColor={backgroundColor ?? "$background"}
        borderColor={borderColor ?? "$borderColor"}
        borderWidth={1}
        borderRadius={15}
        paddingLeft={paddingLeft}
        paddingBottom={0}
        paddingTop={0}
        height={height ?? 48}
        flexDirection="row"
        alignItems="center"
        focusStyle={focusStyle}
      >
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
          {children}
        </View>
        {suffixIcon && (
          <View style={{ marginRight: 16, alignItems: 'center', justifyContent: 'center' }}>
            {suffixIcon}
          </View>
        )}
      </View>

      {showError && errorMessage && (
        <SizableText mt="$1" color="$red10" size="$2">
          {errorMessage}
        </SizableText>
      )}
    </YStack>
  );
};
