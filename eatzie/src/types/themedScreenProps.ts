import { ReactNode } from "react";
import type { ColorTokens } from "tamagui";

export type ThemedScreenProps = {
  children: ReactNode | ((props: { textColor: string }) => ReactNode);
  backgroundColor?: ColorTokens | string;
  padding?: any;
};
