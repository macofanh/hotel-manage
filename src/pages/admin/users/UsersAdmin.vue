<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import httpClient from '@/api/axiosClient' // Import bộ gọi API của bạn
import { useAuth } from '@/pages/auth/useAuth'

const router = useRouter()
const { currentUser, logout } = useAuth()

// Định nghĩa kiểu dữ liệu User dựa theo Schema Backend
interface User {
    user_id: number
    username: string
    full_name: string
    email: string
    phone_number: string | null
    role: string
    avatar_url: string | null
    created_at: string
}

const users = ref<User[]>([])
const isLoading = ref(false)
const searchQuery = ref('')

// 1. Lấy danh sách Users từ Backend
const fetchUsers = async () => {
    isLoading.value = true
    try {
        const response: any = await httpClient.get('/api/users/')
        users.value = response.data || response
    } catch (error) {
        console.error('Lỗi khi tải danh sách người dùng:', error)
        alert('Không thể tải danh sách người dùng!')
    } finally {
        isLoading.value = false
    }
}

onMounted(() => {
    fetchUsers()
})

// 2. Logic Tìm kiếm (Lọc ở Frontend)
const filteredUsers = computed(() => {
    if (!searchQuery.value) return users.value
    const query = searchQuery.value.toLowerCase()
    return users.value.filter(
        (u) =>
            u.full_name.toLowerCase().includes(query) ||
            u.email.toLowerCase().includes(query) ||
            u.username.toLowerCase().includes(query),
    )
})

// 3. Logic Xóa User
const handleDelete = async (userId: number, userName: string) => {
    if (
        !confirm(
            `Bạn có chắc chắn muốn xóa người dùng "${userName}" không? Hành động này không thể hoàn tác!`,
        )
    ) {
        return
    }

    try {
        await httpClient.delete(`/api/users/${userId}`)
        alert('Xóa người dùng thành công!')
        fetchUsers() // Load lại bảng sau khi xóa
    } catch (error: any) {
        console.error('Lỗi khi xóa:', error)
        alert(error?.response?.data?.detail || 'Lỗi khi xóa người dùng!')
    }
}

// 4. Chuyển hướng sang trang Thêm & Sửa
const goToAddUser = () => {
    router.push({ name: 'admin-users-create' })
}

const goToEditUser = (id: number) => {
    router.push({ name: 'admin-users-edit', params: { id } })
}

const getFullUrl = (path: string): string => {
    if (!path) return ''
    if (path.startsWith('http')) return path
    const BASE_URL =
        import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
    return `${BASE_URL}${path}`
}
</script>

<template>
    <div class="flex flex-col h-full gap-6">
        <header
            class="flex items-center justify-between whitespace-nowrap border-b border-gray-200 bg-white/80 backdrop-blur-md px-8 py-4 rounded-2xl shadow-sm"
        >
            <div class="flex items-center gap-8">
                <div class="flex items-center gap-4 text-gray-900">
                    <div class="size-6 text-primary">
                        <span class="material-symbols-outlined text-[28px]"
                            >manage_accounts</span
                        >
                    </div>
                </div>
                <div class="relative w-80">
                    <span
                        class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl"
                        >search</span
                    >
                    <input
                        v-model="searchQuery"
                        class="w-full h-10 bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                        placeholder="Tìm kiếm theo tên, email, username..."
                    />
                </div>
            </div>

            <div class="flex items-center gap-3">
                <button
                    @click="fetchUsers"
                    class="flex items-center justify-center rounded-lg h-10 w-10 bg-gray-50 border border-gray-200 text-gray-600 hover:text-primary hover:bg-orange-50 transition-colors"
                    title="Làm mới"
                >
                    <span
                        class="material-symbols-outlined"
                        :class="{ 'animate-spin': isLoading }"
                        >refresh</span
                    >
                </button>
                <button
                    @click="goToAddUser"
                    class="ml-2 flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold shadow-md shadow-primary/20 hover:bg-orange-600 transition-all active:scale-95"
                >
                    <span class="material-symbols-outlined text-[20px]"
                        >add</span
                    >
                    Thêm người dùng
                </button>
            </div>
        </header>

        <div
            class="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden flex-1 flex flex-col"
        >
            <div
                class="p-5 border-b border-gray-200 flex justify-between items-center bg-gray-50/50"
            >
                <h3 class="text-base font-bold text-gray-800">
                    Tất cả người dùng ({{ filteredUsers.length }})
                </h3>
                <div class="flex gap-2">
                    <button
                        class="flex items-center gap-2 px-3 py-1.5 border border-gray-200 bg-white rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors text-gray-600"
                    >
                        <span class="material-symbols-outlined text-lg"
                            >filter_list</span
                        >
                        Bộ lọc
                    </button>
                    <button
                        class="flex items-center gap-2 px-3 py-1.5 border border-gray-200 bg-white rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors text-gray-600"
                    >
                        <span class="material-symbols-outlined text-lg"
                            >download</span
                        >
                        Xuất File
                    </button>
                </div>
            </div>

            <div class="overflow-x-auto flex-1">
                <table class="w-full text-left border-collapse">
                    <thead>
                        <tr
                            class="bg-gray-50 text-gray-500 text-xs uppercase font-extrabold tracking-wider border-b border-gray-200"
                        >
                            <th class="px-6 py-4">Họ và Tên</th>
                            <th class="px-6 py-4">Tài khoản & Email</th>
                            <th class="px-6 py-4">Số điện thoại</th>
                            <th class="px-6 py-4">Vai trò (Role)</th>
                            <th class="px-6 py-4 text-center">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-100">
                        <tr v-if="isLoading">
                            <td
                                colspan="6"
                                class="px-6 py-10 text-center text-gray-500 font-medium"
                            >
                                Đang tải dữ liệu...
                            </td>
                        </tr>

                        <tr v-else-if="filteredUsers.length === 0">
                            <td
                                colspan="6"
                                class="px-6 py-10 text-center text-gray-500 font-medium"
                            >
                                Không tìm thấy người dùng nào.
                            </td>
                        </tr>

                        <tr
                            v-else
                            v-for="user in filteredUsers"
                            :key="user.user_id"
                            class="hover:bg-gray-50/80 transition-colors group"
                        >
                            <td class="px-6 py-4">
                                <div class="flex items-center gap-3">
                                    <div
                                        class="flex items-center justify-center cursor-pointer rounded-full size-10 bg-orange-100 border-2 border-transparent shadow-sm overflow-hidden group"
                                    >
                                        <img
                                            v-if="user.avatar_url"
                                            :src="getFullUrl(user.avatar_url)"
                                            alt="Avatar"
                                            class="w-full h-full object-cover"
                                        />

                                        <span
                                            v-else-if="user.full_name"
                                            class="text-primary font-bold text-lg uppercase"
                                        >
                                            {{ user.full_name.charAt(0) }}
                                        </span>

                                        <span
                                            v-else
                                            class="material-icons-outlined text-primary text-[24px]"
                                        >
                                            person
                                        </span>
                                    </div>
                                    <p class="text-sm font-bold text-gray-900">
                                        {{ user.full_name }}
                                    </p>
                                </div>
                            </td>

                            <td class="px-6 py-4">
                                <p class="text-sm font-bold text-gray-700">
                                    {{ user.username }}
                                </p>
                                <p class="text-xs text-gray-500 mt-0.5">
                                    {{ user.email }}
                                </p>
                            </td>

                            <td
                                class="px-6 py-4 text-sm text-gray-600 font-medium"
                            >
                                {{ user.phone_number || 'Chưa cập nhật' }}
                            </td>

                            <td class="px-6 py-4">
                                <span
                                    v-if="user.role === 'ADMIN'"
                                    class="px-2.5 py-1 rounded-md bg-blue-50 text-blue-600 border border-blue-100 text-[11px] font-extrabold tracking-wide"
                                    >ADMIN</span
                                >
                                <span
                                    v-else
                                    class="px-2.5 py-1 rounded-md bg-gray-100 text-gray-600 border border-gray-200 text-[11px] font-extrabold tracking-wide"
                                    >CUSTOMER</span
                                >
                            </td>

                            <td class="px-6 py-4">
                                <div
                                    class="flex items-center justify-center gap-1"
                                >
                                    <button
                                        @click="goToEditUser(user.user_id)"
                                        class="p-1.5 rounded-md text-gray-400 hover:text-primary hover:bg-orange-50 transition-all"
                                        title="Chỉnh sửa"
                                    >
                                        <span
                                            class="material-symbols-outlined text-[20px]"
                                            >edit</span
                                        >
                                    </button>
                                    <button
                                        @click="
                                            handleDelete(
                                                user.user_id,
                                                user.full_name,
                                            )
                                        "
                                        class="p-1.5 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
                                        title="Xóa người dùng"
                                    >
                                        <span
                                            class="material-symbols-outlined text-[20px]"
                                            >delete</span
                                        >
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div
                class="p-5 border-t border-gray-200 flex items-center justify-between bg-white"
            >
                <p class="text-sm text-gray-500 font-medium">
                    Hiển thị
                    <span class="font-bold text-gray-900">{{
                        filteredUsers.length
                    }}</span>
                    người dùng
                </p>
                <div class="flex gap-1.5">
                    <button
                        class="px-3 py-1.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                        Trước
                    </button>
                    <button
                        class="px-3 py-1.5 border border-primary rounded-lg bg-primary text-white text-sm font-bold shadow-sm"
                    >
                        1
                    </button>
                    <button
                        class="px-3 py-1.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50"
                    >
                        Tiếp
                    </button>
                </div>
            </div>
        </div>

        <footer class="text-center pb-2">
            <p
                class="text-xs text-gray-400 font-semibold tracking-wider uppercase"
            >
                © 2026 MacHotel Luxury Admin Panel
            </p>
        </footer>
    </div>
</template>

<style scoped>
/* Tuỳ chỉnh thanh cuộn cho bảng nếu dữ liệu quá dài */
.overflow-x-auto::-webkit-scrollbar {
    height: 6px;
    width: 6px;
}
.overflow-x-auto::-webkit-scrollbar-track {
    background: transparent;
}
.overflow-x-auto::-webkit-scrollbar-thumb {
    background-color: #e5e7eb;
    border-radius: 10px;
}
</style>
