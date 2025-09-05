import { Image, TextInput, View } from "react-native";
import { YStack } from "tamagui";

const HEADER_HEIGHT = 159;

const HeaderHome = () => {
  return (
    <YStack
      width="100%"
      height={HEADER_HEIGHT}
      position="relative"
      alignItems="center"
      justifyContent="flex-start"
    >
      <Image
        source={require("@/assets/images/headereatzie.png")}
        style={{
          width: "100%",
          height: HEADER_HEIGHT,
          resizeMode: "cover",
          alignSelf: "center",
        }}
      />
      <View
        style={{
          position: "absolute",
          top: HEADER_HEIGHT * 0.65,
          left: "7.5%",
          width: "85%",
          zIndex: 2,
        }}
      >
        <TextInput
          placeholder="Tìm món ăn..."
          style={{
            backgroundColor: "#fff",
            borderRadius: 16,
            paddingVertical: 12,
            paddingHorizontal: 18,
            fontSize: 18,
            shadowColor: "#000",
            shadowOpacity: 0.05,
            shadowRadius: 8,
            elevation: 2,
            width: "100%",
          }}
        />
      </View>
    </YStack>
  );
};

export default HeaderHome;
