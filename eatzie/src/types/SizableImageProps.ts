import {
  ImageProps,
  ImageSourcePropType,
  ImageStyle,
  StyleProp,
} from "react-native";

export type SizableImageProps = {
  source: ImageSourcePropType;
  width?: number | string;
  height?: number | string;
  aspectRatio?: number;
  borderRadius?: number | string;
  resizeMode?: ImageProps["resizeMode"];
  style?: StyleProp<ImageStyle>;
};
