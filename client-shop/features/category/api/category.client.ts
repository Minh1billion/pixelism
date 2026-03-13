import { api } from "@/shared/lib/axios";
import type { CategoryResponse, CategoryRequest } from "@/features/category/types/category.types";
import type { ApiResponse } from "@/shared/types/shared.types";

export class CategoryService {
    static async getAll(): Promise<CategoryResponse[]> {
        try {
            const response = await api.get<ApiResponse<CategoryResponse[]>>("/categories");
            if (!response.data.success) throw new Error(response.data.message);
            return response.data.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message ?? error.message);
        }
    }

    static async create(data: CategoryRequest): Promise<CategoryResponse> {
        try {
            const response = await api.post<ApiResponse<CategoryResponse>>("/categories", data);
            if (!response.data.success) throw new Error(response.data.message);
            return response.data.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message ?? error.message);
        }
    }

    static async update(id: string, data: CategoryRequest) {
        try {
            const response = await api.put<ApiResponse<CategoryResponse>>("/categories/" + id, data);
            if (!response.data.success) throw new Error(response.data.message);
            return response.data.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message ?? error.message);
        }
    }

    static async delete(id: string) {
        try {
            const response = await api.delete<ApiResponse<null>>("/categories/" + id);
            if (!response.data.success) throw new Error(response.data.message);
        } catch (error: any) {
            throw new Error(error.response?.data?.message ?? error.message);
        }
    }
}