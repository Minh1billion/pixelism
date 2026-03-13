import type { ApiResponse } from '@/shared/types/shared.types'

export const BACKEND_URL =
  process.env.BACKEND_INTERNAL_URL ??
  process.env.API_URL ??
  'http://localhost:8080/api/v1'

export function buildQuery(
  params: Record<string, string | number | boolean | string[] | undefined>
): string {
  const parts: string[] = []
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) continue
    if (Array.isArray(value)) {
      value.forEach((v) => parts.push(`${key}=${encodeURIComponent(v)}`))
    } else {
      parts.push(`${key}=${encodeURIComponent(String(value))}`)
    }
  }
  return parts.length ? `?${parts.join('&')}` : ''
}

export async function serverFetch<T>(
  url: string,
  init?: RequestInit
): Promise<T> {
  const res = await fetch(`${BACKEND_URL}${url}`, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  })

  if (!res.ok) throw new Error(`Server fetch failed: ${res.status} ${url}`)

  const json: ApiResponse<T> = await res.json()
  if (!json.success) throw new Error(json.message)
  return json.data
}