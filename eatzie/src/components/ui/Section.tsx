import { Text, XStack, YStack } from "tamagui";

export function Section({
  title,
  children,
  rightAction,
}: {
  title: string;
  children: React.ReactNode;
  rightAction?: React.ReactNode;
}) {
  return (
    <YStack gap="$2">
      <XStack justifyContent="space-between" alignItems="center">
        <Text fontWeight="700">{title}</Text>
        {rightAction}
      </XStack>
      {children}
    </YStack>
  );
}
