import { AnimationObject } from "lottie-react-native";

export type IconInline = {
  icon?: AnimationObject | number | { url: string } | string;
  iconType?: "image" | "lottie" | "component";
  title: string;
  path: string;
  iconComponent?: React.ComponentType<any>;
  iconProps?: Record<string, any>;
};

export type BannerInline = Omit<
  IconInline,
  "iconType" | "title" | "iconComponent" | "iconProps"
>;
