import { useEffect } from "react";
import { Dimensions, StyleSheet, ViewStyle } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { BottomSheetBackdrop } from "./BottomSheetBackdrop";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

interface BottomSheetProps {
  children: React.ReactNode;
  visible: boolean;
  onClose: () => void;
  height?: number;
  style?: ViewStyle;
}

export function BottomSheet({
  children,
  visible,
  onClose,
  height = SCREEN_HEIGHT * 0.7,
  style,
}: BottomSheetProps) {
  const translateY = useSharedValue(SCREEN_HEIGHT);
  const prevTranslationY = useSharedValue(0);

  useEffect(() => {
    translateY.value = withSpring(SCREEN_HEIGHT - height, {
      damping: 18,
      stiffness: 120,
    });
  }, []);

  const panGesture = Gesture.Pan()
    .onStart((event) => {
      prevTranslationY.value = event.translationY;
    })
    .onUpdate((event) => {
      const deltaY = event.translationY - prevTranslationY.value;
      translateY.value = Math.max(
        SCREEN_HEIGHT - height,
        translateY.value + deltaY
      );
      prevTranslationY.value = event.translationY;
    })
    .onEnd(() => {
      if (translateY.value > SCREEN_HEIGHT - height / 3) {
        translateY.value = withTiming(SCREEN_HEIGHT, { duration: 250 });
        runOnJS(onClose)(); // Gọi đóng khi kéo xuống quá xa
      } else {
        translateY.value = withSpring(SCREEN_HEIGHT - height, {
          damping: 18,
          stiffness: 120,
        });
      }
    });

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const backdropOpacity = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateY.value,
      [SCREEN_HEIGHT - height, SCREEN_HEIGHT],
      [1, 0],
      Extrapolation.CLAMP
    );
    return { opacity };
  });

  return (
    <>
      {/* Backdrop mờ nền, bấm để đóng */}
      <BottomSheetBackdrop animatedStyle={backdropOpacity} onPress={onClose} />

      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.sheet, style, { height }, sheetStyle]}>
          {children}
        </Animated.View>
      </GestureDetector>
    </>
  );
}

const styles = StyleSheet.create({
  sheet: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    marginTop: "auto",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
});
