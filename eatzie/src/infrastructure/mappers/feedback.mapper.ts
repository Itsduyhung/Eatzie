import { Feedback, FeedbackApi } from "@/types/feedback";

export const FeedbackMapper = {
  toDomain(apiData: FeedbackApi): Feedback {
    return {
      id: apiData.id,
      foodId: apiData.food_id,
      userId: apiData.userId,
      content: apiData.content,
      rating: apiData.rating,
      createdAt: new Date(apiData.createdAt),
      isResolved: apiData.isResolved,
      imageUrl: apiData.image,
    };
  },

  toDomainList(apiList: FeedbackApi[]): Feedback[] {
    return apiList.map(this.toDomain);
  },
};
