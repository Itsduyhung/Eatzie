import { FlashFoodList } from "@/components/flastList/FlashListCard";
import { FoodListSection } from "./foodListSection";

const RecommentdedFoodScreen = () => {
  return (
    <FoodListSection
      ids={[12, 14, 16, 18, 20]}
      title="Món ăn đề xuất"
      renderList={(foods) => (
        <FlashFoodList
          title="Món ăn đề xuất cho bạn hôm nay"
          data={foods}
          cardWidth={250}
          hasDetailFoodCard
          paddingRight={50}
          highlightBorder
        />
      )}
    />
  );
};

export default RecommentdedFoodScreen;
