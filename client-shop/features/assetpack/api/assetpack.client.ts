import { api } from "@/shared/lib/axios";
import type { AssetPackFilterRequest, AssetPackResponse } from "@/features/assetpack/types/assetpack.types";
import type { ApiResponse, PageResponse } from "@/shared/types/shared.types";
import { normalizePage } from "@/shared/utils/page.utils";

export class AssetPackService {
    static async getAll(
        filter: AssetPackFilterRequest,
        page = 0,
        size = 12
    ): Promise<PageResponse<AssetPackResponse>> {
        try {
            const response = await api.get<ApiResponse<PageResponse<AssetPackResponse>>>(
                "/asset-packs",
                { params: { ...filter, page, size } }
            );
            if (!response.data.success) throw new Error(response.data.message);
            return normalizePage(response.data.data);
        } catch (error: any) {
            throw new Error(error.response?.data?.message ?? error.message);
        }
    }

    static async getById(id: string): Promise<AssetPackResponse> {
        try {
            const response = await api.get<ApiResponse<AssetPackResponse>>(`/asset-packs/${id}`);
            if (!response.data.success) throw new Error(response.data.message);
            return response.data.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message ?? error.message);
        }
    }
}