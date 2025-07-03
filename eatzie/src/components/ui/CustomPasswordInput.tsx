import { Eye, EyeOff } from "@tamagui/lucide-icons";
import { useEffect, useRef, useState } from "react";
import { TextInput, TouchableOpacity } from "react-native";
import { XStack } from "tamagui";

import { useThemedTextColor } from "@/app/hooks/ThemedTextColor";
import { PasswordInputProps } from "@/types/input/CustomPasswordProps";
import { CustomInput } from "./CustomInput";

export function CustomPasswordInput(props: PasswordInputProps) {
  const [secure, setSecure] = useState(true);
  const [displayValue, setDisplayValue] = useState("");
  const inputRef = useRef<TextInput>(null);
  const { textColor } = useThemedTextColor();

  const realValue = props.field?.value ?? "";

  useEffect(() => {
    setDisplayValue(secure ? "•".repeat(realValue.length) : realValue);
  }, [secure, realValue]);

  const handleChange = (text: string) => {
    const oldValue = realValue;
    const isDeleting = text.length < oldValue.length;

    let newValue = "";

    if (isDeleting) {
      newValue = oldValue.slice(0, text.length);
    } else {
      const addedChar = text[text.length - 1] ?? "";
      newValue = oldValue + addedChar;
    }

    props.field.onChange(props.field.name)(newValue);
  };

  const toggleSecure = () => {
    setSecure((prev) => !prev);
    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  };

  const EyeIconComponent = secure ? EyeOff : Eye;

  return (
    <CustomInput
      {...props}
      ref={inputRef}
      secureTextEntry={false}
      value={displayValue}
      onChangeText={handleChange}
      suffixIcon={
        <TouchableOpacity
          onPress={toggleSecure}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <XStack px="$2">
            <EyeIconComponent size={20} color={textColor} />
          </XStack>
        </TouchableOpacity>
      }
    />
  );
}
