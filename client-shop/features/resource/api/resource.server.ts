import { serverFetch, buildQuery } from '@/shared/lib/server-client'
import { normalizePage } from '@/shared/utils/page.utils'
import type { PageResponse } from '@/shared/types/shared.types'
import type { ResourceFilterRequest, ResourceListResponse } from '@/features/resource/types/resource.types'

export async function serverGetResources(
  filter: ResourceFilterRequest = {},
  page = 0,
  size = 42
): Promise<PageResponse<ResourceListResponse>> {
  const query = buildQuery({ ...filter, page, size })
  const data = await serverFetch<PageResponse<ResourceListResponse>>(
    `/resources${query}`,
    { cache: 'no-store' }
  )
  return normalizePage(data)
}