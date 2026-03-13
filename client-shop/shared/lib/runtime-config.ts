export interface AppConfig {
  apiUrl: string
  backendUrl: string
}

const DEFAULT_CONFIG: AppConfig = {
  apiUrl: '/api/v1',
  backendUrl: '',
}

let configPromise: Promise<void> | null = null

export async function loadRuntimeConfig(): Promise<void> {
  if (typeof window === 'undefined') return
  if ((window as any).__APP_CONFIG__) return

  if (!configPromise) {
    configPromise = fetch('/api/config')
      .then((res) => res.json())
      .then((config: AppConfig) => {
        ;(window as any).__APP_CONFIG__ = config
      })
      .catch(() => {
        ;(window as any).__APP_CONFIG__ = DEFAULT_CONFIG
      })
  }

  return configPromise
}

export function getRuntimeConfig(): AppConfig {
  if (typeof window === 'undefined') return DEFAULT_CONFIG
  return (window as any).__APP_CONFIG__ ?? DEFAULT_CONFIG
}