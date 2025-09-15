import { TouchableOpacity } from "react-native";
import { Text } from "tamagui";

export function ClearButton({ onClear }: { onClear: () => void }) {
  return (
    <TouchableOpacity onPress={onClear}>
      <Text color="red" fontSize={12}>
        Xóa
      </Text>
    </TouchableOpacity>
  );
}
