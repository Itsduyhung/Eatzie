import { CustomInput } from "@/components/ui/CustomInput";
import { CustomPasswordInput } from "@/components/ui/CustomPasswordInput";
import { CustomInputProps } from "@/types/input/CustomInputProps";
import { PasswordInputProps } from "@/types/input/CustomPasswordProps";
import { useField } from "formik";

export function FormikInput(
  props: { name: string } & Omit<CustomInputProps, "field" | "meta">
) {
  const [field, meta] = useField(props.name);
  return <CustomInput {...props} field={field} meta={meta} />;
}

export function FormikPasswordInput(
  props: { name: string } & Omit<PasswordInputProps, "field" | "meta">
) {
  const [field, meta] = useField(props.name);
  return <CustomPasswordInput {...props} field={field} meta={meta} />;
}
