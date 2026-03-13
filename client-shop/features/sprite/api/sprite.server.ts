import { serverFetch, buildQuery } from '@/shared/lib/server-client'
import { normalizePage } from '@/shared/utils/page.utils'
import type { PageResponse } from '@/shared/types/shared.types'
import type {
  SpriteFilterRequest,
  SpriteListResponse,
  SpriteResponse,
} from '@/features/sprite/types/sprite.types'

export async function serverGetSprites(
  filter: SpriteFilterRequest = {},
  page = 0,
  size = 42
): Promise<PageResponse<SpriteListResponse>> {
  const query = buildQuery({ ...filter, page, size })
  const data = await serverFetch<PageResponse<SpriteListResponse>>(
    `/sprites${query}`,
    { cache: 'no-store' }
  )
  return normalizePage(data)
}

export async function serverGetSprite(
  id: string
): Promise<SpriteResponse | null> {
  try {
    return await serverFetch<SpriteResponse>(`/sprites/${id}`, {
      cache: 'no-store',
    })
  } catch {
    return null
  }
}