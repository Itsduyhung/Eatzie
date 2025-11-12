import { get, putRaw } from "@/infrastructure/api/axiosClient";
import { ApiResponse } from "@/types/axios";
import { UserDietService } from "./UserDietService";
import { UserDiet } from "@/types/userDiet.types";
import { guessMimeTypeFromUri } from "@/app/untils/file";
import { storage } from "@/infrastructure/storage/tokenStorage";

export interface Profile {
  id: number;
  fullname: string;
  email: string;
  phone: string;
  address: string;
  avatar: string;
  createdAt?: string;
  userDiet?: UserDiet; // Thêm thông tin hồ sơ vị giác
}

type ProfileUpdateData = Partial<
  Omit<Profile, "id" | "createdAt" | "userDiet">
>;

export const fieldLabels: Record<keyof Omit<Profile, "userDiet">, string> = {
  id: "Id",
  fullname: "Fullname",
  email: "Email",
  phone: "Phone",
  address: "Address",
  avatar: "Avatar",
  createdAt: "Created At",
};

// Helper function to make PUT request with FormData using fetch (workaround for React Native PUT + FormData issue)
async function putFormDataWithFetch(
  url: string,
  formData: FormData
): Promise<ApiResponse<any>> {
  const baseURL = process.env.EXPO_PUBLIC_API_URL || "http://192.168.1.14:5237/api";
  const fullUrl = `${baseURL}${url}`;
  const token = await storage.getItem("token");

  const response = await fetch(fullUrl, {
    method: "PUT",
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
      // Don't set Content-Type - let browser/React Native set it with boundary
    },
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  return data;
}

export class ProfileService {
  static async getProfile(id: number): Promise<Profile | null> {
    try {
      const profile = await get<Profile>(`/Profile/${id}`);

      const userDiet = await UserDietService.getUserDiet(id);

      if (profile) {
        profile.userDiet = userDiet || undefined;
      }

      return profile;
    } catch (error) {
      console.error("❌ Error fetching profile:", error);
      return null;
    }
  }

  static async setProfileAvatar(
    id: number,
    imageUri: string
  ): Promise<ApiResponse<any>> {
    const formData = new FormData();

    const fileObj = {
      uri: imageUri,
      type: guessMimeTypeFromUri(imageUri),
      name: `avatar_${id}_${Date.now()}.jpg`,
    } as any;

    formData.append("Avatar", fileObj);

    console.log("📸 Uploading avatar file:", fileObj);

    try {
      const resp = await putFormDataWithFetch(`/Profile/${id}`, formData);
      console.log("✅ Upload response:", resp);
      return resp;
    } catch (error: any) {
      console.error("❌ setProfileAvatar error:", error);
      throw error;
    }
  }

  static async uploadToSeparateEndpointThenSetProfile(
    id: number,
    fileUri: string
  ): Promise<ApiResponse<any>> {
    const formData = new FormData();
    formData.append("file", {
      uri: fileUri,
      name: `avatar_${id}_${Date.now()}.jpg`,
      type: guessMimeTypeFromUri(fileUri),
    } as any);

    const uploadResp = await putRaw<{ url: string }>(
      `/Profile/${id}/upload`,
      formData
    );

    if (!uploadResp?.isSuccess || !uploadResp.data?.url) {
      return uploadResp as any;
    }

    const avatarUrl = uploadResp.data.url;
    return await putRaw<any>(`/Profile/${id}`, { avatar: avatarUrl });
  }

  static async setFullname(
    id: number,
    fullname: string
  ): Promise<ApiResponse<any>> {
    // Use FormData as backend expects [FromForm]
    const formData = new FormData();
    formData.append("Fullname", fullname);

    try {
      // Use fetch API directly instead of axios for PUT + FormData (React Native workaround)
      const resp = await putFormDataWithFetch(`/Profile/${id}`, formData);
      console.log("✅ Update fullname response:", resp);
      return resp;
    } catch (error: any) {
      console.error("❌ setFullname error:", error);
      throw error;
    }
  }

  static async setPhone(id: number, phone: string): Promise<ApiResponse<any>> {
    const formData = new FormData();
    formData.append("Phone", phone);

    try {
      const resp = await putFormDataWithFetch(`/Profile/${id}`, formData);
      console.log("✅ Update phone response:", resp);
      return resp;
    } catch (error: any) {
      console.error("❌ setPhone error:", error);
      throw error;
    }
  }

  static async updateProfile(
    id: number,
    data: ProfileUpdateData
  ): Promise<ApiResponse<any>> {
    const formData = new FormData();

    (Object.keys(data) as (keyof ProfileUpdateData)[]).forEach((key) => {
      const value = data[key];
      if (value !== undefined && value !== null) {
        formData.append(fieldLabels[key], String(value));
      }
    });
    
    try {
      const resp = await putFormDataWithFetch(`/Profile/${id}`, formData);
      console.log("✅ Update profile response:", resp);
      return resp;
    } catch (error: any) {
      console.error("❌ updateProfile error:", error);
      throw error;
    }
  }

  // Methods for UserDiet management
  static async updateUserDiet(
    userId: number,
    updateData: Partial<UserDiet>
  ): Promise<ApiResponse<any>> {
    try {
      const response = await UserDietService.updateUserDiet({
        userId,
        ...updateData,
      });
      console.log("✅ Update user diet response:", response);
      return response;
    } catch (error) {
      console.error("❌ Error updating user diet:", error);
      throw error;
    }
  }

  static async updateAllergicFood(
    userId: number,
    allergicFood: string
  ): Promise<ApiResponse<any>> {
    try {
      const response = await UserDietService.updateAllergicFood(
        userId,
        allergicFood
      );
      console.log("✅ Update allergic food response:", response);
      return response;
    } catch (error) {
      console.error("❌ Error updating allergic food:", error);
      throw error;
    }
  }

  static async updateFavoriteFood(
    userId: number,
    favoriteFood: string
  ): Promise<ApiResponse<any>> {
    try {
      const response = await UserDietService.updateFavoriteFood(
        userId,
        favoriteFood
      );
      console.log("✅ Update favorite food response:", response);
      return response;
    } catch (error) {
      console.error("❌ Error updating favorite food:", error);
      throw error;
    }
  }

  static async updateSpendingRange(
    userId: number,
    minSpending: number,
    maxSpending: number
  ): Promise<ApiResponse<any>> {
    try {
      const response = await UserDietService.updateSpendingRange(
        userId,
        minSpending,
        maxSpending
      );
      console.log("✅ Update spending range response:", response);
      return response;
    } catch (error) {
      console.error("❌ Error updating spending range:", error);
      throw error;
    }
  }
}
