import { TouchableOpacity } from "react-native";
import { Text, XStack } from "tamagui";

export function RowItem({
  index,
  label,
  onPress,
  color,
}: {
  index: number;
  label: string;
  onPress: () => void;
  color?: string;
}) {
  return (
    <TouchableOpacity onPress={onPress}>
      <XStack height={44} alignItems="center">
        <Text width={20} color={index <= 3 ? "red" : "#888"}>
          {index}
        </Text>
        <Text color={color} numberOfLines={1}>
          {label}
        </Text>
      </XStack>
    </TouchableOpacity>
  );
}
