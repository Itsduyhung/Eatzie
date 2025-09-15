import {
  Step0Data,
  Step1Data,
  Step2Data,
  Step3Data,
  Step4Data,
  Step5Data,
  Step6Data,
} from "@/app/constant/welcomeScreen";
import { ThemedText } from "@/app/hooks/ThemedTextColor";
import { IOMoney, IOMoneyRef } from "@/components/input/IOMoney";
import { ScrollScreenLayout } from "@/components/layout/ScrollScreenLayout";
import { CustomButton } from "@/components/ui/CustomButton";
import { SizableImage } from "@/components/ui/SizableImageProps";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Progress, Spinner, Text, XStack, YStack } from "tamagui";

const allSteps = [
  Step0Data,
  Step1Data,
  Step2Data,
  Step3Data,
  Step4Data,
  Step5Data,
  Step6Data,
];

const MultiStepSurvey = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedItemsMap, setSelectedItemsMap] = useState<
    Record<number, string[]>
  >({});
  const [loading, setLoading] = useState(false);
  const ioMoneyRef = useRef<IOMoneyRef>(null);
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const totalSteps = allSteps.length;
  const stepData = useMemo(() => allSteps[currentStep], [currentStep]);
  const expense = useMemo(() => stepData.bodyContent?.[0]?.expense, [stepData]);

  const selectedItems = selectedItemsMap[currentStep] || [];

  const toggleSelection = (data: string) => {
    setSelectedItemsMap((prev) => {
      const current = prev[currentStep] || [];
      const updated = current.includes(data)
        ? current.filter((item) => item !== data)
        : [...current, data];
      return { ...prev, [currentStep]: updated };
    });
  };

  const stepButtons = useMemo(() => {
    if (!stepData.item?.buttonContent?.haveContent) return null;
    if (!stepData.item.buttonContent.content) return null;
    return stepData.item.buttonContent.content.map((item) => {
      const isSelected = selectedItems.includes(item.data);
      if (item.data === undefined) return null;
      return (
        <CustomButton
          marginRight="$3"
          marginBottom={10}
          key={item.data}
          size="$4"
          onPress={() => toggleSelection(item.data!)}
          textfontsize="$4"
          textfontweight="600"
          backgroundColor="#FFFFFF"
          borderRadius="$9"
          width="100%"
          isSelected={isSelected}
        >
          {item.title}
        </CustomButton>
      );
    });
  }, [stepData, selectedItems]);

  const bodyContentButtons = useMemo(() => {
    return stepData.bodyContent?.map((item) => {
      if (!item.data) return null;
      const isSelected = selectedItems.includes(item.data);
      return (
        <CustomButton
          marginRight="$4"
          key={item.data}
          onPress={() => item.data && toggleSelection(item.data)}
          backgroundColor="#FFFFFF"
          size="$5"
          textfontsize="$4"
          textfontweight="600"
          borderRadius="$9"
          iconAfter={isSelected ? "check" : "plus"}
          isSelected={isSelected}
        >
          {item.content}
        </CustomButton>
      );
    });
  }, [stepData, selectedItems]);

  useEffect(() => {
    if (currentStep === totalSteps - 1) {
      const timer1 = setTimeout(() => {
        setLoading(true);
      }, 3000);

      const timer2 = setTimeout(() => {
        router.replace("/");
      }, 8000);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
  }, [currentStep]);

  const handleNext = () => {
    if (currentStep === 5) {
      ioMoneyRef.current?.submit();
    } else if (currentStep < totalSteps - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleSubmitStep5 = (values: {
    inputMoney?: number;
    outputMoney?: number;
  }) => {
    console.log("💰 Submitted Step5 values:", values);
    setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  return (
    <ScrollScreenLayout>
      {loading ? (
        <YStack alignItems="center" justifyContent="center" flex={1}>
          <Spinner size="large" color="black" />
        </YStack>
      ) : (
        <YStack padding="$4" gap="$4" flex={1} paddingTop={insets.top}>
          <Progress
            value={Math.round(((currentStep + 1) / totalSteps) * 100)}
            backgroundColor="white"
          >
            <Progress.Indicator animation="bouncy" backgroundColor="#6666FF" />
          </Progress>

          <YStack alignItems="center" gap="$3" marginTop={insets.top}>
            {stepData.item?.title?.map((line, i) => (
              <ThemedText
                key={i}
                fontSize="$9"
                fontWeight="700"
                textAlign="center"
              >
                {line}
              </ThemedText>
            ))}
          </YStack>

          {stepData.item?.image && (
            <YStack alignItems="center" marginTop={insets.top}>
              <SizableImage
                source={stepData.item.image}
                resizeMode="contain"
                style={{ width: 200, height: 200 }}
              />
            </YStack>
          )}

          {stepButtons && (
            <YStack
              gap="$2"
              alignItems="center"
              width="100%"
              marginTop={insets.top}
            >
              {stepButtons}
            </YStack>
          )}

          {currentStep === 5 && expense && (
            <IOMoney
              ref={ioMoneyRef}
              payMoney={expense}
              onSubmit={handleSubmitStep5}
            />
          )}

          {bodyContentButtons && (
            <XStack flexWrap="wrap" gap="$2" justifyContent="center">
              {bodyContentButtons}
            </XStack>
          )}

          {currentStep < totalSteps - 1 && (
            <XStack justifyContent="space-between" marginTop="auto">
              {currentStep > 0 ? (
                <CustomButton
                  onPress={handleBack}
                  backgroundColor="#6666FF"
                  size="$4"
                  textfontsize="$4"
                  textfontweight="600"
                  borderRadius="$9"
                >
                  Quay lại
                </CustomButton>
              ) : (
                <Text />
              )}

              <CustomButton
                onPress={handleNext}
                backgroundColor="#6666FF"
                size="$4"
                textfontsize="$4"
                textfontweight="600"
                borderRadius="$9"
              >
                Tiếp theo
              </CustomButton>
            </XStack>
          )}
        </YStack>
      )}
    </ScrollScreenLayout>
  );
};

export default MultiStepSurvey;
