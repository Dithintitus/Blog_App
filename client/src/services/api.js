import axios from "axios"
import { toast } from "react-toastify"

const api = axios.create({
  baseURL: "/api",
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      window.location.href = "/login"
    }

    const message = error.response?.data?.message || "An error occurred"
    if (error.response?.status !== 401) {
      toast.error(message)
    }

    return Promise.reject(error)
  },
)

export default api
