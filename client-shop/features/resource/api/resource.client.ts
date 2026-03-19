import { api } from '@/shared/lib/axios'
import type { ApiResponse, PageResponse } from '@/shared/types/shared.types'
import type { ResourceFilterRequest, ResourceListResponse } from '@/features/resource/types/resource.types'
import { normalizePage } from '@/shared/utils/page.utils'

export class ResourceService {
  static async getResources(
    filter: ResourceFilterRequest,
    page = 0,
    size = 42
  ): Promise<PageResponse<ResourceListResponse>> {
    try {
      const response = await api.get<ApiResponse<PageResponse<ResourceListResponse>>>(
        '/resources',
        { params: { ...filter, page, size } }
      )
      if (!response.data.success) throw new Error(response.data.message)
      return normalizePage(response.data.data)
    } catch (error: any) {
      throw new Error(error.response?.data?.message ?? error.message)
    }
  }
}