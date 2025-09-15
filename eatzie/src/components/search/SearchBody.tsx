import { useSearchStore } from "@/stores/searchStore";
import { Text, XStack, YStack } from "tamagui";
import { ClearButton } from "../ui/ClearButton";
import { RowItem } from "../ui/RowItem";
import { Section } from "../ui/Section";
import { TagButton } from "../ui/TagButton";

export function SearchBody({ onSelect }: { onSelect: (val: string) => void }) {
  const { history, trending, clearHistory } = useSearchStore();

  return (
    <YStack padding="$3" gap="$4">
      <Section
        title="Hung12"
        rightAction={<ClearButton onClear={clearHistory} />}
      >
        <XStack flexWrap="wrap" gap="$2">
          {history.length === 0 ? (
            <Text color="$gray10">Chưa có lịch sử tìm kiếm</Text>
          ) : (
            history.map((item) => (
              <TagButton
                key={item}
                label={item}
                onPress={() => onSelect(item)}
              />
            ))
          )}
        </XStack>
      </Section>

      <Section title="Hung123">
        <XStack flexWrap="wrap" gap="$2">
          {["dqd", "ádas", "dáda", "áda"].map((item) => (
            <TagButton key={item} label={item} onPress={() => onSelect(item)} />
          ))}
        </XStack>
      </Section>

      <Section title="Hung12345">
        <YStack>
          {trending.map((item, idx) => (
            <RowItem
              key={item}
              index={idx + 1}
              label={item}
              onPress={() => onSelect(item)}
            />
          ))}
        </YStack>
      </Section>

      <Section title="Hung123456">
        <YStack>
          {["Ihone", "烧烤", "麻辣烫", "大盘鸡", "羊蝎子"].map((item, idx) => (
            <RowItem
              key={item}
              index={idx + 1}
              label={item}
              onPress={() => onSelect(item)}
            />
          ))}
        </YStack>
      </Section>
    </YStack>
  );
}
