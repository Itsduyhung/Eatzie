import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";

export function ClearButton({ onClear }: { onClear: () => void }) {
  return (
    <TouchableOpacity onPress={onClear}>
      <Ionicons name="trash-outline" size={18} color="black" />
    </TouchableOpacity>
  );
}
