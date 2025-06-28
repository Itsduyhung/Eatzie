import { useFormError } from "@/app/hooks/FormErrorContext";
import { useThemedTextColor } from "@/app/hooks/ThemedTextColor";
import { CustomInputProps } from "@/types/input/CustomInputProps";
import { forwardRef } from "react";
import { TextInput } from "react-native";
import { Input, SizableText, YStack } from "tamagui";

export const CustomInput = forwardRef<TextInput, CustomInputProps>(
  (props, ref) => {
    const {
      field,
      meta,
      color,
      backgroundColor,
      borderColor,
      placeholderTextColor,
      suffixIcon,
      secureTextEntry,
      inputRef,
      ...rest
    } = props;

    const { textColor } = useThemedTextColor();
    const { showError } = useFormError();

    const inputRefToUse = inputRef ?? ref;
    const handleChange = field.onChange(field.name);
    const handleBlur = field.onBlur(field.name);

    return (
      <YStack position="relative">
        <Input
          {...rest}
          key={secureTextEntry ? "secure" : "plain"}
          ref={inputRefToUse}
          value={field.value ?? ""}
          onChangeText={handleChange}
          onBlur={handleBlur}
          secureTextEntry={secureTextEntry}
          color={color ?? textColor}
          backgroundColor={backgroundColor ?? "$background"}
          borderColor={borderColor ?? "$borderColor"}
          placeholderTextColor={placeholderTextColor ?? "#999"}
          autoCorrect={false}
          autoComplete="off"
          textContentType="none"
        />
        {suffixIcon && (
          <YStack
            position="absolute"
            right={0}
            height="100%"
            justifyContent="center"
            px="$2"
            pointerEvents="box-none"
          >
            {suffixIcon}
          </YStack>
        )}
        {showError && meta?.error && (
          <SizableText mt="$1" color="$red10" size="$2">
            {meta.error}
          </SizableText>
        )}
      </YStack>
    );
  }
);

CustomInput.displayName = "CustomInput";
