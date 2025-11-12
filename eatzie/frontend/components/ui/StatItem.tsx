import { ThemedText } from "@/hooks/ThemedTextColor";
import { Text, XStack, YStack } from "tamagui";

interface StatItemProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
}

export function StatItem({ icon, value, label }: StatItemProps) {
  return (
    <YStack alignItems="center" gap="$2">
      <XStack alignItems="center" gap="$2">
        {icon}

        <ThemedText style={{ fontSize: 18, fontWeight: 700, color: "black" }}>
          {value}
        </ThemedText>
      </XStack>
      <Text fontSize="$4" color="$gray10">
        {label}
      </Text>
    </YStack>
  );
}
