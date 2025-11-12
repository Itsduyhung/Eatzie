import { useIsFocused } from "@react-navigation/native";
import React, { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";

interface VerticalPlaceholderProps {
  items: string[];
  itemHeight?: number;
  displayDuration?: number;
  transitionDuration?: number;
  visible?: boolean;
}

export function VerticalPlaceholder({
  items,
  itemHeight = 30,
  displayDuration = 3000,
  transitionDuration = 500,
  visible = true,
}: VerticalPlaceholderProps) {
  const translateY = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;
  const currentIndex = useRef(0);
  const isFocused = useIsFocused();

  const allPanels = [...items, ...items];
  const panelLength = items.length;

  useEffect(() => {
    if (!isFocused || panelLength <= 1) return;

    let isMounted = true;
    let animation: Animated.CompositeAnimation | null = null;

    const runAnimation = (index = currentIndex.current) => {
      if (!isMounted) return;
      const nextIndex = index + 1;

      animation = Animated.sequence([
        Animated.delay(displayDuration),
        Animated.parallel([
          Animated.timing(translateY, {
            toValue: -nextIndex * itemHeight,
            duration: transitionDuration,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.sequence([
            Animated.timing(opacity, {
              toValue: 0,
              duration: transitionDuration / 2,
              useNativeDriver: true,
            }),
            Animated.timing(opacity, {
              toValue: 1,
              duration: transitionDuration / 2,
              useNativeDriver: true,
            }),
          ]),
        ]),
      ]);

      animation.start(({ finished }) => {
        if (!isMounted || !finished) return;

        currentIndex.current = nextIndex >= panelLength ? 0 : nextIndex;

        if (nextIndex >= panelLength) {
          translateY.setValue(0);
        }

        runAnimation(currentIndex.current);
      });
    };

    runAnimation();

    return () => {
      isMounted = false;
      animation?.stop();
      translateY.stopAnimation();
      opacity.stopAnimation();
    };
  }, [
    isFocused,
    panelLength,
    itemHeight,
    displayDuration,
    transitionDuration,
    translateY,
    opacity,
  ]);

  if (!visible) return null;

  return (
    <View
      style={[styles.container, { height: itemHeight, overflow: "hidden" }]}
    >
      <Animated.View style={{ transform: [{ translateY }] }}>
        {allPanels.map((item, i) => (
          <Animated.Text
            key={i}
            style={{
              height: itemHeight,
              lineHeight: itemHeight,
              color: "#999",
              opacity,
            }}
          >
            {item}
          </Animated.Text>
        ))}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: "100%" },
});
