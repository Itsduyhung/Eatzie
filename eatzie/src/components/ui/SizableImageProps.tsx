import { SizableImageProps } from "@/types/SizableImageProps";
import { Image, StyleSheet } from "react-native";

export const SizableImage = ({
  source,
  resizeMode = "cover",
  borderRadius = 12,
  style,
}: SizableImageProps) => {
  const defaultStyle = StyleSheet.flatten(style || {});
  const hasWidth = defaultStyle?.width !== undefined;
  const hasHeight = defaultStyle?.height !== undefined;

  const imageStyle = {
    ...(hasWidth ? {} : { width: "100%" as `${number}%` }),
    ...(hasHeight ? {} : { height: "100%" as `${number}%` }),
    borderRadius,
  };

  return (
    <Image
      source={source}
      resizeMode={resizeMode}
      style={[imageStyle, style]}
    />
  );
};
