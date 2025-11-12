import { Profile, ProfileService } from "@/domain/service/ProfileService";
import { UserDiet } from "@/types/userDiet.types";
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

interface ProfileState {
  profile: Profile | null;
  profileById: Record<number, Profile | null>;
  loading: Record<number, boolean>;
  error: Record<number, string | null>;

  setProfile: (profile: Profile | null) => void;
  updateField: <K extends keyof Profile>(field: K, value: Profile[K]) => void;
  updateUserDiet: (userDiet: UserDiet) => void;
  updateUserDietField: <K extends keyof UserDiet>(
    field: K,
    value: UserDiet[K]
  ) => void;

  fetchProfile: (userId: number) => Promise<void>;
}

export const useProfileStore = create<ProfileState>()(
  subscribeWithSelector((set, get) => ({
    profile: null,
    profileById: {},
    loading: {},
    error: {},

    setProfile: (profile) => set({ profile }),

    updateField: (field, value) =>
      set((state) =>
        state.profile
          ? { profile: { ...state.profile, [field]: value } }
          : state
      ),

    updateUserDiet: (userDiet) =>
      set((state) =>
        state.profile ? { profile: { ...state.profile, userDiet } } : state
      ),

    updateUserDietField: (field, value) =>
      set((state) =>
        state.profile?.userDiet
          ? {
              profile: {
                ...state.profile,
                userDiet: { ...state.profile.userDiet, [field]: value },
              },
            }
          : state
      ),

    fetchProfile: async (userId: number) => {
      const { profileById, loading } = get();

      if (profileById[userId] || loading[userId]) return;

      set((state) => ({
        loading: { ...state.loading, [userId]: true },
        error: { ...state.error, [userId]: null },
      }));

      try {
        const user = await ProfileService.getProfile(userId);

        set((state) => ({
          profileById: { ...state.profileById, [userId]: user },

          profile:
            !state.profile || state.profile.id === userId
              ? user
              : state.profile,
        }));
      } catch (err: any) {
        console.error("❌ Fetch profile error:", err);
        set((state) => ({
          error: {
            ...state.error,
            [userId]: err?.message || "Không thể tải dữ liệu",
          },
        }));
      } finally {
        set((state) => ({
          loading: { ...state.loading, [userId]: false },
        }));
      }
    },
  }))
);
