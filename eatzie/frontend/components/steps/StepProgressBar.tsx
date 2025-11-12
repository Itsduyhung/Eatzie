import { Pressable } from "react-native";
import { View, XStack } from "tamagui";

type StepProgressBarProps = {
  currentStep: number;
  totalSteps: number;
  onStepChange: (step: number) => void;
};

export const StepProgressBar = ({
  currentStep,
  totalSteps,
  onStepChange,
}: StepProgressBarProps) => {
  return (
    <XStack gap="$2" justifyContent="center" marginBottom="$3">
      {Array.from({ length: totalSteps }).map((_, index) => {
        const isActive = index <= currentStep;
        return (
          <Pressable key={index} onPress={() => onStepChange(index)}>
            <View
              width={24}
              height={8}
              borderRadius={999}
              backgroundColor={isActive ? "#6666FF" : "#FFFFFF"}
            />
          </Pressable>
        );
      })}
    </XStack>
  );
};
