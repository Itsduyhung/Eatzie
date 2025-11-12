import { ChevronDown, CloudSun, MapPin } from "@tamagui/lucide-icons";
import { Text, XStack } from "tamagui";

interface LocationBarProps {
  locationName: string;
  onPress?: () => void;
}

function getShortAddress(display_name: string) {
  if (!display_name) return " ";
  const parts = display_name.split(",").map((p) => p.trim());

  return parts[0] + " " + parts[1] || display_name;
}

export function LocationBar({ locationName, onPress }: LocationBarProps) {
  return (
    <XStack
      paddingHorizontal="$5"
      paddingVertical="$3"
      alignItems="center"
      justifyContent="space-between"
      width="100%"
    >
      <XStack alignItems="center" gap="$1" onPress={onPress}>
        <MapPin size={18} color="white" />
        <Text color="white" fontWeight="600" fontSize={15}>
          {getShortAddress(locationName) || "Chọn vị trí"}
        </Text>
        <ChevronDown size={18} color="white" />
      </XStack>

      <XStack alignItems="center" gap="$2">
        <CloudSun size={18} color="white" />
      </XStack>
    </XStack>
  );
}
