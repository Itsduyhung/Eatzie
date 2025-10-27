import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import Toast from "react-native-root-toast";

import { Feedback } from "@/types/feedback";
import {
  FeedbackForm,
  FeedbackService,
} from "@/domain/service/FeedBackService";

const buildKey = (orderId: number, foodId: number) => `${orderId}-${foodId}`;
type FeedbackForms = Record<string, FeedbackForm & { images?: string[] }>;

type FeedbackState = {
  feedback: Record<string, Feedback[]>;
  feedbackFood: Record<number, Feedback[]>;
  loading: Record<string, boolean>;
  error: Record<string, string | null>;
  loadingFood: Record<number, boolean>;
  errorFood: Record<number, string | null>;
  initialFeedback: FeedbackForms;
  submitting: Record<string, boolean>;

  fetchFeedback: (foodId: number) => Promise<void>;
  setInitialFeedback: (
    orderId: number,
    foodId: number,
    partial: Partial<FeedbackForm>
  ) => void;
  resetInitialFeedback: (orderId: number, foodId: number) => void;
  submitFeedback: (orderId: number, foodId: number) => Promise<void>;
};

export const useFeedbackStore = create<FeedbackState>()(
  subscribeWithSelector((set, get) => {
    const ensureFeedback = (orderId: number, foodId: number) => {
      const key = buildKey(orderId, foodId);
      let feedback = get().initialFeedback[key];
      if (!feedback) {
        const defaultForm = {
          orderId,
          foodId,
          content: "",
          rating: 0,
          image: null,
          images: [],
        };
        set((state) => ({
          initialFeedback: { ...state.initialFeedback, [key]: defaultForm },
        }));
        feedback = defaultForm;
      }
      return feedback;
    };

    return {
      feedback: {},
      feedbackFood: {},
      loading: {},
      error: {},
      loadingFood: {},
      errorFood: {},
      initialFeedback: {},
      submitting: {},

      setInitialFeedback: (orderId, foodId, partial) => {
        const key = buildKey(orderId, foodId);
        const existing = ensureFeedback(orderId, foodId);
        set((state) => ({
          initialFeedback: {
            ...state.initialFeedback,
            [key]: { ...existing, ...partial },
          },
        }));
      },

      resetInitialFeedback: (orderId, foodId) => {
        const key = buildKey(orderId, foodId);
        set((state) => ({
          initialFeedback: {
            ...state.initialFeedback,
            [key]: {
              orderId,
              foodId,
              content: "",
              rating: 0,
              image: null,
              images: [],
            },
          },
        }));
      },

      fetchFeedback: async (foodId: number) => {
        set((state) => ({
          loadingFood: { ...state.loadingFood, [foodId]: true },
        }));

        try {
          const list = await FeedbackService.getFeedbackByFoodId(foodId);
          set((state) => ({
            feedbackFood: { ...state.feedbackFood, [foodId]: list },
            errorFood: { ...state.errorFood, [foodId]: null },
          }));
        } catch (err) {
          console.error("Fetch feedback error:", err);
          set((state) => ({
            errorFood: {
              ...state.errorFood,
              [foodId]: "Không thể tải feedback",
            },
          }));
        } finally {
          set((state) => ({
            loadingFood: { ...state.loadingFood, [foodId]: false },
          }));
        }
      },

      submitFeedback: async (orderId, foodId) => {
        const key = buildKey(orderId, foodId);
        const form = get().initialFeedback[key];

        if (!form || !form.content.trim() || form.rating <= 0) {
          Toast.show("Vui lòng nhập nội dung và đánh giá trước khi gửi", {
            duration: Toast.durations.SHORT,
          });
          return;
        }

        set((state) => ({
          submitting: { ...state.submitting, [key]: true },
        }));

        try {
          await FeedbackService.addFeedback(foodId, {
            content: form.content,
            rating: form.rating,
            img: form.image ?? undefined,
          });

          Toast.show("Gửi feedback thành công!", {
            duration: Toast.durations.SHORT,
          });

          get().resetInitialFeedback(orderId, foodId);
          await get().fetchFeedback(foodId);
        } catch (err) {
          console.error("Submit feedback error:", err);
          Toast.show("Gửi feedback thất bại!", {
            duration: Toast.durations.SHORT,
          });
        } finally {
          set((state) => ({
            submitting: { ...state.submitting, [key]: false },
          }));
        }
      },
    };
  })
);
