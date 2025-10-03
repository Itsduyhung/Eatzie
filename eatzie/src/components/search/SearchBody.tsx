import { useThemedTextColor } from "@/app/hooks/ThemedTextColor";
import { useSearchStore } from "@/stores/searchStore";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Text, XStack, YStack } from "tamagui";
import { LinearGradient } from "tamagui/linear-gradient";
import { ClearButton } from "../ui/ClearButton";
import { RowItem } from "../ui/RowItem";
import { Section } from "../ui/Section";
import { SizableImage } from "../ui/SizableImageProps";
import { TagButton } from "../ui/TagButton";

export function SearchBody({ onSelect }: { onSelect: (val: string) => void }) {
  const { history, trending, clearHistory } = useSearchStore();
  const { textColor } = useThemedTextColor();

  return (
    <YStack padding="$3" gap="$4">
      <Section
        color={textColor}
        title="历史搜索"
        rightAction={<ClearButton onClear={clearHistory} />}
      >
        <XStack flexWrap="wrap" gap="$2">
          {history.length === 0 ? (
            <Text color="$gray10">Chưa có lịch sử tìm kiếm</Text>
          ) : (
            history.map((item) => (
              <TagButton
                color={textColor}
                key={item}
                label={item}
                onPress={() => onSelect(item)}
              />
            ))
          )}
        </XStack>
      </Section>

      <Section color={textColor} title="搜索发现">
        <XStack flexWrap="wrap" gap="$2">
          {["雪花冰城", "杨梅桂花冰爽解渴", "汉口热干面", "打面"].map(
            (item) => (
              <TagButton
                color={textColor}
                key={item}
                label={item}
                onPress={() => onSelect(item)}
              />
            )
          )}
        </XStack>
      </Section>

      <XStack gap="$4">
        <YStack flex={1} borderRadius="$4" padding="$1">
          <LinearGradient
            colors={["rgba(213, 213, 247, 1)", "rgba(255,255,255,1)"]}
            start={[0, 0]}
            end={[0, 1]}
            borderRadius="$4"
            padding="$3"
          >
            <Section
              leftIcon={
                <SizableImage
                  source={require("@/assets/icons/hotfire.png")}
                  style={{ width: 20, height: 18 }}
                />
              }
              color={textColor}
              title="大家都在搜"
            >
              <YStack paddingLeft="$2">
                {trending.map((item, idx) => (
                  <RowItem
                    color={textColor}
                    key={item}
                    index={idx + 1}
                    label={item}
                    onPress={() => onSelect(item)}
                  />
                ))}
              </YStack>
            </Section>
          </LinearGradient>
        </YStack>

        <YStack flex={1} borderRadius="$4" padding="$1">
          <LinearGradient
            colors={["rgba(225, 225, 242, 1)", "rgba(255,255,255,1)"]}
            start={[0, 0]}
            end={[0, 1]}
            borderRadius="$4"
            padding="$3"
          >
            <Section
              leftIcon={
                <MaterialCommunityIcons
                  name="silverware-fork-knife"
                  size={18}
                  color="#FF803C"
                />
              }
              color={textColor}
              title="特色美食"
            >
              <YStack paddingLeft="$2">
                {["螺蛳粉", "烧烤", "麻辣烫", "大盘鸡", "羊蝎子"].map(
                  (item, idx) => (
                    <RowItem
                      color={textColor}
                      key={item}
                      index={idx + 1}
                      label={item}
                      onPress={() => onSelect(item)}
                    />
                  )
                )}
              </YStack>
            </Section>
          </LinearGradient>
        </YStack>
      </XStack>
    </YStack>
  );
}
