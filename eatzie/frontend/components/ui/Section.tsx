import { Text, XStack, YStack } from "tamagui";

export function Section({
  title,
  children,
  rightAction,
  color,
  leftIcon,
}: {
  title: string;
  children: React.ReactNode;
  rightAction?: React.ReactNode;
  color?: string;
  leftIcon?: React.ReactNode;
}) {
  return (
    <YStack gap="$2">
      <XStack justifyContent="space-between" alignItems="center">
        <XStack gap="$2">
          {leftIcon}
          <Text color={color} fontWeight="700">
            {title}
          </Text>
        </XStack>

        {rightAction}
      </XStack>
      {children}
    </YStack>
  );
}
