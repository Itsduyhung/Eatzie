import { ScanLine } from "@tamagui/lucide-icons";
import { useState } from "react";

import { CustomInputText } from "./CustomTextInput";

export function SearchBar() {
  const [searchText, setSearchText] = useState("");
  const [focused, setFocused] = useState(false);

  return (
    <CustomInputText
      value={searchText}
      onChangeText={setSearchText}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      focused={focused}
      suffixIcon={<ScanLine size={20} color="#666" />}
      backgroundColor="white"
      borderColor="#eee"
      placeholder="Tìm món ăn..."
      height={44}
      paddingLeft={12}
      focusStyle="none"
    />
  );
}
