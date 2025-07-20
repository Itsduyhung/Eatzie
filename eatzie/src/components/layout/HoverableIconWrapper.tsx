import { Pressable } from "react-native";

type PressableIconProps = {
  icon: React.ElementType;
  size?: number;
  defaultColor?: string;
  pressColor?: string;
  onPress?: () => void;
  disabled?: boolean;
  hitSlop?:
    | number
    | { top: number; bottom: number; left: number; right: number };
};

export function PressableIcon({
  icon: Icon,
  size = 24,
  defaultColor = "black",
  pressColor = "#fca5a5",
  onPress,
  disabled = false,
  hitSlop = 12,
}: PressableIconProps) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={hitSlop}
      disabled={disabled}
      style={({ pressed }) => ({
        padding: 8,
        borderRadius: 100,
        alignItems: "center",
        justifyContent: "center",
        opacity: disabled ? 0.5 : pressed ? 0.8 : 1,
      })}
    >
      {({ pressed }) => (
        <Icon size={size} color={pressed ? pressColor : defaultColor} />
      )}
    </Pressable>
  );
}
