import { CustomInputProps1 } from "@/types/input/CustomInputProps1";
import { Eye, EyeOff } from "@tamagui/lucide-icons";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import {
  Animated,
  NativeSyntheticEvent,
  PanResponder,
  TextInput,
  TextInputKeyPressEventData,
  TextInputSelectionChangeEventData,
  TextLayoutEventData,
  TouchableOpacity,
} from "react-native";
import { Stack, Text } from "tamagui";
import { CustomInputBase } from "./CustomInputBase";

export type CustomInputRef = {
  focus: () => void;
  getValue: () => string;
};

export const CustomPasswordInput1 = forwardRef<
  CustomInputRef,
  CustomInputProps1
>((props, ref) => {
  const {
    value,
    onChangeText,
    onFocus,
    onBlur,
    field,
    meta,
    onSelectionChange,
    label,
    showError,
    errorMessage,
    focusStyle,
    paddingLeft = 12,
    size = "$4",
    ...rest
  } = props;

  const inputRef = useRef<TextInput>(null);
  const [realValue, setRealValue] = useState(value ?? "");
  const [displayValue, setDisplayValue] = useState("");
  const [selection, setSelection] = useState({ start: 0, end: 0 });
  const [focused, setFocused] = useState(false);
  const [secure, setSecure] = useState(true);
  const [textWidth, setTextWidth] = useState(0);

  const isFormik = !!field;
  const inputValue = isFormik ? field.value : value ?? "";
  const handleChange = isFormik ? field.onChange?.(field.name) : onChangeText;
  const handleBlur = isFormik ? field.onBlur?.(field.name) : onBlur;

  const blinkOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    setRealValue(inputValue);
    const secureMasked = "\u200B".repeat(inputValue.length);
    setDisplayValue(secure ? secureMasked : inputValue);
  }, [inputValue, secure]);

  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current?.focus(),
    getValue: () => realValue,
  }));

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => secure,
      onMoveShouldSetPanResponder: () => secure,
      onPanResponderGrant: (e) => {
        if (secure) e.preventDefault?.();
      },
      onShouldBlockNativeResponder: () => true,
    })
  ).current;

  const handleKeyPress = (
    e: NativeSyntheticEvent<TextInputKeyPressEventData>
  ) => {
    if (!secure) return;
    const key = e.nativeEvent.key;
    if (!key || key === "Unidentified") return;

    setRealValue((prev) => {
      let next = prev;
      const { start, end } = selection;

      if (key === "Backspace") {
        if (start === end && start > 0) {
          next = prev.slice(0, start - 1) + prev.slice(end);
          setSelection({ start: start - 1, end: start - 1 });
        } else {
          next = prev.slice(0, start) + prev.slice(end);
          setSelection({ start, end: start });
        }
      } else if (key.length > 0) {
        next = prev.slice(0, start) + key + prev.slice(end);
        setSelection({ start: start + 1, end: start + 1 });
      }

      handleChange?.(next);
      setDisplayValue("\u200B".repeat(next.length));
      return next;
    });
  };

  const handleSelectionChange = (
    e: NativeSyntheticEvent<TextInputSelectionChangeEventData>
  ) => {
    const { start, end } = e.nativeEvent.selection;
    setSelection({ start, end });
    onSelectionChange?.(e);
  };

  const handleTextLayout = (e: NativeSyntheticEvent<TextLayoutEventData>) => {
    const { lines } = e.nativeEvent;
    setTextWidth(lines.length > 0 ? lines[0].width : 0);
  };

  useEffect(() => {
    if (!secure || !focused) return;

    const blink = Animated.loop(
      Animated.sequence([
        Animated.timing(blinkOpacity, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(blinkOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    );

    blink.start();

    return () => {
      blink.stop();
      blinkOpacity.setValue(1);
    };
  }, [secure, focused]);

  return (
    <CustomInputBase
      borderColor={"#484848"}
      label={label}
      value={secure ? displayValue : realValue}
      focused={focused}
      showError={showError}
      errorMessage={errorMessage}
      focusStyle={{ borderColor: "black", borderWidth: 1.5 }}
      paddingLeft={paddingLeft}
      size={size}
      suffixIcon={
        focused ? (
          <TouchableOpacity
            onPress={() => {
              setSecure((prev) => !prev);
              requestAnimationFrame(() => {
                inputRef.current?.focus();
              });
            }}
            style={{
              height: 12,
              width: 36,
              justifyContent: "center",
              alignItems: "center",
              paddingHorizontal: 8,
            }}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            {secure ? (
              <Eye color="#484848" size={23} />
            ) : (
              <EyeOff color="#484848" size={20} />
            )}
          </TouchableOpacity>
        ) : null
      }
      {...rest}
    >
      <Stack flexDirection="row" alignItems="center" flex={1}>
        <TextInput
          ref={inputRef}
          value={secure ? displayValue : realValue}
          onKeyPress={secure ? handleKeyPress : undefined}
          onChangeText={!secure ? handleChange : undefined}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            handleBlur?.(e);
          }}
          onSelectionChange={handleSelectionChange}
          autoCorrect={false}
          secureTextEntry={false}
          caretHidden={secure}
          contextMenuHidden={secure}
          selectTextOnFocus={!secure}
          editable
          style={{
            padding: 0,
            color: secure ? "transparent" : "#000",
            fontSize: 18,
            flex: 1,
          }}
          {...(secure ? panResponder.panHandlers : {})}
        />
      </Stack>

      {secure && (
        <Stack
          position="absolute"
          top={0}
          left={0}
          flexDirection="row"
          alignItems="center"
          pointerEvents="none"
        >
          <Text
            bottom={7}
            left={-2}
            fontSize={25}
            color="black"
            letterSpacing={-1}
            fontFamily="System"
            onTextLayout={handleTextLayout}
          >
            {"•".repeat(realValue.length) || " "}
          </Text>

          {focused && (
            <Animated.View
              style={{
                position: "absolute",
                top: 0,
                left: textWidth - 4,
                width: 2,
                height: 21,
                backgroundColor: "#6666FF",
                opacity: blinkOpacity,
              }}
            />
          )}
        </Stack>
      )}
    </CustomInputBase>
  );
});

CustomPasswordInput1.displayName = "CustomPasswordInput1";
