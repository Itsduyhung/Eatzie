import { SearchScreen } from "@/components/home/headerSearch";
import { ScrollScreenLayout } from "@/components/layout/ScrollScreenLayout";
import { SearchBody } from "@/components/search/SearchBody";
import { BackButton } from "@/components/ui/BackButton";
import { useSearchStore } from "@/stores/searchStore";
import { useEffect } from "react";

export default function SearchCategories() {
  const { setTrending, addHistory, setText } = useSearchStore();

  useEffect(() => {
    setTrending(["CoCo", "iPhone 17 ", "卡", " SU7", "1e1e1"]);
  }, [setTrending]);

  const handleSelect = (val: string) => {
    addHistory(val);
    setText(val);

    console.log("Tìm:", val);
  };

  return (
    <ScrollScreenLayout
      headerLeftIcons={[<BackButton key="back" />]}
      headerBackgroundColor="#F4F3F8"
      header={<SearchScreen />}
    >
      <SearchBody onSelect={handleSelect} />
    </ScrollScreenLayout>
  );
}
