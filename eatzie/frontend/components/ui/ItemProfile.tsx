import { ChevronRight } from "@tamagui/lucide-icons";
import { Text, XStack, YStack } from "tamagui";
import { CustomButton } from "./CustomButton";

interface ProfileItemDetailProps {
  title?: string;
  label?: string;
  value?: string;
  editable?: boolean;
  onPress?: () => void;
  leftContent?: React.ReactNode;
}

export const ProfileItemDetail = ({
  title,
  label,
  value,
  editable = false,
  onPress,
  leftContent,
}: ProfileItemDetailProps) => {
  const canPress = editable || !!onPress;

  return (
    <YStack>
      {title && (
        <YStack paddingHorizontal="$3" paddingVertical="$1">
          <Text fontSize="$3" color="#666">
            {title}
          </Text>
        </YStack>
      )}
      <CustomButton
        backgroundColor="white"
        onPress={onPress}
        disabled={!canPress}
        paddingVertical="$3"
        paddingHorizontal="$3"
        hoverStyle={canPress ? { backgroundColor: "#e0e0e0" } : undefined}
      >
        <XStack width="100%" alignItems="center" justifyContent="space-between">
          <XStack alignItems="center" gap="$3">
            {leftContent}
            {label && (
              <Text fontSize="$5" color="#000">
                {label}
              </Text>
            )}
          </XStack>

          <XStack alignItems="center" gap="$2">
            <Text fontSize="$4" color={value ? "red" : "#999"}>
              {value ?? (label ? `Nhập ${label}` : "")}
            </Text>
            {editable && <ChevronRight size={20} color="#000" />}
          </XStack>
        </XStack>
      </CustomButton>
    </YStack>
  );
};
