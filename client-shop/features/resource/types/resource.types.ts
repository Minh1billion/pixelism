export type ResourceType = 'SPRITE' | 'AUDIO' | 'ASEPRITE' | 'FILE'

export interface ResourceListResponse {
  id: string
  name: string
  slug: string
  type: ResourceType
  isPublic: boolean
  createdAt: string
  deletedAt?: string | null

  // SPRITE
  imageUrl?: string | null

  // AUDIO
  durationSeconds?: number | null
  format?: string | null
}

export interface ResourceFilterRequest {
  type?: ResourceType
  categoryIds?: string[]
  keyword?: string
  sortOrder?: 'asc' | 'desc'
}