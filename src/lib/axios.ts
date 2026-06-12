import axios, { type AxiosError } from 'axios'
import { env } from '@/env'
import storage from '@/config/storage'
import { queryClient } from '@/lib/react-query'
import { constants } from '@/utils'

export const api = axios.create({
  baseURL: env.VITE_API_URL,
  withCredentials: true,
})

// Attach Bearer token to every request
api.interceptors.request.use((config) => {
  const token = storage.local.get(constants.localStorageKeys.ACCESS_TOKEN)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// On 401, clear token and redirect to sign-in
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      storage.local.delete(constants.localStorageKeys.ACCESS_TOKEN)
      queryClient.clear()
      window.location.href = '/sign-in'
    }
    return Promise.reject(error)
  }
)

if (env.VITE_ENABLE_API_DELAY) {
  api.interceptors.request.use(async (config) => {
    await new Promise((resolve) => setTimeout(resolve, 2000))
    return config
  })
}
