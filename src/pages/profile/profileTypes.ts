// Khớp với schema trả về từ GET /api/profile/
export interface UserProfile {
    user_id: number;
    username: string;
    full_name: string;
    email: string;
    phone_number: string | null;
    avatar_url: string | null;
    role: string;
    created_at: string;
}

// Khớp với schema nhận vào của PUT /api/profile/
export interface UpdateProfileRequest {
    full_name?: string;
    phone_number?: string;
    // Tùy thuộc vào BE của bạn có 2 trường này chưa, nếu chưa có thì tạm thời không gửi
    dob?: string; 
    address?: string; 
}