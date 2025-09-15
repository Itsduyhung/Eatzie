import { TouchableOpacity, View } from "react-native";
import { Text } from "tamagui";

export function TagButton({
  label,
  onPress,
}: {
  label: string;
  onPress: () => void;
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
        <Text>{label}</Text>
      </View>
    </TouchableOpacity>
  );
}
