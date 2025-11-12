export interface UserDiet {
  userDietId: number;
  userId: number;
  allergic_food?: string;
  favorite_food?: string;
  min_spending?: number;
  max_spending?: number;
  diet_type: number;
}

export interface UserDietUpdateRequest {
  userId: number;
  allergicFood?: string;
  favoriteFood?: string;
  minSpending?: number;
  maxSpending?: number;
  dietType?: number;
}

export enum DietType {
  VEGETARIAN = 0,
  VEGAN = 1,
  OMNIVORE = 2,
  PESCATARIAN = 3,
  KETO = 4,
  PALEO = 5,
  MEDITERRANEAN = 6,
  LOW_CARB = 7,
  GLUTEN_FREE = 8,
  DAIRY_FREE = 9
}

export const DietTypeLabels: Record<number, string> = {
  0: "Ăn chay",
  1: "Ăn mặn",
  2: "Ăn cả chay lẫn mặn"
};
