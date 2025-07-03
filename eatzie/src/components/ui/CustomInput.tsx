import { NoFocusStyle } from "@/app/constant/inputStyles";
import { useFormError } from "@/app/hooks/FormErrorContext";
import { useThemedTextColor } from "@/app/hooks/ThemedTextColor";
import { CustomInputProps } from "@/types/input/CustomInputProps";
import { forwardRef, useImperativeHandle, useRef } from "react";
import { TextInput } from "react-native";
import { Input, SizableText, YStack } from "tamagui";

export const CustomInput = forwardRef<TextInput, CustomInputProps>(
  (props, forwardedRef) => {
    const {
      field,
      meta,
      color,
      backgroundColor,
      borderColor,
      placeholderTextColor,
      suffixIcon,
      secureTextEntry,
      paddingLeft,
      height,
      focusStyle,
      ...rest
    } = props;

    const { textColor } = useThemedTextColor();
    const { showError } = useFormError();

    const innerRef = useRef<TextInput>(null);
    useImperativeHandle(forwardedRef, () => innerRef.current!);

    const isFormik = !!field;
    const inputValue = isFormik ? field?.value : props.value ?? "";
    const handleChange = isFormik
      ? field?.onChange?.(field.name)
      : props.onChangeText;
    const handleBlur = isFormik ? field?.onBlur?.(field.name) : props.onBlur;

    // Nếu focusStyle === "none", gán style ẩn viền
    const resolvedFocusStyle =
      focusStyle === "none" ? NoFocusStyle : focusStyle ?? undefined;

    return (
      <YStack position="relative">
        <Input
          {...rest}
          ref={innerRef}
          value={inputValue}
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
          paddingLeft={paddingLeft}
          height={height}
          focusStyle={resolvedFocusStyle}
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
