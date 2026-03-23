<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import httpClient from '@/api/axiosClient'

// Nhận ID từ URL do Router tự động nạp qua props
const props = defineProps<{
    id: string | number
}>()

const router = useRouter()
const isLoading = ref(true)
const isSaving = ref(false)

// Thông tin hiển thị (không chỉnh sửa được)
const readonlyData = reactive({
    username: '',
})

// Dữ liệu bám sát schema UserUpdateByAdmin
const formData = reactive({
    full_name: '',
    email: '',
    phone_number: '',
    role: 'CUSTOMER',
})

const goBack = () => {
    router.push({ name: 'admin-users' })
}

// Lấy thông tin User khi vừa vào trang
const fetchUserDetail = async () => {
    try {
        const response: any = await httpClient.get(`/api/users/${props.id}`)
        const user = response.data || response

        readonlyData.username = user.username

        formData.full_name = user.full_name
        formData.email = user.email
        formData.phone_number = user.phone_number || ''
        formData.role = user.role
    } catch (error) {
        console.error('Lỗi khi tải thông tin:', error)
        alert('Không tìm thấy người dùng này!')
        goBack()
    } finally {
        isLoading.value = false
    }
}

onMounted(() => {
    fetchUserDetail()
})

// Cập nhật User
const handleUpdateUser = async () => {
    isSaving.value = true
    try {
        await httpClient.put(`/api/users/${props.id}`, formData)
        alert('Cập nhật người dùng thành công!')
        router.push({ name: 'admin-users' })
    } catch (error: any) {
        console.error('Lỗi khi cập nhật:', error)
        alert(error.response?.data?.detail || 'Có lỗi xảy ra khi cập nhật!')
    } finally {
        isSaving.value = false
    }
}
</script>

<template>
    <div class="flex flex-col h-full gap-6 max-w-4xl mx-auto w-full">
        <header
            class="flex items-center gap-4 whitespace-nowrap border-b border-gray-200 bg-white/80 backdrop-blur-md px-8 py-4 rounded-2xl shadow-sm"
        >
            <button
                @click="goBack"
                class="p-2 rounded-lg text-gray-500 hover:text-primary hover:bg-orange-50 transition-colors"
            >
                <span class="material-symbols-outlined text-xl"
                    >arrow_back</span
                >
            </button>
            <h2
                class="text-xl font-extrabold leading-tight tracking-tight text-gray-900"
            >
                Chỉnh sửa người dùng
            </h2>
        </header>

        <main
            class="bg-white border border-gray-200 rounded-2xl shadow-sm p-8 relative"
        >
            <div
                v-if="isLoading"
                class="absolute inset-0 bg-white/60 backdrop-blur-sm z-10 flex items-center justify-center rounded-2xl"
            >
                <span
                    class="material-symbols-outlined animate-spin text-primary text-4xl"
                    >autorenew</span
                >
            </div>

            <form @submit.prevent="handleUpdateUser" class="space-y-6">
                <div>
                    <h3
                        class="text-base font-bold text-gray-900 border-b border-gray-100 pb-2 mb-4"
                    >
                        Thông tin hệ thống
                    </h3>
                    <div class="grid grid-cols-1 gap-6">
                        <div class="space-y-1.5">
                            <label class="text-xs font-bold text-gray-500"
                                >Tên đăng nhập (Không thể thay đổi)</label
                            >
                            <input
                                :value="readonlyData.username"
                                type="text"
                                disabled
                                class="block w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-sm text-gray-500 cursor-not-allowed"
                            />
                        </div>
                    </div>
                </div>

                <div class="pt-2">
                    <h3
                        class="text-base font-bold text-gray-900 border-b border-gray-100 pb-2 mb-4"
                    >
                        Thông tin cá nhân & Quyền hạn
                    </h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="space-y-1.5 md:col-span-2">
                            <label class="text-xs font-bold text-gray-700"
                                >Họ và Tên *</label
                            >
                            <input
                                v-model="formData.full_name"
                                type="text"
                                required
                                class="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:bg-white focus:border-primary outline-none transition-all"
                            />
                        </div>
                        <div class="space-y-1.5">
                            <label class="text-xs font-bold text-gray-700"
                                >Email *</label
                            >
                            <input
                                v-model="formData.email"
                                type="email"
                                required
                                class="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:bg-white focus:border-primary outline-none transition-all"
                            />
                        </div>
                        <div class="space-y-1.5">
                            <label class="text-xs font-bold text-gray-700"
                                >Số điện thoại</label
                            >
                            <input
                                v-model="formData.phone_number"
                                type="tel"
                                class="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:bg-white focus:border-primary outline-none transition-all"
                            />
                        </div>
                        <div class="space-y-1.5">
                            <label class="text-xs font-bold text-gray-700"
                                >Quyền hạn (Role) *</label
                            >
                            <select
                                v-model="formData.role"
                                class="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:bg-white focus:border-primary outline-none transition-all cursor-pointer"
                            >
                                <option value="CUSTOMER">
                                    Khách hàng (CUSTOMER)
                                </option>
                                <option value="ADMIN">
                                    Quản trị viên (ADMIN)
                                </option>
                            </select>
                        </div>
                    </div>
                </div>

                <div
                    class="flex justify-end pt-6 border-t border-gray-100 gap-3"
                >
                    <button
                        type="button"
                        @click="goBack"
                        class="px-6 py-3 border border-gray-200 text-gray-700 text-sm font-bold rounded-xl hover:bg-gray-50 transition-all"
                    >
                        Hủy
                    </button>
                    <button
                        type="submit"
                        :disabled="isSaving"
                        class="px-6 py-3 bg-primary text-white text-sm font-bold rounded-xl shadow-md hover:bg-orange-600 transition-all disabled:opacity-70 flex items-center gap-2"
                    >
                        <span
                            v-if="!isSaving"
                            class="material-symbols-outlined text-[20px]"
                            >save</span
                        >
                        <svg
                            v-else
                            class="animate-spin h-5 w-5 text-white"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                class="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                stroke-width="4"
                                fill="none"
                            ></circle>
                            <path
                                class="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                        </svg>
                        {{ isSaving ? 'Đang lưu...' : 'Lưu thay đổi' }}
                    </button>
                </div>
            </form>
        </main>
    </div>
</template>
