import React, { createContext, useCallback, useRef, useState } from "react";
import { Animated, StyleSheet } from "react-native";

export type Position = { x: number; y: number };
type FlyItem = { id: number; start: Position; end: Position };

export const FlyToCartContext = createContext<{
  fly: (start: Position, end: Position) => void;
}>({ fly: () => {} });

let idCounter = 0;

export const FlyToCartProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [items, setItems] = useState<FlyItem[]>([]);

  const fly = useCallback((start: Position, end: Position) => {
    const id = idCounter++;
    setItems((prev) => [...prev, { id, start, end }]);
    setTimeout(() => {
      setItems((prev) => prev.filter((item) => item.id !== id));
    }, 800);
  }, []);

  return (
    <FlyToCartContext.Provider value={{ fly }}>
      {children}
      {items.map(({ id, start, end }) => (
        <FlyDot key={id} start={start} end={end} />
      ))}
    </FlyToCartContext.Provider>
  );
};

const FlyDot = ({ start, end }: { start: Position; end: Position }) => {
  const progress = useRef(new Animated.Value(0)).current;
  const [xValue] = useState(new Animated.Value(start.x));
  const [yValue] = useState(new Animated.Value(start.y));

  React.useEffect(() => {
    const h = 120;

    progress.addListener(({ value }) => {
      const t = value;
      const x = start.x + (end.x - start.x) * t;
      const y = start.y + (end.y - start.y) * t - h * 4 * t * (1 - t); // Công thức hình cung

      xValue.setValue(x);
      yValue.setValue(y);
    });

    Animated.timing(progress, {
      toValue: 1,
      duration: 600,
      useNativeDriver: false,
    }).start(() => {
      progress.removeAllListeners();
    });
  }, []);

  return (
    <Animated.View
      style={[
        styles.dot,
        {
          transform: [{ translateX: xValue }, { translateY: yValue }],
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  dot: {
    width: 10,
    height: 10,
    backgroundColor: "#FF4444",
    borderRadius: 20,
    position: "absolute",
    zIndex: 1000,
  },
});
