// src/api/usePermission.ts
// Composable kiểm tra quyền truy cập dựa trên role của user hiện tại.
// Dùng trong component hoặc router guard để ẩn/hiện UI và bảo vệ route.

import { computed } from 'vue'
import { useAuth } from '@/pages/auth/useAuth'

export function usePermission() {
    const { currentUser } = useAuth()

    const isAdmin    = computed(() => currentUser.value?.role === 'ADMIN')
    const isCustomer = computed(() => currentUser.value?.role === 'CUSTOMER')
    const isLoggedIn = computed(() => !!currentUser.value)

    /** Trả về true nếu user có ít nhất một trong các role được chỉ định */
    const hasRole = (...roles: Array<'ADMIN' | 'CUSTOMER'>): boolean => {
        if (!currentUser.value) return false
        return roles.includes(currentUser.value.role)
    }

    return { isAdmin, isCustomer, isLoggedIn, hasRole }
}