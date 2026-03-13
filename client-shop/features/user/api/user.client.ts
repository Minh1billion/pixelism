import { api } from "@/shared/lib/axios";
import type { UserListResponse } from "@/features/user/types/user.types";
import type { ApiResponse, PageResponse } from "@/shared/types/shared.types";

export interface UpdateProfilePayload {
  username: string;
  fullName: string;
}

export class UserService {
  static async getAll(
    keyword?: string,
    page = 0,
    size = 12
  ): Promise<PageResponse<UserListResponse>> {
    try {
      const response = await api.get<ApiResponse<PageResponse<UserListResponse>>>(
        "/users",
        { params: { keyword, page, size } }
      );
      if (!response.data.success) throw new Error(response.data.message);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message ?? error.message);
    }
  }

  static async updateProfile(payload: UpdateProfilePayload): Promise<UserListResponse> {
    try {
      const response = await api.put<ApiResponse<UserListResponse>>("/users/me", payload);
      if (!response.data.success) throw new Error(response.data.message);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message ?? error.message);
    }
  }

  static async updateAvatar(file: File): Promise<UserListResponse> {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await api.patch<ApiResponse<UserListResponse>>(
        "/users/me/avatar",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      if (!response.data.success) throw new Error(response.data.message);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message ?? error.message);
    }
  }
}