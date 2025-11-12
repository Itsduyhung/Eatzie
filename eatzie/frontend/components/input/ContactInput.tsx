import { ContactInputProps } from "@/types/input/contactInput.types";
import { Input, SizableText, YStack } from "tamagui";

export function ContactInput({
  value,
  onChange,
  error,
  mode = "email",
  ...rest
}: {
  value: string;
  onChange: (text: string) => void;
  error?: string;
} & ContactInputProps) {
  return (
    <YStack gap="$1">
      <SizableText>Email / Số điện thoại</SizableText>
      <Input
        placeholder={mode === "email" ? "Email" : "Số điện thoại"}
        value={value}
        onChangeText={onChange}
        keyboardType={mode === "email" ? "email-address" : "phone-pad"}
        autoCapitalize="none"
        {...rest}
      />
      {!!error && (
        <SizableText color="$red10" size="$2">
          {error}
        </SizableText>
      )}
    </YStack>
  );
}
