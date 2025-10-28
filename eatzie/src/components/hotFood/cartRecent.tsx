import { FoodCard } from "@/components/hotFood/cartContent";
import { YStack, Text } from "tamagui";
import { Dimensions } from "react-native";
import { FoodListSection } from "@/app/(features)/food/foodListSection";

type RecentFoodScreenProps = {
  title?: string;
};
const RecentFoodScreen = ({ title = "" }: RecentFoodScreenProps) => {
  const screenWidth = Dimensions.get("window").width;
  const containerPadding = 16;
  const gap = 16;
  const numColumns = 2;
  const itemMargin = 8;

  const itemWidth =
    (screenWidth -
      containerPadding * 2 -
      gap * (numColumns - 1) -
      itemMargin * numColumns) /
    numColumns;

  return (
    <FoodListSection
      title={title}
      ids={[10, 4, 6, 7, 8]}
      renderList={(foods) => (
        <YStack
          flexDirection="column"
          padding={containerPadding}
          gap={gap}
          borderRadius={14}
          backgroundColor="#FFFFFF"
        >
          <Text fontSize="$5" fontWeight="700" marginBottom={8} color="#9B59B6">
            {title}
          </Text>

          <YStack
            flexDirection="row"
            flexWrap="wrap"
            justifyContent="center"
            gap={gap}
          >
            {foods.map((item) => (
              <YStack key={item.id} width={itemWidth} marginBottom={gap}>
                <FoodCard
                  item={item}
                  containerProps={{ maxWidth: itemWidth }}
                  hasRatingOrView
                />
              </YStack>
            ))}
          </YStack>
        </YStack>
      )}
    />
  );
};

export default RecentFoodScreen;
