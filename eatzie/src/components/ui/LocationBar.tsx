import { ChevronDown, CloudSun, MapPin } from "@tamagui/lucide-icons";
import { Text, XStack } from "tamagui";

export function LocationBar() {
  return (
    <XStack
      paddingHorizontal="$5"
      paddingVertical="$3"
      alignItems="center"
      justifyContent="space-between"
      width={"100%"}
    >
      <XStack alignItems="center" gap="$1">
        <MapPin size={18} color="white" />
        <Text color="white" fontWeight="600" fontSize={15}>
          QUY NHƠN
        </Text>
        <ChevronDown size={18} color="white" />
      </XStack>

      <XStack alignItems="center" gap="$2">
        <CloudSun size={18} color="white" />
      </XStack>
    </XStack>
  );
}
