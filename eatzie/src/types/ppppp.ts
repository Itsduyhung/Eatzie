// types/input/CustomPasswordProps.ts

import { FieldInputProps, FieldMetaProps } from "formik";
import {
  NativeSyntheticEvent,
  TextInputFocusEventData,
  TextInputProps,
} from "react-native";

export type PasswordInputProps = {
  label?: string;
  field?: FieldInputProps<any>;
  meta?: FieldMetaProps<any>;
  errorMessage?: string;
  showError?: boolean;
  onFocus?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void;
  onBlur?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void;
} & TextInputProps;
