import axios from 'axios'
import { env } from '../lib/env'
import { authStore } from '../state/authStore'

export const apiClient = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: 30_000,
})

apiClient.interceptors.request.use((config) => {
  const { token } = authStore.getState()
  if (token) {
    config.headers = config.headers ?? {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

