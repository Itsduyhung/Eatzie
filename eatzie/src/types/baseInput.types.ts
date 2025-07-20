import { FieldInputProps, FieldMetaProps } from "formik";
import { TextInputProps } from "react-native";

export type FormikFieldBaseProps<T = string> = {
  field?: FieldInputProps<T>;
  meta?: FieldMetaProps<T>;
  placeholder?: string;
  disabled?: boolean;
} & Pick<TextInputProps, "secureTextEntry" | "keyboardType" | "autoCapitalize">;
