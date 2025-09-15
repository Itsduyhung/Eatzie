export interface FoodSuggestion {
  id: string;
  name: string;
  category?: string;
}

export const suggestionFoodData: FoodSuggestion[] = [
  { id: "1", name: "Phở gà" },
  { id: "2", name: "Phở bò" },
  { id: "3", name: "Bánh mì" },
  { id: "4", name: "Trà sữa" },
  { id: "5", name: "Pizza" },
  { id: "6", name: "Cà phê" },
  { id: "7", name: "Bún chả" },
  { id: "8", name: "Gỏi cuốn" },
];
