import { Eye, EyeOff } from "@tamagui/lucide-icons";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import {
  NativeSyntheticEvent,
  Pressable,
  TextInput,
  TextInputFocusEventData,
  TextInputSelectionChangeEventData,
} from "react-native";

import { PasswordInputProps } from "@/types/input/CustomPasswordProps";
import { CustomInput } from "./CustomInput";

export interface CustomPasswordInputRef {
  getValue: () => string;
  focus: () => void;
}

export const CustomPasswordInput = forwardRef<
  CustomPasswordInputRef,
  PasswordInputProps
>((props, ref) => {
  const inputRef = useRef<TextInput>(null);
  const [realValue, setRealValue] = useState(
    props.field?.value ?? props.value ?? ""
  );
  const [displayValue, setDisplayValue] = useState(
    "•".repeat(realValue.length)
  );
  const [secure, setSecure] = useState(true);
  const [focused, setFocused] = useState(false);
  const [selection, setSelection] = useState<{ start: number; end: number }>({
    start: realValue.length,
    end: realValue.length,
  });

  const isFormik = !!props.field;
  const formikName = props.field?.name;
  const setFormikValue = props.field?.onChange?.(formikName);
  const setFormikTouched = props.field?.onBlur?.(formikName);

  useImperativeHandle(ref, () => ({
    getValue: () => realValue,
    focus: () => inputRef.current?.focus(),
  }));

  const handleChangeText = (text: string) => {
    const prevDisplay = displayValue;
    const prevReal = realValue;
    const prevSelection = selection;

    let newReal = prevReal;

    // Nếu đang chọn đoạn text rồi gõ -> xoá đoạn chọn
    if (prevSelection.start !== prevSelection.end) {
      newReal =
        prevReal.slice(0, prevSelection.start) +
        prevReal.slice(prevSelection.end);
    }

    const diff = text.length - prevDisplay.length;

    if (diff > 0) {
      // Gõ thêm (text chênh lệch về độ dài)
      const inserted = text.slice(
        prevSelection.start,
        prevSelection.start + diff
      );
      newReal =
        newReal.slice(0, prevSelection.start) +
        inserted +
        newReal.slice(prevSelection.start);
    } else if (diff < 0) {
      // Xoá (backspace hoặc delete)
      const deleteCount = Math.abs(diff);
      const deleteStart = Math.max(prevSelection.start - deleteCount, 0);
      newReal =
        newReal.slice(0, deleteStart) + newReal.slice(prevSelection.start);
    }

    setRealValue(newReal);
    if (isFormik) setFormikValue?.(newReal);
    setDisplayValue(secure ? "•".repeat(newReal.length) : newReal);

    const newCursor = Math.max(
      0,
      prevSelection.start + (diff > 0 ? diff : diff)
    );
    setSelection({ start: newCursor, end: newCursor });
  };

  const handleSelectionChange = (
    e: NativeSyntheticEvent<TextInputSelectionChangeEventData>
  ) => {
    setSelection(e.nativeEvent.selection);
  };

  const toggleSecure = () => {
    const toggled = !secure;
    setSecure(toggled);
    setDisplayValue(toggled ? "•".repeat(realValue.length) : realValue);

    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.setNativeProps({ selection });
    }, 30);
  };

  const handleFocus = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    setFocused(true);
    props.onFocus?.(e);
  };

  const handleBlur = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    setFocused(false);
    props.onBlur?.(e);
    if (isFormik) setFormikTouched?.(e);
  };

  // Luôn cập nhật con trỏ đúng vị trí sau khi thay đổi giá trị
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.setNativeProps({ selection });
    }
  }, [displayValue]);

  const SuffixIcon = (
    <Pressable onPress={toggleSecure} hitSlop={10}>
      {secure ? <EyeOff size={18} /> : <Eye size={18} />}
    </Pressable>
  );

  return (
    <CustomInput
      {...props}
      ref={inputRef}
      value={displayValue}
      onChangeText={handleChangeText}
      onSelectionChange={handleSelectionChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      suffixIcon={SuffixIcon}
      autoCorrect={false}
      autoComplete="off"
      textContentType="none"
      secureTextEntry={false} // BẮT BUỘC là false để mình tự xử lý
      paddingLeft={12}
      focused={focused}
    />
  );
});

CustomPasswordInput.displayName = "CustomPasswordInput";
