import { get, putRaw } from "@/infrastructure/api/axiosClient";
import { ApiResponse } from "@/types/axios";

export interface Profile {
  id: number;
  fullname: string;
  email: string;
  phone: string;
  address: string;
  avatar: string;
  createdAt?: string;
}

type ProfileUpdateData = Partial<Omit<Profile, "id" | "createdAt">>;

export const fieldLabels: Record<keyof Profile, string> = {
  id: "Id",
  fullname: "Fullname",
  email: "Email",
  phone: "Phone",
  address: "Address",
  avatar: "Avatar",
  createdAt: "Created At",
};

function guessMimeTypeFromUri(uri: string) {
  const ext = uri.split(".").pop()?.split("?")[0]?.toLowerCase();
  if (!ext) return "image/jpeg";
  if (ext === "png") return "image/png";
  if (ext === "jpg" || ext === "jpeg") return "image/jpeg";
  if (ext === "webp") return "image/webp";
  return "application/octet-stream";
}

export class ProfileService {
  static async getProfile(id: number): Promise<Profile | null> {
    try {
      const profile = await get<Profile>(`/Profile/${id}`);
      return profile;
    } catch (error) {
      console.error(" Error fetching profile:", error);
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

    const resp = await putRaw<any>(`/Profile/${id}`, formData);
    console.log("✅ Upload response:", resp);

    return resp;
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
    const formData = new FormData();
    formData.append("Fullname", fullname);

    const resp = await putRaw<any>(`/Profile/${id}`, formData);
    console.log("✅ Update fullname response:", resp);
    return resp;
  }

  static async setPhone(id: number, phone: string): Promise<ApiResponse<any>> {
    const formData = new FormData();
    formData.append("Phone", phone);

    const resp = await putRaw<any>(`/Profile/${id}`, formData);
    console.log("✅ Update fullname response:", resp);
    return resp;
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
    const resp = await putRaw<any>(`/Profile/${id}`, formData);
    console.log(" Update profile response:", resp);
    return resp;
  }

  // static async setProfile(
  //   id: number,
  //   updateData: Partial<Profile>
  // ): Promise<ApiResponse<null>> {
  //   const formData = new FormData();

  //   (Object.keys(updateData) as (keyof Profile)[]).forEach((key) => {
  //     const value = updateData[key];
  //     const fieldName = fieldLabels[key];

  //     if (fieldName && value !== undefined && value !== null) {
  //       formData.append(fieldName, String(value));
  //     }
  //   });

  //   return await putRaw<null>(`/Profile/${id}`, formData);
  // }
}
