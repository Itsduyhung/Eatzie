// components/ui/CustomPasswordInput.tsx
import { Eye, EyeOff } from "@tamagui/lucide-icons";
import { useEffect, useRef, useState } from "react";
import { TextInput, TouchableOpacity } from "react-native";
import { XStack } from "tamagui";

import { useThemedTextColor } from "@/app/hooks/ThemedTextColor";
import { PasswordInputProps } from "@/types/input/CustomPasswordProps";
import { CustomInput } from "./CustomInput";

export function CustomPasswordInput(props: PasswordInputProps) {
  const [secure, setSecure] = useState(true);
  const { textColor } = useThemedTextColor();
  const inputRef = useRef<TextInput>(null);

  const toggleSecure = () => setSecure((prev) => !prev);

  useEffect(() => {
    // Focus lại sau khi remount
    requestAnimationFrame(() => {
      inputRef.current?.focus?.();
    });
  }, [secure]);

  const EyeIconComponent = secure ? EyeOff : Eye;

  return (
    <CustomInput
      {...props}
      ref={inputRef}
      secureTextEntry={secure}
      key={`password-${secure}`} // Force re-render Input
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
