import { ThemedText } from "@/app/hooks/ThemedTextColor";
import { Ionicons } from "@expo/vector-icons";
import { Pressable } from "react-native";

import { XStack, YStack } from "tamagui";

const RATING_LABELS = [
  "Tệ",
  "Không hài lòng",
  "Bình thường",
  "Tốt",
  "Tuyệt vời",
];

type StarRatingProps = {
  id: number;
  value: number;
  onChange: (value: number) => void;
};

export const StartRating = ({ value, onChange }: StarRatingProps) => {
  const handlePress = (index: number) => {
    onChange(index + 1);
  };

  return (
    <YStack justifyContent="center" alignItems="center" gap="$8">
      <XStack gap="$3">
        {[...Array(5)].map((_, index) => {
          const isFilled = index < value;
          return (
            <Pressable key={index} onPress={() => handlePress(index)}>
              <XStack position="relative">
                <Ionicons
                  name={isFilled ? "star" : "star-outline"}
                  size={40}
                  color="#FFC107"
                />
              </XStack>
            </Pressable>
          );
        })}
      </XStack>
      <XStack>
        {value > 0 && (
          <ThemedText fontSize="$5" fontWeight="600">
            {RATING_LABELS[value - 1]}
          </ThemedText>
        )}
      </XStack>
    </YStack>
  );
};
