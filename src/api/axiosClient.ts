// src/api/axiosClient.ts
import axios from 'axios'
import router from '@/router'

const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000',
    headers: { 'Content-Type': 'application/json' },
})

// Interceptor GỬI ĐI: Tự động gắn Bearer token vào mỗi request
axiosClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

// Interceptor NHẬN VỀ: Bắt lỗi 401 tập trung
axiosClient.interceptors.response.use(
    (response) => response, // ✅ Giữ nguyên để TypeScript suy ra đúng kiểu response.data
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('access_token')
            localStorage.removeItem('user_info')
            router.push({ name: 'login' })
        }
        return Promise.reject(error)
    },
)

export default axiosClient
