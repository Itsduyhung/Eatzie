import { useThemedTextColor } from "@/app/hooks/ThemedTextColor";
import { SizableText, SizableTextProps } from "tamagui";

export function CustomText(props: SizableTextProps) {
  const { textColor } = useThemedTextColor();

  return <SizableText {...props} color={props.color ?? textColor} />;
}
