import { User } from "@/domain/model/User";
import { AuthService } from "@/domain/service/AuthService";
import { storage } from "@/infrastructure/storage/tokenStorage";
import { getValidPayLoad } from "@/utils/jwt";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  login: (credentials: { email: string; password: string }) => Promise<void>;
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
          await storage.remove("token");
          await storage.remove("refreshToken");

          const data = await AuthService.login(credentials);
          const payload = getValidPayLoad(data.token);
          if (!payload) throw new Error("Invalid token payload");

          const user: User = {
            userId:
              payload[
                "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
              ],
            role: payload.role?.toLowerCase().replace("role_", ""),
            fullName:
              payload[
                "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"
              ],
            verified: payload.verified,
          };

          await storage.set("token", data.token);
          // await storage.set('refreshToken', data.refreshToken);
          set({
            user,
            token: data.token,
            // refreshToken: data.refreshToken,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error: any) {
          set({ isLoading: false, error: error.message || "Login failed" });
          throw error;
        }
      },

      logout: async () => {
        await storage.remove("token");
        // await storage.remove('refreshToken');
        set({
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
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
