import { FormikFieldBaseProps } from "../baseInput.types";

export type PasswordInputProps = FormikFieldBaseProps<string> & {
  showToggle?: boolean;
  eyeColor?: string;
  maxLength?: number;
};
