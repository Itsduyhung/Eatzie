import { BlackWithShadowFocusStyle } from "@/app/constant/inputStyles";
import { CustomInput } from "@/components/ui/CustomInput";
import { CustomInputProps } from "@/types/input/CustomInputProps";
import { PasswordInputProps } from "@/types/input/CustomPasswordProps";
import { useField } from "formik";
import { Text, YStack } from "tamagui";
import { CustomPasswordInput1 } from "../ui/CustomPassWordInput1";

export function FormikInput(
  props: { name: string; label?: string } & Omit<
    CustomInputProps,
    "field" | "meta"
  >
) {
  const [field, meta] = useField(props.name);
  return (
    <CustomInput
      {...props}
      field={field}
      meta={meta}
      focusStyle={BlackWithShadowFocusStyle}
      color="#000000"
    />
  );
}

export function FormikPasswordInput(
  props: { name: string } & Omit<PasswordInputProps, "field" | "meta">
) {
  const [field, meta] = useField(props.name);
  return (
    <CustomPasswordInput1
      {...props}
      field={field}
      meta={meta}
      focusStyle={BlackWithShadowFocusStyle}
      textContentType="none"
      autoComplete="off"
      height={typeof props.height === "string" ? undefined : props.height}
    />
  );
}

export function MoneyInput(
  props: { name: string; label?: string } & Omit<
    CustomInputProps,
    "field" | "meta"
  >
) {
  const [field, meta] = useField(props.name);
  return (
    <YStack width="$12">
      <CustomInput
        {...props}
        field={field}
        meta={meta}
        height="$5"
        paddingBottom={8}
        size="$5"
        focusStyle={BlackWithShadowFocusStyle}
        onChangeText={(text) => {
          const numericText = text.replace(/[^\d]/g, "");
          field.onChange(field.name)(numericText);
        }}
      />
      {meta.touched && meta.error && (
        <Text color="red" fontSize={12}>
          {meta.error}
        </Text>
      )}
    </YStack>
  );
}
