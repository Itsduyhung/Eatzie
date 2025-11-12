export type LoginFormFields = {
  emailOrPhone: string;
  password: string;
};

export type LoginFormProps = {
  onSuccess?: () => void;
  initialEmail?: string;
};
