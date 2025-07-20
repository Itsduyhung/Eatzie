import { Label } from "@/types/labelProp/label";
import { useEffect, useRef } from "react";
import { Animated, StyleSheet } from "react-native";

export function FloatingLabel({ label, focused, filled }: Label) {
  const animated = useRef(
    new Animated.Value(focused || filled ? 1 : 0)
  ).current;

  useEffect(() => {
    Animated.timing(animated, {
      toValue: focused || filled ? 1 : 0,
      duration: 150,
      useNativeDriver: false,
    }).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focused, filled]);

  const translateY = animated.interpolate({
    inputRange: [0, 1],
    outputRange: [-2, -20],
  });

  const translateX = animated.interpolate({
    inputRange: [0, 1],
    outputRange: [1, -3],
  });

  const fontSize = animated.interpolate({
    inputRange: [0, 1],
    outputRange: [14, 12],
  });

  const color = animated.interpolate({
    inputRange: [0, 1],
    outputRange: ["#999", "#666"],
  });

  return (
    <Animated.Text
      style={[
        styles.label,
        {
          transform: [{ translateY }, { translateX }],
          color,
          fontSize,
        },
      ]}
      pointerEvents="none"
    >
      {label}
    </Animated.Text>
  );
}

const styles = StyleSheet.create({
  label: {
    position: "absolute",
    left: 15,
    top: 24,
    transform: [{ translateY: -9 }],
    backgroundColor: "transparent",
    zIndex: 1,
  },
});
