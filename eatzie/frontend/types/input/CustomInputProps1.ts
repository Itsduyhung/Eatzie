// types/input/CustomInputProps.ts

import { RefObject } from "react";
import {
  KeyboardTypeOptions,
  NativeSyntheticEvent,
  ReturnKeyTypeOptions,
  TextInput,
  TextInputFocusEventData,
  TextInputKeyPressEventData,
  TextInputProps,
  TextInputSelectionChangeEventData,
} from "react-native";
import { InputProps } from "tamagui";
import { FormikFieldBaseProps } from "../baseInput.types";
import {
  AutoCapitalizeOptions,
  TextInputAutoComplete,
  TextInputContentType,
} from "./TextInputConstants";

export type CustomInputProps1 = FormikFieldBaseProps<string> & {
  value?: string;
  onChangeText?: (text: string) => void;

  label?: string;
  suffixIcon?: React.ReactNode;
  secureTextEntry?: boolean;
  paddingLeft?: number | string;
  backgroundColor?: string;
  color?: string;
  borderColor?: string;
  placeholderTextColor?: string;
  size?: any;
  height?: number;
  focusStyle?: InputProps["focusStyle"] | "none";

  autoCorrect?: boolean;
  autoComplete?: TextInputAutoComplete;
  textContentType?: TextInputContentType;
  autoCapitalize?: AutoCapitalizeOptions;
  keyboardType?: KeyboardTypeOptions;
  returnKeyType?: ReturnKeyTypeOptions;
  editable?: boolean;
  inputMode?: TextInputProps["inputMode"];
  importantForAutofill?: TextInputProps["importantForAutofill"];
  multiline?: boolean;
  numberOfLines?: number;
  maxLength?: number;
  paddingTop?: string | number;

  inputRef?: RefObject<TextInput>;
  onFocus?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void;
  onBlur?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void;
  onSelectionChange?: (
    e: NativeSyntheticEvent<TextInputSelectionChangeEventData>
  ) => void;
  onKeyPress?: (e: NativeSyntheticEvent<TextInputKeyPressEventData>) => void;
  focused?: boolean;

  showError?: boolean;
  errorMessage?: string;
  onPress?: () => void;
  caretHidden?: boolean;
};
