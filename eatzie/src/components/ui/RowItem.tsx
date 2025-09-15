import { TouchableOpacity } from "react-native";
import { Text, XStack } from "tamagui";

export function RowItem({
  index,
  label,
  onPress,
}: {
  index: number;
  label: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity onPress={onPress}>
      <XStack
        paddingVertical={10}
        borderBottomWidth={1}
        borderColor="#eee"
        alignItems="center"
      >
        <Text width={24} color={index <= 3 ? "red" : "#888"}>
          {index}
        </Text>
        <Text>{label}</Text>
      </XStack>
    </TouchableOpacity>
  );
}
