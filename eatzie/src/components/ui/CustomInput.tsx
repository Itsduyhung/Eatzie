import { NoFocusStyle } from "@/app/constant/inputStyles";
import { useFormError } from "@/app/hooks/FormErrorContext";
import { useThemedTextColor } from "@/app/hooks/ThemedTextColor";
import { CustomInputProps } from "@/types/input/CustomInputProps";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { TextInput } from "react-native";
import { Input, SizableText, YStack } from "tamagui";
import { FloatingLabel } from "../FloatingLabel";
// import { FloatingLabel } from "../FloatingLabel";

export const CustomInput = forwardRef<TextInput, CustomInputProps>(
  (props, forwardedRef) => {
    const {
      label,
      size = "$6",
      field,
      meta,
      color,
      backgroundColor,
      borderColor,
      placeholderTextColor,
      suffixIcon,
      secureTextEntry,
      paddingLeft = 12,
      height,
      focusStyle,
      paddingBottom = 20,
      ...rest
    } = props;

    const { textColor } = useThemedTextColor();
    const { showError } = useFormError();
    const [focused, setFocused] = useState(false);

    const innerRef = useRef<TextInput>(null);
    useImperativeHandle(forwardedRef, () => innerRef.current!);

    const isFormik = !!field;
    const inputValue = isFormik ? field?.value : props.value ?? "";
    const handleChange = isFormik
      ? field?.onChange?.(field.name)
      : props.onChangeText;
    const handleBlur = isFormik ? field?.onBlur?.(field.name) : props.onBlur;

    const resolvedFocusStyle =
      focusStyle === "none" ? NoFocusStyle : focusStyle ?? undefined;

    return (
      <YStack position="relative" justifyContent="center">
        {label && (
          <FloatingLabel
            label={label}
            focused={focused}
            filled={!!inputValue}
          />
        )}
        <Input
          {...rest}
          ref={innerRef}
          value={inputValue}
          onChangeText={handleChange}
          onBlur={(e) => {
            setFocused(false);
            handleBlur?.(e);
          }}
          onFocus={(e) => {
            setFocused(true);
            props.onFocus?.(e);
          }}
          secureTextEntry={secureTextEntry}
          size={size}
          color={color ?? textColor}
          backgroundColor={backgroundColor ?? "$background"}
          borderColor={borderColor ?? "$borderColor"}
          // placeholderTextColor={placeholderTextColor ?? "#999"}
          autoCorrect={false}
          autoComplete="off"
          textContentType="none"
          paddingLeft={paddingLeft}
          height={height}
          focusStyle={resolvedFocusStyle}
          paddingBottom={paddingBottom as number}
          paddingTop={25}
        />

        {suffixIcon && (
          <YStack
            position="absolute"
            right="$4"
            height="100%"
            justifyContent="center"
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
