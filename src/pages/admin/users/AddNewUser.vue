<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import httpClient from '@/api/axiosClient'

const router = useRouter()
const isSaving = ref(false)

// Dữ liệu bám sát schema UserCreateByAdmin của BE
const formData = reactive({
    username: '',
    password: '',
    full_name: '',
    email: '',
    phone_number: '',
    role: 'CUSTOMER' // Mặc định là Khách hàng
})

const goBack = () => {
    router.push({ name: 'admin-users' })
}

const handleCreateUser = async () => {
    isSaving.value = true
    try {
        await httpClient.post('/api/users/', formData)
        alert('Thêm người dùng thành công!')
        router.push({ name: 'admin-users' }) // Quay lại danh sách
    } catch (error: any) {
        console.error('Lỗi khi thêm user:', error)
        alert(error.response?.data?.detail || 'Có lỗi xảy ra khi thêm người dùng!')
    } finally {
        isSaving.value = false
    }
}
</script>

<template>
    <div class="flex flex-col h-full gap-6 max-w-4xl mx-auto w-full">
        <header class="flex items-center gap-4 whitespace-nowrap border-b border-gray-200 bg-white/80 backdrop-blur-md px-8 py-4 rounded-2xl shadow-sm">
            <button @click="goBack" class="p-2 rounded-lg text-gray-500 hover:text-primary hover:bg-orange-50 transition-colors">
                <span class="material-symbols-outlined text-xl">arrow_back</span>
            </button>
            <h2 class="text-xl font-extrabold leading-tight tracking-tight text-gray-900">
                Thêm người dùng mới
            </h2>
        </header>

        <main class="bg-white border border-gray-200 rounded-2xl shadow-sm p-8">
            <form @submit.prevent="handleCreateUser" class="space-y-6">
                <div>
                    <h3 class="text-base font-bold text-gray-900 border-b border-gray-100 pb-2 mb-4">Thông tin đăng nhập</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="space-y-1.5">
                            <label class="text-xs font-bold text-gray-700">Tên đăng nhập (Username) *</label>
                            <input v-model="formData.username" type="text" required class="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:bg-white focus:border-primary outline-none transition-all" placeholder="Nhập tên tài khoản" />
                        </div>
                        <div class="space-y-1.5">
                            <label class="text-xs font-bold text-gray-700">Mật khẩu *</label>
                            <input v-model="formData.password" type="password" required class="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:bg-white focus:border-primary outline-none transition-all" placeholder="Nhập mật khẩu" />
                        </div>
                    </div>
                </div>

                <div class="pt-2">
                    <h3 class="text-base font-bold text-gray-900 border-b border-gray-100 pb-2 mb-4">Thông tin cá nhân & Quyền hạn</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="space-y-1.5 md:col-span-2">
                            <label class="text-xs font-bold text-gray-700">Họ và Tên *</label>
                            <input v-model="formData.full_name" type="text" required class="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:bg-white focus:border-primary outline-none transition-all" placeholder="Nguyễn Văn A" />
                        </div>
                        <div class="space-y-1.5">
                            <label class="text-xs font-bold text-gray-700">Email *</label>
                            <input v-model="formData.email" type="email" required class="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:bg-white focus:border-primary outline-none transition-all" placeholder="email@example.com" />
                        </div>
                        <div class="space-y-1.5">
                            <label class="text-xs font-bold text-gray-700">Số điện thoại</label>
                            <input v-model="formData.phone_number" type="tel" class="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:bg-white focus:border-primary outline-none transition-all" placeholder="0123456789" />
                        </div>
                        <div class="space-y-1.5">
                            <label class="text-xs font-bold text-gray-700">Quyền hạn (Role) *</label>
                            <select v-model="formData.role" class="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:bg-white focus:border-primary outline-none transition-all cursor-pointer">
                                <option value="CUSTOMER">Khách hàng (CUSTOMER)</option>
                                <option value="ADMIN">Quản trị viên (ADMIN)</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div class="flex justify-end pt-6 border-t border-gray-100 gap-3">
                    <button type="button" @click="goBack" class="px-6 py-3 border border-gray-200 text-gray-700 text-sm font-bold rounded-xl hover:bg-gray-50 transition-all">
                        Hủy
                    </button>
                    <button type="submit" :disabled="isSaving" class="px-6 py-3 bg-primary text-white text-sm font-bold rounded-xl shadow-md hover:bg-orange-600 transition-all disabled:opacity-70 flex items-center gap-2">
                        <span v-if="!isSaving" class="material-symbols-outlined text-[20px]">save</span>
                        <svg v-else class="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {{ isSaving ? 'Đang lưu...' : 'Lưu người dùng' }}
                    </button>
                </div>
            </form>
        </main>
    </div>
</template>