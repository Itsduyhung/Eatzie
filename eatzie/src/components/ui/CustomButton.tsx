// components/ui/CustomButton.tsx
import { useThemedTextColor } from "@/app/hooks/ThemedTextColor";
import { isColorDark } from "@/app/untils/isColorDark";
import type { ButtonProps } from "tamagui";
import { Button, SizableText, useTheme } from "tamagui";

type CustomButtonProps = ButtonProps & {
  forceTextColor?: string;
  onPress?: () => void;
};

function CustomButtonText({
  color,
  children,
}: {
  color: any;
  children: React.ReactNode;
}) {
  return (
    <SizableText fontSize="$5" fontWeight="600" color={color}>
      {children}
    </SizableText>
  );
}

export function CustomButton({
  forceTextColor,
  children,
  ...props
}: CustomButtonProps) {
  const theme = useTheme();
  const contextTextColor = useThemedTextColor();

  const bg = props.backgroundColor ?? "transparent";

  const resolvedBg = (() => {
    if (typeof bg !== "string") return "#ffffff";
    if (bg.startsWith("$")) return theme[bg.slice(1)]?.val ?? "#ffffff";
    if (bg === "black") return "#000000";
    if (bg === "white") return "#ffffff";
    if (bg.startsWith("#")) return bg;
    return "#ffffff";
  })();

  const autoColor = isColorDark(resolvedBg) ? "white" : "black";
  const textColor =
    forceTextColor ?? props.color ?? autoColor ?? contextTextColor;
  const isWhiteBg = resolvedBg === "#ffffff";

  return (
    <Button
      {...props}
      onPress={props.onPress ?? (() => {})}
      unstyled
      animation={false as any}
      color={!isWhiteBg ? textColor : undefined}
      borderColor={props.borderColor ?? textColor}
      justifyContent="center"
      alignItems="center"
      paddingHorizontal="$4"
      paddingVertical="$2.5"
      borderRadius="$4"
      pressStyle={{
        opacity: 0.6,
        backgroundColor: isWhiteBg ? "white" : undefined,
        scale: 1,
        transform: [],
      }}
      hoverStyle={{
        opacity: 0.8,
        backgroundColor: isWhiteBg ? "white" : undefined,
        scale: 1,
        transform: [],
      }}
    >
      {isWhiteBg ? (
        <CustomButtonText color={textColor}>{children}</CustomButtonText>
      ) : (
        children
      )}
    </Button>
  );
}
