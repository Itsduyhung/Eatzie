import { styled, Tabs, YStack, Text } from "tamagui";

const StyledTab = styled(Tabs.Tab, {
  name: "CustomTab",
  unstyled: true,
  borderRadius: 8,
  paddingVertical: 8,
  paddingHorizontal: 16,
  backgroundColor: "transparent",

  hoverStyle: { backgroundColor: "rgba(0,128,255,0.1)" },

  variants: {
    active: {
      true: {
        hoverStyle: { backgroundColor: "rgba(0,128,255,0.25)" },
      },
      false: {
        hoverStyle: { backgroundColor: "rgba(0,128,255,0.1)" },
      },
    },
  },
  defaultVariants: {
    active: false,
  },
});

type CustomTabProps = {
  label: string;
  value: string;
  active?: boolean;
  style?: any;
};

export function CustomTab({
  label,
  value,
  active = false,
  style,
}: CustomTabProps) {
  return (
    <StyledTab value={value} active={active} style={style}>
      <YStack alignItems="center">
        <Text fontSize="$4" color={active ? "#6666FF" : "#444"}>
          {label}
        </Text>
        <YStack
          height={2}
          width="100%"
          backgroundColor={active ? "#6666FF" : "transparent"}
          marginTop={4}
          borderRadius={1}
        />
      </YStack>
    </StyledTab>
  );
}
