import { useEffect, useRef, useState } from "react";
import {
  NativeSyntheticEvent,
  PanResponder,
  StyleSheet,
  Text,
  TextInput,
  TextInputKeyPressEventData,
  TextInputSelectionChangeEventData,
  TextLayoutEventData,
  TouchableOpacity,
  View,
} from "react-native";

type Props = {
  label?: string;
  value: string;
  onChangeText: (val: string) => void;
  onBlur?: () => void;
  showError?: boolean;
  errorMessage?: string;
};

export function PasswordInput({
  label = "Mật khẩu",
  value,
  onChangeText,
  onBlur,
  showError,
  errorMessage,
}: Props) {
  const inputRef = useRef<TextInput>(null);
  const [realValue, setRealValue] = useState(value);
  const [displayValue, setDisplayValue] = useState("");
  const [selection, setSelection] = useState({ start: 0, end: 0 });
  const [secure, setSecure] = useState(true);
  const [focused, setFocused] = useState(false);
  const [textWidth, setTextWidth] = useState(0);

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

  useEffect(() => {
    setRealValue(value);
  }, [value]);

  const handleKeyPress = (
    e: NativeSyntheticEvent<TextInputKeyPressEventData>
  ) => {
    if (!secure) return;

    const key = e.nativeEvent.key;

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
      } else if (key.length === 1) {
        next = prev.slice(0, start) + key + prev.slice(end);
        setSelection({ start: start + 1, end: start + 1 });
      }

      onChangeText(next);
      return next;
    });
  };

  const handleSelectionChange = (
    e: NativeSyntheticEvent<TextInputSelectionChangeEventData>
  ) => {
    const { start, end } = e.nativeEvent.selection;
    setSelection({ start, end });
  };

  const handleTextLayout = (e: NativeSyntheticEvent<TextLayoutEventData>) => {
    const { lines } = e.nativeEvent;
    setTextWidth(lines.length > 0 ? lines[0].width : 0);
  };

  useEffect(() => {
    if (secure) {
      setDisplayValue("\u200B".repeat(realValue.length));
    } else {
      setDisplayValue(realValue);
      setTimeout(() => {
        inputRef.current?.setNativeProps({ selection });
      }, 8);
    }
  }, [secure, realValue]);

  return (
    <View style={styles.container}>
      {!!label && <Text style={styles.label}>{label}</Text>}

      <TouchableOpacity
        activeOpacity={1}
        onPress={() => inputRef.current?.focus()}
        style={[styles.inputWrapper, focused && styles.focusedBorder]}
        {...(secure ? panResponder.panHandlers : {})}
      >
        <TextInput
          ref={inputRef}
          value={secure ? displayValue : realValue}
          onChangeText={
            secure
              ? undefined
              : (text) => {
                  setRealValue(text);
                  onChangeText(text);
                }
          }
          onKeyPress={secure ? handleKeyPress : undefined}
          onSelectionChange={handleSelectionChange}
          onFocus={() => setFocused(true)}
          onBlur={() => {
            setFocused(false);
            onBlur?.();
          }}
          autoCorrect={false}
          autoComplete="password"
          secureTextEntry={false}
          caretHidden={secure}
          contextMenuHidden={secure}
          selectTextOnFocus={!secure}
          editable
          selectionColor="#000"
          style={[styles.realInput, secure && styles.transparentInput]}
        />

        {secure && (
          <View style={styles.fakeLayer} pointerEvents="none">
            <Text
              style={styles.fakeText}
              onTextLayout={handleTextLayout}
              numberOfLines={1}
            >
              {"•".repeat(realValue.length) || " "}
            </Text>
            {focused && (
              <View style={[styles.fakeCaret, { left: textWidth + 3 }]} />
            )}
          </View>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.toggle}
        onPress={() => setSecure((prev) => !prev)}
      >
        <Text style={styles.toggleText}>
          {secure ? "👁 Hiện mật khẩu" : "🙈 Ẩn mật khẩu"}
        </Text>
      </TouchableOpacity>

      {!!showError && !!errorMessage && (
        <Text style={styles.errorText}>{errorMessage}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: "#222",
  },
  inputWrapper: {
    borderWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 12,
    paddingHorizontal: 12,
    fontSize: 18,
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
    position: "relative",
    minHeight: 48,
    justifyContent: "center",
  },
  focusedBorder: {
    borderColor: "#007bff",
    borderWidth: 2,
  },
  realInput: {
    fontSize: 18,
    color: "#000",
    padding: 0,
  },
  transparentInput: {
    color: "transparent",
  },
  fakeLayer: {
    position: "absolute",
    top: 12,
    left: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  fakeText: {
    fontSize: 18,
    color: "#000",
  },
  fakeCaret: {
    position: "absolute",
    top: 1,
    width: 2,
    height: 22,
    backgroundColor: "#000",
  },
  toggle: {
    marginTop: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: "#007bff",
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  toggleText: {
    color: "#fff",
    fontWeight: "bold",
  },
  errorText: {
    marginTop: 6,
    color: "red",
    fontSize: 14,
  },
});
