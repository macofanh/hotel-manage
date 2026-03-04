// src/common/services/auth.service.ts

export const authService = {
    // Hàm đăng nhập (Fake API)
    async login(credentials: any) {
        // 1. Giả lập độ trễ của mạng (1.5 giây)
        await new Promise((resolve) => setTimeout(resolve, 1500))

        // 2. Giả lập logic kiểm tra ở Backend
        // (Giả sử cứ nhập email có chữ 'admin' thì thành công)
        if (credentials.identifier.includes('admin')) {
            return {
                status: 200,
                message: 'Đăng nhập thành công',
                data: {
                    access_token: 'fake-jwt-token-xyz-123456789',
                    user: {
                        id: 1,
                        username: 'tuananh_admin',
                        fullName: 'Tuấn Anh', // Dữ liệu giả trả về để hiển thị lên Header
                        role: 'admin',
                        avatar: 'https://ui-avatars.com/api/?name=Tuan+Anh&background=FEA116&color=fff',
                    },
                },
            }
        } else {
            throw new Error('Tài khoản hoặc mật khẩu không chính xác!')
        }

        /* =========================================================
       TODO: KHI NÀO CÓ BE, HÃY XÓA ĐOẠN FAKE TRÊN VÀ BỎ COMMENT ĐOẠN DƯỚI
       =========================================================
       try {
         const response = await httpClient.post('/api/auth/login', credentials);
         return response.data;
       } catch (error) {
         throw error;
       }
    */
    },
}
