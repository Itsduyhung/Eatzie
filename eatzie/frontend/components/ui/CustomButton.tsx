import { isColorDark } from "@/app/untils/isColorDark";
import { useThemedTextColor } from "@/hooks/ThemedTextColor";
import { Check, Plus } from "@tamagui/lucide-icons";
import { forwardRef, ReactNode } from "react";
import type { ButtonProps } from "tamagui";
import { Button, SizableText, useTheme, XStack } from "tamagui";

type CustomButtonProps = ButtonProps & {
  forceTextColor?: string;
  onPress?: () => void;
  textfontsize?: any;
  textfontweight?: any;
  isSelected?: boolean;
  iconAfter?: "plus" | "check";
  children: ReactNode;
};

function CustomButtonText({
  color,
  fontsize,
  fontWeight,
  children,
}: {
  color: any;
  fontsize: any;
  fontWeight: any;
  children: React.ReactNode;
}) {
  return (
    <SizableText
      fontSize={fontsize}
      fontWeight={fontWeight}
      color={color}
      numberOfLines={1}
      ellipsizeMode="tail"
      maxWidth={300}
      style={{
        flexShrink: 1,
        overflow: "hidden",
      }}
    >
      {children}
    </SizableText>
  );
}

export const CustomButton = forwardRef<any, CustomButtonProps>(
  (
    {
      forceTextColor,
      children,
      textfontsize = "$6",
      textfontweight = "700",
      isSelected,
      iconAfter,
      ...props
    },
    ref
  ) => {
    const theme = useTheme();
    const contextTextColor = useThemedTextColor();

    const finalBgColor = isSelected
      ? "#6666FF"
      : props.backgroundColor ?? "transparent";

    const resolvedBg = (() => {
      if (typeof finalBgColor !== "string") return "#ffffff";
      if (finalBgColor.startsWith("$"))
        return theme[finalBgColor.slice(1)]?.val ?? "#ffffff";
      if (finalBgColor === "black") return "#000000";
      if (finalBgColor === "white") return "#ffffff";
      if (finalBgColor.startsWith("#")) return finalBgColor;
      return "#ffffff";
    })();

    const autoColor = isColorDark(resolvedBg) ? "white" : "black";
    const textColor =
      forceTextColor ?? props.color ?? autoColor ?? contextTextColor;

    return (
      <Button
        {...props}
        ref={ref}
        backgroundColor={finalBgColor}
        onPress={props.onPress ?? (() => {})}
        unstyled
        animation={false as any}
        color={textColor}
        borderColor={props.borderColor ?? undefined}
        justifyContent={props.justifyContent ?? "center"}
        alignItems={props.alignItems ?? "center"}
        paddingHorizontal={props.paddingHorizontal ?? "$4"}
        paddingVertical={props.paddingVertical ?? "$2.5"}
        borderRadius={props.borderRadius ?? "$4"}
        pressStyle={
          props.pressStyle === undefined
            ? {
                opacity: 0.6,
                backgroundColor: resolvedBg,
                scale: 1,
                transform: [],
              }
            : props.pressStyle
        }
        hoverStyle={
          props.hoverStyle === undefined
            ? {
                opacity: 0.8,
                backgroundColor: resolvedBg,
                scale: 1,
                transform: [],
              }
            : props.hoverStyle
        }
      >
        {typeof children === "string" || typeof children === "number" ? (
          iconAfter ? (
            <XStack
              alignItems="center"
              gap="$2"
              flexDirection="row"
              flex={1}
              flexShrink={1}
              overflow="hidden"
            >
              <CustomButtonText
                fontsize={textfontsize}
                fontWeight={textfontweight}
                color={textColor}
              >
                {children}
              </CustomButtonText>

              {iconAfter === "plus" && <Plus size={16} color="black" />}
              {iconAfter === "check" && <Check size={16} color="black" />}
            </XStack>
          ) : (
            <CustomButtonText
              fontsize={textfontsize}
              fontWeight={textfontweight}
              color={textColor}
            >
              {children}
            </CustomButtonText>
          )
        ) : (
          children
        )}
      </Button>
    );
  }
);

CustomButton.displayName = "CustomButton";
