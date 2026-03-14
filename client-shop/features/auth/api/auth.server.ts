import { serverFetch } from '@/shared/lib/server-client'
import type { AuthResponse } from '@/features/auth/types/auth.types'

export async function serverGetCurrentUser(): Promise<AuthResponse['user'] | null> {
  try {
    return await serverFetch<AuthResponse['user']>('/auth/me', {
      cache: 'no-store',
    })
  } catch {
    return null
  }
}