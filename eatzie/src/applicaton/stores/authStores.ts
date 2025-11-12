import { User } from "@/domain/model/User";
import { AuthService } from "@/domain/service/AuthService";
import { setLogoutCallback } from "@/infrastructure/api/axiosClient";
import { storage } from "@/infrastructure/storage/tokenStorage";
import { LoginResponse } from "@/types/login/login";
import { getUserFromPayload, getValidPayLoad } from "@/utils/jwt";
import { signalRService } from "@/utils/signalRConnection";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  login: (credentials: {
    email: string;
    password: string;
  }) => Promise<LoginResponse>;
  logout: () => void;
  // checkAuthStatus: () => Promise<boolean>;
  // initialize: () => Promise<void>;
  // refreshAccessToken(): () => Promise<void>;
  // updateUser: (userData: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: true,
      error: null,

      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          await storage.removeItem("token");
          await storage.removeItem("refreshToken");

          const data = await AuthService.login(credentials);
          const payload = getValidPayLoad(data.token);
          if (!payload) throw new Error("Invalid token payload");

          const user = getUserFromPayload(payload);

          await storage.setItem("token", data.token);
          // await storage.set('refreshToken', data.refreshToken);
          set({
            user,
            token: data.token,
            // refreshToken: data.refreshToken,
            isAuthenticated: true,
            isLoading: false,
          });
          return data;
        } catch (error: any) {
          set({ isLoading: false, error: error.message || "Login failed" });
          throw error;
        }
      },

      logout: async () => {
        // Disconnect SignalR when logging out
        await signalRService.stopConnection();
        
        await storage.removeItem("token");
        // await storage.remove('refreshToken');
        set({
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
        router.push("/(auth)/login");
        console.log("Logout successful");
      },
    }),
    {
      name: "auth-store",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Register logout callback with axios client to break circular dependency
// This allows axios interceptor to call logout without creating a circular import
setLogoutCallback(() => {
  useAuthStore.getState().logout();
});
