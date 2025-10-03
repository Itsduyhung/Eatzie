import { FoodCard } from "@/components/hotFood/cartContent";
import { FoodItemD } from "@/types/foodCategory";
import React from "react";
import { FlatList } from "react-native";
import { Text, XStack, YStack } from "tamagui";

type FlashFoodListProps = {
  title?: string;
  data: FoodItemD[];
  cardHeight?: number;
  cardWidth?: number;
  hasRatingOrView?: boolean;
  hasDetailFoodCard?: boolean;
  gap?: number;
  paddingRight?: number;
  highlightBorder?: boolean;
};

export const FlashFoodList = ({
  title,
  data,
  cardHeight,
  cardWidth,
  hasRatingOrView,
  hasDetailFoodCard,
  gap = 16,
  paddingRight,
  highlightBorder = false,
}: FlashFoodListProps) => {
  const renderItem = ({ item }: { item: FoodItemD }) => {
    const containerProps = cardHeight
      ? { maxHeight: cardHeight }
      : cardWidth
      ? { maxWidth: cardWidth }
      : {};

    return (
      <YStack marginRight={paddingRight ?? gap}>
        <FoodCard
          item={item}
          containerProps={containerProps}
          hasRatingOrView={hasRatingOrView}
          hasDetailFoodCard={hasDetailFoodCard}
          highlightBorder={highlightBorder}
        />
      </YStack>
    );
  };

  return (
    <YStack
      width="100%"
      backgroundColor="#FFFFFF"
      borderRadius={14}
      gap={gap}
      paddingLeft={gap}
      paddingVertical={12}
    >
      {title && (
        <XStack>
          <Text
            fontSize="$5"
            fontFamily="$heading"
            color="#9B59B6"
            numberOfLines={1}
          >
            {title}
          </Text>
        </XStack>
      )}

      <FlatList
        data={data}
        horizontal
        keyExtractor={(item) => `${item.id}`}
        showsHorizontalScrollIndicator={false}
        renderItem={renderItem}
      />
    </YStack>
  );
};
