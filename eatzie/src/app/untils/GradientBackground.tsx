import React from "react";
import { StatusBar, View, ViewProps } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "tamagui/linear-gradient";

type Props = {
  children?: React.ReactNode;
} & ViewProps;

export const HeaderGradientBackground = ({
  children,
  style,
  ...rest
}: Props) => {
  const insets = useSafeAreaInsets();

  return (
    <LinearGradient
      colors={["rgba(102, 102, 255, 1)", "rgba(245, 245, 245, 1)"]}
      locations={[0.01, 0.99]}
      start={[1, 0]}
      end={[0, 1]}
      style={[{ width: "100%" }, style]}
      paddingBottom="50"
      {...rest}
    >
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />

      <View style={{ paddingTop: insets.top }}>{children}</View>
    </LinearGradient>
  );
};
