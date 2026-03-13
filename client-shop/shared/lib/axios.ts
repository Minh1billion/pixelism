import axios from 'axios'
import qs from 'qs'
import { loadRuntimeConfig, getRuntimeConfig } from './runtime-config'

export const api = axios.create({
  withCredentials: true,
  paramsSerializer: (params) =>
    qs.stringify(params, { arrayFormat: 'repeat', skipNulls: true }),
})

api.interceptors.request.use(async (config) => {
  await loadRuntimeConfig()
  const { apiUrl } = getRuntimeConfig()
  config.baseURL = apiUrl
  return config
})

let isRefreshing = false
let failedQueue: Array<{
  resolve: (value: unknown) => void
  reject: (reason?: unknown) => void
}> = []

const processQueue = (error: unknown) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(undefined)
    }
  })
  failedQueue = []
}

const AUTH_ENDPOINTS = [
  '/auth/login',
  '/auth/register',
  '/auth/refresh',
  '/auth/reset-password',
]

const PUBLIC_PATHS = ['/']

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    const isAuthEndpoint = AUTH_ENDPOINTS.some((path) =>
      originalRequest.url?.includes(path)
    )

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isAuthEndpoint
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then(() => api(originalRequest))
          .catch((err) => Promise.reject(err))
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        await api.post('/auth/refresh')
        processQueue(null)
        return api(originalRequest)
      } catch (err) {
        processQueue(err)
        if (typeof window !== 'undefined') {
          localStorage.removeItem('user')
          const isPublicPage = PUBLIC_PATHS.includes(window.location.pathname)
          if (!isPublicPage) {
            window.dispatchEvent(new Event('auth:logout'))
          }
        }
        return Promise.reject(err)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)