import { SizableImageProps } from "./SizableImageProps";

export type FoodCategory = {
  id: string;
  nameFood: string;
  title: string;
  image: SizableImageProps;
  content: string;
  rating: number;
  views: number;
  path: string;
  location?: string;
};
