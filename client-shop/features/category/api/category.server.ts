import { serverFetch } from '@/shared/lib/server-client'
import type { CategoryResponse } from '@/features/category/types/category.types'

export async function serverGetCategories(): Promise<CategoryResponse[]> {
  const data = await serverFetch<CategoryResponse[]>('/categories', {
    next: { revalidate: 300 },
  })
  return data ?? []
}