// src/pages/auth/authService.ts
import httpClient from '@/api/axiosClient'
import { API_ENDPOINTS } from '@/api/endPoints'
import type {
    LoginRequest,
    RegisterRequest,
    TokenResponse,
    UserResponse,
} from './authTypes'

export const authService = {
    async login(payload: LoginRequest): Promise<TokenResponse> {
        // Gọi API và hứng toàn bộ gói hàng vào biến response
        const response = await httpClient.post(
            API_ENDPOINTS.AUTH.LOGIN,
            payload,
        )
        // Trả về đúng cái lõi data chứa Token
        return response.data
    },

    async register(payload: RegisterRequest): Promise<UserResponse> {
        const response = await httpClient.post(
            API_ENDPOINTS.AUTH.REGISTER,
            payload,
        )
        // Trả về đúng lõi data chứa thông tin User vừa đăng ký
        return response.data
    },

    // Lấy thông tin user hiện tại
    async getMe(): Promise<UserResponse> {
        const response = await httpClient.get(API_ENDPOINTS.PROFILE.GET)
        // Trả về đúng lõi data (chứa full_name, role...) để LocalStorage lưu cho chuẩn
        return response.data
    },
}
