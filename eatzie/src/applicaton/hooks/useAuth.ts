import { useAuthStore } from "../stores/authStores";

export function useAuth() {
  return useAuthStore();
}
