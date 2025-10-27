import { guessMimeTypeFromUri } from "@/app/untils/file";
import { get, post } from "@/infrastructure/api/axiosClient";
import { FeedbackMapper } from "@/infrastructure/mappers/feedback.mapper";
import { ApiResponse } from "@/types/axios";
import { Feedback, FeedbackApi } from "@/types/feedback";

export interface FeedbackItemInput {
  content?: string;
  rating: number;
  img?: string;
}

const keyMap = {
  content: "Content",
  rating: "Rating",
  img: "Image",
};

export type FeedbackForm = {
  foodId: number;
  content: string;
  rating: number;
  image: string | null;
};

export class FeedbackService {
  static async addFeedback(
    foodId: number,
    payload: FeedbackItemInput
  ): Promise<ApiResponse<null>> {
    const formData = new FormData();

    for (const [key, value] of Object.entries(payload)) {
      const apiKey = keyMap[key as keyof typeof keyMap];
      if (!apiKey || value == null) continue;

      if (key === "img" && typeof value === "string") {
        formData.append(apiKey, {
          uri: value,
          name: `feedback_${Date.now()}.jpg`,
          type: guessMimeTypeFromUri(value),
        } as any);
      } else {
        formData.append(
          apiKey,
          typeof value === "number" ? String(value) : value
        );
      }
    }

    return post<ApiResponse<null>>(`/Food/${foodId}/feedback`, formData);
  }

  static async getFeedbackByFoodId(id: number): Promise<Feedback[]> {
    const apiResponse = await get<FeedbackApi[]>(`/Food/${id}/feedbacks`);

    if (!apiResponse || !Array.isArray(apiResponse)) {
      return [];
    }

    return FeedbackMapper.toDomainList(apiResponse);
  }
}
