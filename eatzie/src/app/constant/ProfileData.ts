import { IconInline, InstallType } from "@/types/iconInline";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";

export const ProfileData: IconInline[] = [
  {
    iconComponent: MaterialCommunityIcons,
    iconProps: {
      name: "file-document-multiple-outline",
      size: 24,
    },
    path: "/loading",
    title: "Hồ sơ vị giác",
  },
  {
    iconComponent: MaterialCommunityIcons,

    iconProps: {
      name: "bookmark-outline",
      size: 24,
    },
    path: "/loading",
    title: "Món ăn đã lưu gần đây",
  },
  {
    iconComponent: Feather,

    iconProps: {
      name: "settings",
      size: 24,
    },
    path: "/loading",
    title: "Cài đặt",
  },
];

export const SettingData: InstallType[] = [
  {
    title: "Cài đặt tài khoản",
    items: [
      {
        content: "Thông tin",
        path: "/profile",
        language: false,
      },
      {
        content: "Mật khẩu",
        path: "/loading",
        language: false,
      },
    ],
  },
];
