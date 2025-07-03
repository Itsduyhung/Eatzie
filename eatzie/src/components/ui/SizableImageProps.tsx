import { SizableImageProps } from "@/types/SizableImageProps";
import { Image } from "react-native";

export const SizableImage = ({
  source,
  width,
  aspectRatio,
  borderRadius = 12,
  resizeMode = "cover",
  style,
}: SizableImageProps) => {
  const imageStyle = {
    ...(width ? { width } : {}),
    ...(typeof width === "number" && aspectRatio
      ? { height: width / aspectRatio }
      : {}),
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
