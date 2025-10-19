export interface Feedback {
  id: number;
  foodId: number;
  userId: number;
  content: string;
  rating: number;
  createdAt: Date;
  isResolved: boolean;
  imageUrl?: string;
}

export interface FeedbackApi {
  id: number;
  food_id: number;
  userId: number;
  content: string;
  rating: number;
  createdAt: string;
  isResolved: boolean;
  image?: string;
}
