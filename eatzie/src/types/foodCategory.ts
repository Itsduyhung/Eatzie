import { SizableImageProps } from "./SizableImageProps";

export type FoodCategory = {
  id: string;
  nameFood: string;
  title?: string;
  image: SizableImageProps;
  imageClick?: SizableImageProps;
  type?: string;
  rating: number;
  views: number;
  comment?: string;
  path: string;
  location?: string;
  items: FoodItem[];
};

export type FoodItem = {
  id: string;
  name: string;
  price: number;
  salePrice?: number;
  likes: number;
  description?: string;
  image?: SizableImageProps;
  feedbacks?: Feedback[];
  path: string;
  quantity?: number;
  categoryId?: string;
  decription?: string;
  isFavourite?: boolean;
  note?: string;
};

export type Feedback = {
  userId?: string;
  userName?: string;
  comment: string;
  rating: number;
  link?: string;
};
