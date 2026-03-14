import i18n from '@/i18n'
import { useSettingsStore } from '@/store/settings'
import { useUserStore } from '@/store/user'
import axios from 'axios'

const api = axios.create({
  timeout: 5000
})

api.interceptors.request.use((config) => {
  config.baseURL = '/api'
  const jwt = useUserStore.getState().jwt
  if (jwt) config.headers.Authorization = `Bearer ${jwt}`
  config.headers['X-Timestamp'] = Date.now().toString()
  config.headers['X-Nonce'] = crypto.randomUUID()
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (axios.isAxiosError(err)) {
      const serverCode = err.response?.data?.code
      const serverMessage = err.response?.data?.message

      if (serverCode === 40102) {
        if (useUserStore.getState().jwt) {
          useUserStore.getState().reset()
        }
      }
      useSettingsStore
        .getState()
        .staticMessage?.error(serverMessage ?? i18n.t('networkError', { ns: 'api' }))
    } else {
      useSettingsStore.getState().staticMessage?.error(i18n.t('unknownError', { ns: 'api' }))
    }

    return Promise.reject(err)
  }
)

export default api
