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
        // Gửi thẳng cục payload (JSON) như bình thường!
        return httpClient.post<any, TokenResponse>(
            API_ENDPOINTS.AUTH.LOGIN,
            payload
        )
    },

    async register(payload: RegisterRequest): Promise<UserResponse> {
        return httpClient.post<any, UserResponse>(
            API_ENDPOINTS.AUTH.REGISTER,
            payload,
        )
    },

    async getMe(): Promise<UserResponse> {
        return httpClient.get<any, UserResponse>(API_ENDPOINTS.PROFILE.GET)
    },
}