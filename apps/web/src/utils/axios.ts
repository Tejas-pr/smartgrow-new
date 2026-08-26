import axios from "axios"
import { removeItem } from "@/utils/localstorage"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api/v1"

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
})

axiosInstance.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

interface FailedRequest {
  resolve: (value?: unknown) => void
  reject: (reason?: unknown) => void
}

let isRefreshing = false
let failedQueue: FailedRequest[] = []

const processQueue = (error: unknown) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve()
    }
  })

  failedQueue = []
}

axiosInstance.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject })
        })
          .then(() => {
            return axiosInstance(originalRequest)
          })
          .catch((err) => {
            return Promise.reject(err)
          })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const response = await axios.post(
          `${API_BASE_URL}/accounts/token/refresh/`,
          {},
          { withCredentials: true }
        )

        // Update localStorage with fresh data if present
        if (response.data?.permissions) {
          localStorage.setItem(
            "user_permissions",
            JSON.stringify(response.data.permissions)
          )
        }
        if (response.data?.user) {
          localStorage.setItem("user_data", JSON.stringify(response.data.user))
          // Backward compatibility for existing keys
          if (response.data.user.license_type) {
            localStorage.setItem(
              "user_license_type",
              response.data.user.license_type
            )
          }
          localStorage.setItem(
            "user_is_onboarded",
            String(response.data.user.is_onboarded)
          )
        }

        processQueue(null)
        return axiosInstance(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError)
        removeItem("authenticated")
        window.location.href = "/login"
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

export default axiosInstance
