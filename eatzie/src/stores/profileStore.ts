import { Profile } from "@/domain/service/ProfileService";
import { UserDiet } from "@/types/userDiet.types";
import { create } from "zustand";

interface ProfileState {
  profile: Profile | null;
  setProfile: (profile: Profile | null) => void;
  updateField: (field: keyof Profile, value: any) => void;
  updateUserDiet: (userDiet: UserDiet) => void;
  updateUserDietField: (field: keyof UserDiet, value: any) => void;
}

export const useProfileStore = create<ProfileState>((set) => ({
  profile: null,
  setProfile: (profile) => set({ profile }),
  updateField: (field, value) =>
    set((state) => ({
      profile: state.profile ? { ...state.profile, [field]: value } : null,
    })),
  updateUserDiet: (userDiet) =>
    set((state) => ({
      profile: state.profile ? { ...state.profile, userDiet } : null,
    })),
  updateUserDietField: (field, value) =>
    set((state) => ({
      profile: state.profile && state.profile.userDiet
        ? {
            ...state.profile,
            userDiet: { ...state.profile.userDiet, [field]: value }
          }
        : state.profile,
    })),
}));
