import { TextInputProps } from "react-native";
import { CustomInputProps } from "./CustomInputProps";

export type PasswordInputProps = CustomInputProps & {
  showToggle?: boolean;
  eyeColor?: string;

  showError?: boolean;
  errorMessage?: string;
  autoComplete?: TextInputProps["autoComplete"];
  textContentType?: TextInputProps["textContentType"];
};
