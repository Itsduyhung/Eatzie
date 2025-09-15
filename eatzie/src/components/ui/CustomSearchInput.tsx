import { ScanLine } from "@tamagui/lucide-icons";
import { Pressable, View } from "react-native";

import { useRouter } from "expo-router";
import { CustomInputText } from "./CustomTextInput";
import { VerticalPlaceholder } from "./VerticalPlaceholder";

export function SearchBar() {
  // const [searchText, setSearchText] = useState("");
  // const [focused, setFocused] = useState(false);
  const router = useRouter();
  const hotsearches = [
    "Pizza ngon nhất gần bạn",
    "Bún bò Huế đặc biệt",
    "Gà rán KFC",
    "Cà phê sữa đá",
  ];

  const inputHeight = 40;
  const paddingHorizontal = 12;

  return (
    <Pressable
      onPress={() =>
        router.push({
          pathname: "/(features)/search/searchcategories",
        })
      }
      style={{ width: "100%", height: inputHeight }}
    >
      <View style={{ position: "relative", flex: 1 }}>
        <CustomInputText
          value=""
          onChangeText={() => {}}
          suffixIcon={<ScanLine size={20} color="#666" />}
          backgroundColor="white"
          borderColor="#eee"
          height={inputHeight}
          paddingLeft={paddingHorizontal}
          focusStyle="none"
          editable={false}
          pointerEvents="none"
        />

        {/* Placeholder hiển thị khi input trống */}
        <View
          style={{
            position: "absolute",
            left: paddingHorizontal,
            right: paddingHorizontal,
            top: 0,
            bottom: 0,
            justifyContent: "center",
            pointerEvents: "none",
            paddingLeft: 12,
          }}
        >
          <VerticalPlaceholder
            items={hotsearches}
            itemHeight={inputHeight}
            displayDuration={3000}
            transitionDuration={500}
          />
        </View>
      </View>
    </Pressable>
  );
}
