import { FlashFoodList } from "@/components/flastList/FlashListCard";
import { FoodListSection } from "./foodListSection";

const HotFoodScreen = () => {
  return (
    <FoodListSection
      ids={[2, 4, 6]}
      title="Đặc sản"
      renderList={(foods) => (
        <FlashFoodList title="Đặc sản" data={foods} cardHeight={140} />
      )}
    />
  );
};

export default HotFoodScreen;
