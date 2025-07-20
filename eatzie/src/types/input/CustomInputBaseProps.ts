import { ReactNode } from "react";

export type CustomInputBaseProps = {
  label?: string;
  value?: string;
  children: ReactNode;
  showError?: boolean;
  errorMessage?: string;
  focused?: boolean;
  size?: any;
  height?: any;
  color?: any;
  backgroundColor?: any;
  borderColor?: any;
  focusStyle?: any;
  paddingLeft?: number | string;
  onPress?: () => void;
  RightAccessory?: ReactNode;
  suffixIcon?: ReactNode;
};
