import { RefObject } from "react";
import {
  KeyboardTypeOptions,
  NativeSyntheticEvent,
  ReturnKeyTypeOptions,
  TextInput,
  TextInputFocusEventData,
  TextInputProps,
  TextInputSelectionChangeEventData,
} from "react-native";
import { InputProps } from "tamagui";
import { FormikFieldBaseProps } from "../baseInput.types";

export type AutoCapitalizeOptions =
  | "none"
  | "sentences"
  | "words"
  | "characters";

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
  paddingLeft?: number | string;
  onFocus?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void;
  onBlur?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void;
  onSelectionChange?: (
    e: NativeSyntheticEvent<TextInputSelectionChangeEventData>
  ) => void;

  autoCorrect?: boolean;
  autoComplete?: string;
  textContentType?: string;
  autoCapitalize?: AutoCapitalizeOptions;
  keyboardType?: KeyboardTypeOptions;
  returnKeyType?: ReturnKeyTypeOptions;
  editable?: boolean;
  inputMode?: TextInputProps["inputMode"];
  importantForAutofill?: TextInputProps["importantForAutofill"];

  height?: string | number;
  width?: string | number;
  size?: any;
  label?: string;
  focusStyle?: InputProps["focusStyle"] | "none";
  focused?: boolean;
  paddingBottom?: string | number;
};
