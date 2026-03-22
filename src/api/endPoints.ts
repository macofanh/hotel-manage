// src/api/endPoints.ts

const BASE_PREFIX = '/api'

export const API_ENDPOINTS = {
    // ==========================================
    // 1. AUTHENTICATION (Xác thực)
    // ==========================================
    AUTH: {
        REGISTER: `${BASE_PREFIX}/auth/register`,
        LOGIN: `${BASE_PREFIX}/auth/login`,
    },

    // ==========================================
    // 2. ROOMS (Quản lý Phòng & Loại phòng)
    // ==========================================
    ROOM: {
        LIST: `${BASE_PREFIX}/rooms`,
        CREATE: `${BASE_PREFIX}/rooms`,
        DETAIL: (id: number | string) => `${BASE_PREFIX}/rooms/${id}`,
        UPDATE: (id: number | string) => `${BASE_PREFIX}/rooms/${id}`,
        DELETE: (id: number | string) => `${BASE_PREFIX}/rooms/${id}`,

        // Room Types
        TYPES_LIST: `${BASE_PREFIX}/rooms/types`,
        TYPES_CREATE: `${BASE_PREFIX}/rooms/types`,
    },

    // ==========================================
    // 3. UPLOAD (Tải ảnh lên)
    // ==========================================
    UPLOAD: {
        MULTIPLE: `${BASE_PREFIX}/upload/multiple`,
        SINGLE: `${BASE_PREFIX}/upload/single`,
    },

    // ==========================================
    // 4. PROFILE (Hồ sơ người dùng)
    // ==========================================
    PROFILE: {
        GET: `${BASE_PREFIX}/profile/`,
        UPDATE: `${BASE_PREFIX}/profile/`,
    },

    // ==========================================
    // 5. BOOKINGS (Đặt phòng)
    // ==========================================
    BOOKING: {
        CREATE: `${BASE_PREFIX}/bookings/`,
        MY_BOOKINGS: `${BASE_PREFIX}/bookings/my-bookings`,
        CONFIRM_DEPOSIT: (id: number | string) =>
            `${BASE_PREFIX}/bookings/${id}/confirm-deposit`,

        // Thêm vào cho đủ bộ BE, dù FE thường không gọi API này (Dành cho Ngân hàng gọi)
        WEBHOOK: `${BASE_PREFIX}/bookings/webhook/bank-transfer`,
    },

    // ==========================================
    // 6. SERVICES (Dịch vụ)
    // ==========================================
    SERVICE: {
        LIST: `${BASE_PREFIX}/services/`,
        CREATE: `${BASE_PREFIX}/services/`,
        ORDER: `${BASE_PREFIX}/services/orders`,
        BILL_BY_BOOKING: (bookingId: number | string) =>
            `${BASE_PREFIX}/services/orders/${bookingId}`,
    },
} as const
