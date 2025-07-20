import { BannerInline, IconInline } from "@/types/iconInline";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
export const IconInlineData: IconInline[] = [
  {
    icon: require("../../assets/animations/loading1.json"),
    iconType: "lottie",
    title: "Bún, mì, phở",
    path: "/loading",
  },
  {
    icon: require("../../assets/animations/loading2.json"),
    iconType: "lottie",
    title: "Ăn chay sống khỏe",
    path: "/loading",
  },
  {
    iconComponent: MaterialCommunityIcons,
    iconProps: {
      name: "rice",
      size: 29,
      color: "#6C7373",
    },
    iconType: "component",
    title: "Gạo sạch",
    path: "/loading",
  },
];

export const BannerData: BannerInline[] = [
  {
    icon: require("../../assets/banner/banner1.png"),
    path: "/loading",
  },
  {
    icon: require("../../assets/banner/banner3.png"),
    path: "/loading",
  },
  {
    icon: require("../../assets/banner/banner2.png"),
    path: "/loading",
  },
];
