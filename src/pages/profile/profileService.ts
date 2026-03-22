import httpClient from '@/api/axiosClient'
import { API_ENDPOINTS } from '@/api/endPoints'
import type { UserProfile, UpdateProfileRequest } from './profileTypes'

export const profileService = {
    // Lấy thông tin
    async getProfile(): Promise<UserProfile> {
        const response = await httpClient.get(API_ENDPOINTS.PROFILE.GET)
        return response.data // 👈 Cần thêm .data để bóc lấy JSON
    },

    // Cập nhật thông tin
    async updateProfile(payload: UpdateProfileRequest): Promise<UserProfile> {
        const response = await httpClient.put(
            API_ENDPOINTS.PROFILE.UPDATE,
            payload,
        )
        return response.data // 👈 Thêm .data
    },

    // Upload ảnh đại diện
    async uploadAvatar(file: File): Promise<any> {
        const formData = new FormData()
        formData.append('file', file)

        const response = await httpClient.post(
            API_ENDPOINTS.UPLOAD.SINGLE,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            },
        )
        return response.data // 👈 Thêm .data
    },
}
