import { useAuthStore } from "@/applicaton/stores/authStores";
import axios from "axios";
import { storage } from "../storage/tokenStorage";

export const api = axios.create({
baseURL: "http://192.168.1.11:5237/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 30000,
});

api.interceptors.request.use(
  async (config) => {
    let token = await storage.get("token");
    // if (token && !isTokenValid(token)) {
    //   const resfreshed = await useAuthStore.getState().refreshToken();
    //   if (!refreshed) return config;
    //   token = await storage.get("token");
    // }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/SignIn/signin")
    ) {
      originalRequest._retry = true;
      try {
        // const refreshed = await useAuthStore.getState().refreshToken();
        // if (!refreshed) throw new Error('Token refresh failed');

        const token = await storage.get("token");
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
      } catch (err) {
        await useAuthStore.getState().logout();
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);
