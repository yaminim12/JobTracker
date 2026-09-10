import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/',
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem('jobTrackerAccessToken')
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    const isAuthRequest = originalRequest?.url?.includes('auth/login/')
      || originalRequest?.url?.includes('auth/refresh/')

    if (error.response?.status !== 401 || !originalRequest || originalRequest._retry || isAuthRequest) {
      if (error.response?.status === 401 && !isAuthRequest) {
        window.dispatchEvent(new Event('job-tracker-auth-expired'))
      }
      return Promise.reject(error)
    }

    const refreshToken = localStorage.getItem('jobTrackerRefreshToken')
    if (!refreshToken) {
      window.dispatchEvent(new Event('job-tracker-auth-expired'))
      return Promise.reject(error)
    }

    originalRequest._retry = true
    try {
      const { data } = await axios.post(
        `${api.defaults.baseURL}auth/refresh/`,
        { refresh: refreshToken },
        { headers: { 'Content-Type': 'application/json' } },
      )
      localStorage.setItem('jobTrackerAccessToken', data.access)
      originalRequest.headers.Authorization = `Bearer ${data.access}`
      return api(originalRequest)
    } catch (refreshError) {
      window.dispatchEvent(new Event('job-tracker-auth-expired'))
      return Promise.reject(refreshError)
    }
  },
)

export const getApiError = (error) => {
  const data = error.response?.data
  if (!data) return 'Unable to reach the server. Please try again.'
  if (typeof data === 'string') return data
  if (data.detail) return data.detail
  const firstValue = Object.values(data)[0]
  return Array.isArray(firstValue) ? firstValue[0] : 'Something went wrong.'
}

export default api
