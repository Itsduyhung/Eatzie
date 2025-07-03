// types/input/CustomInputProps.ts

import { RefObject } from "react";
import { TextInput } from "react-native";
import { InputProps } from "tamagui";
import { FormikFieldBaseProps } from "../baseInput.types";

export type CustomInputProps = FormikFieldBaseProps<string> & {
  maxLength?: number;
  multiline?: boolean;
  numberOfLines?: number;
  backgroundColor?: string;
  color?: string;
  borderColor?: string;
  placeholderTextColor?: string;
  suffixIcon?: React.ReactNode;
  secureTextEntry?: boolean;
  inputRef?: RefObject<TextInput>;

  value?: string;
  onChangeText?: (text: string) => void;
  paddingLeft?: number;
  onBlur?: () => void;
  height?: number;

  focusStyle?: InputProps["focusStyle"] | "none";
};
