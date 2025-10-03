import { useAuthStore } from "@/applicaton/stores/authStores";

import { ApiResponse } from "@/types/axios";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { storage } from "../storage/tokenStorage";

export const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || "http://192.168.0.190:7121/api",

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
      try {
        const token = await storage.getItem("token");
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
