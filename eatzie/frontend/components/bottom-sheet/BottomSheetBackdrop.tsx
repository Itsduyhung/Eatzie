import { Pressable, StyleSheet } from "react-native";
import Animated from "react-native-reanimated";

export const BottomSheetBackdrop = ({
  animatedStyle,
  onPress,
}: {
  animatedStyle: any;
  onPress: () => void;
}) => (
  <Animated.View
    pointerEvents="box-none"
    style={[styles.backdrop, animatedStyle]}
  >
    <Pressable style={StyleSheet.absoluteFill} onPress={onPress} />
  </Animated.View>
);

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
});
