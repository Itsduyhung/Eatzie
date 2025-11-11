import { ApiResponse } from "@/types/axios";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { storage } from "../storage/tokenStorage";
import { router } from "expo-router";

// Callback to handle logout - will be set by auth store after initialization
let logoutCallback: (() => void | Promise<void>) | null = null;

export const setLogoutCallback = (callback: () => void | Promise<void>) => {
  logoutCallback = callback;
};

export const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || "http://192.168.1.4/api",

export const api = axios.create({
  baseURL: baseURL,
  timeout: 10000,
});

api.interceptors.request.use(
  async (config) => {
    let token = await storage.getItem("token");
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
      
      // If we get a 401, the token is invalid or expired
      // Clear token from storage and call logout callback if available
      console.error("Authentication failed - redirecting to login");
      await storage.removeItem("token");
      
      // Call logout callback if it's been registered
      if (logoutCallback) {
        await logoutCallback();
      } else {
        // Fallback: redirect to login if callback is not set
        router.push("/(auth)/login");
      }
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);

export async function get<T>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> {
  const { data }: any = await api.get<T>(url, config);
  return data;
}

export async function post<T>(
  url: string,
  body?: any,
  config?: AxiosRequestConfig
): Promise<T> {
  try {
    const response = await api.post(url, body, config);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function putRaw<T>(
  url: string,
  body?: any,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> {
  try {
    console.log("➡️ PUT request:", url, body, config); // log URL + payload
    const response: AxiosResponse<ApiResponse<T>> = await api.put(
      url,
      body,
      config
    );
    console.log("⬅️ PUT response:", response.data);
    return response.data;
  } catch (error: any) {
    console.error(" PUT error:", error.response?.data || error.message);
    throw error;
  }
}
