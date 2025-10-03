import { TouchableOpacity, View } from "react-native";
import { Text } from "tamagui";

export function TagButton({
  label,
  onPress,
  color,
}: {
  label: string;
  onPress: () => void;
  color: string;
}) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View
        style={{
          paddingVertical: 6,
          paddingHorizontal: 12,
          borderRadius: 16,
          backgroundColor: "#eee",
        }}
      >
        <Text color={color}>{label}</Text>
      </View>
    </TouchableOpacity>
  );
}
