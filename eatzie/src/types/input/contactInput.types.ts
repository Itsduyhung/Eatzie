import { FormikFieldBaseProps } from "../baseInput.types";

export type ContactInputMode = "email" | "phone" | "username" | "otp";

export type ContactInputProps = FormikFieldBaseProps & {
  mode: ContactInputMode;
  autoValidate?: boolean;
  countryCode?: string;
  maxLength?: number;
  showToggle?: boolean;
};
