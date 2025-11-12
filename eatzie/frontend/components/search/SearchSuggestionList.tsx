import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface SearchSuggestionListProps {
  suggestions: string[];
  onSelect: (val: string) => void;
}

export function SearchSuggestionList({
  suggestions,
  onSelect,
}: SearchSuggestionListProps) {
  if (!suggestions.length) {
    return <Text style={{ padding: 8, color: "#888" }}>Không có kết quả</Text>;
  }

  return (
    <View>
      {suggestions.map((item, index) => (
        <TouchableOpacity key={item + index} onPress={() => onSelect(item)}>
          <View style={styles.item}>
            <Text>{item}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  item: { padding: 12, borderBottomWidth: 1, borderColor: "#eee" },
});
