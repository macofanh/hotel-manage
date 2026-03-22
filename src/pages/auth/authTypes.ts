// Khớp với schemas.py ở BE

export interface LoginRequest {
    username: string
    password: string
}

export interface RegisterRequest {
    username: string
    password: string
    full_name: string
    email: string
    phone_number?: string
    admin_secret?: string
}

// Khớp với Token schema ở BE
export interface TokenResponse {
    access_token: string
    token_type: string
}

// Khớp với UserResponse schema ở BE
export interface UserResponse {
    user_id: number
    username: string
    full_name: string
    email: string
    role: 'ADMIN' | 'CUSTOMER'
    created_at: string
}

// Thông tin lưu vào localStorage sau khi login
export interface StoredUser {
    user_id: number
    username: string
    full_name: string
    email: string
    role: 'ADMIN' | 'CUSTOMER'
}