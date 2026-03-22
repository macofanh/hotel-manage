<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { profileService } from './profileService'
import { useAuth } from '../auth/useAuth'
import { usePermission } from '@/api/usePermission'

const router = useRouter()
// Lôi authUser từ LocalStorage ra để mồi dữ liệu cho mượt
const { logout, currentUser: authUser } = useAuth()
const { isAdmin } = usePermission()

// Dữ liệu User
const currentUser = reactive({
    fullName: '',
    email: '',
    phone: '',
    dob: '',
    address: '',
    avatar: '',
    joinDate: '',
})

const isSaving = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)

// 1. Gọi API lấy dữ liệu Profile
const fetchProfile = async () => {
    // Đổ dữ liệu từ LocalStorage ra trước để user không phải đợi
    if (authUser.value) {
        currentUser.fullName = authUser.value.full_name || ''
        currentUser.email = authUser.value.email || ''
    }

    try {
        const data: any = await profileService.getProfile()

        currentUser.fullName = data.full_name || currentUser.fullName
        currentUser.email = data.email || currentUser.email
        currentUser.phone = data.phone_number || ''
        currentUser.avatar = data.avatar_url || ''

        if (data.created_at) {
            const date = new Date(data.created_at)
            currentUser.joinDate = `Tháng ${date.getMonth() + 1}, ${date.getFullYear()}`
        }
    } catch (error) {
        console.error('Lỗi tải profile:', error)
    }
}

onMounted(() => {
    fetchProfile()
})

// 2. Lưu thông tin (Gọi API PUT)
const handleSaveProfile = async () => {
    isSaving.value = true
    try {
        await profileService.updateProfile({
            full_name: currentUser.fullName,
            phone_number: currentUser.phone,
        })
        alert('Cập nhật thông tin thành công!')
    } catch (error) {
        console.error(error)
        alert('Có lỗi xảy ra!')
    } finally {
        isSaving.value = false
    }
}

// 3. Xử lý Upload Avatar
const triggerFileInput = () => fileInput.value?.click()

const handleFileChange = async (event: Event) => {
    const target = event.target as HTMLInputElement
    const file = target.files?.[0]
    if (!file) return

    try {
        currentUser.avatar = URL.createObjectURL(file)
        const response = await profileService.uploadAvatar(file)

        if (response && response.file_url) {
            await profileService.updateProfile({
                avatar_url: response.file_url,
            } as any)
            alert('Cập nhật ảnh đại diện thành công!')
        }
    } catch (error) {
        console.error('Lỗi upload ảnh:', error)
        alert('Tải ảnh lên thất bại.')
    }
}
</script>

<template>
    <div class="bg-[#f9fafb] min-h-screen py-10">
        <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex items-center gap-2 mb-8">
                <router-link
                    :to="{ name: 'home' }"
                    class="text-gray-500 text-sm font-medium hover:text-primary transition-colors"
                    >Trang chủ</router-link
                >
                <span class="material-icons-outlined text-gray-400 text-sm"
                    >chevron_right</span
                >
                <span class="text-gray-900 text-sm font-bold"
                    >Hồ sơ cá nhân</span
                >
            </div>

            <div class="flex flex-col lg:flex-row gap-8">
                <div class="w-full lg:w-1/4 flex flex-col gap-6">
                    <div
                        class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col items-center text-center"
                    >
                        <div
                            @click="triggerFileInput"
                            class="relative w-24 h-24 rounded-full overflow-hidden mb-4 border-4 border-gray-50 shadow-inner group cursor-pointer"
                        >
                            <img
                                v-if="currentUser.avatar"
                                :src="currentUser.avatar"
                                alt="Avatar"
                                class="w-full h-full object-cover group-hover:opacity-75 transition-opacity"
                            />
                            <div
                                v-else
                                class="w-full h-full bg-orange-100 flex items-center justify-center text-primary text-3xl font-bold uppercase"
                            >
                                {{
                                    currentUser.fullName
                                        ? currentUser.fullName.charAt(0)
                                        : 'U'
                                }}
                            </div>
                            <div
                                class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <span class="material-icons-outlined text-white"
                                    >photo_camera</span
                                >
                            </div>
                            <input
                                type="file"
                                ref="fileInput"
                                class="hidden"
                                accept="image/*"
                                @change="handleFileChange"
                            />
                        </div>
                        <h3 class="text-lg font-bold text-gray-900">
                            {{ currentUser.fullName }}
                        </h3>
                        <p class="text-sm text-gray-500 mb-4">
                            Thành viên từ {{ currentUser.joinDate }}
                        </p>
                    </div>

                    <div
                        class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
                    >
                        <div class="flex flex-col">
                            <router-link
                                :to="{ name: 'profile' }"
                                class="flex items-center gap-3 px-6 py-4 bg-orange-50 border-l-4 border-primary text-primary font-bold"
                            >
                                <span class="material-icons-outlined"
                                    >person</span
                                >
                                Thông tin tài khoản
                            </router-link>

                            <router-link
                                :to="{ name: 'my-bookings' }"
                                class="flex items-center justify-between px-6 py-4 text-gray-600 hover:bg-gray-50 hover:text-primary font-medium transition-colors border-l-4 border-transparent"
                            >
                                <div class="flex items-center gap-3">
                                    <span class="material-icons-outlined"
                                        >history</span
                                    >
                                    Đơn đặt phòng
                                </div>
                            </router-link>

                            <a
                                v-if="isAdmin"
                                
                                class="flex items-center gap-3 px-6 py-4 text-orange-600 bg-orange-50/50 hover:bg-orange-100 font-bold transition-colors border-l-4 border-transparent"
                            >
                                <span class="material-icons-outlined"
                                    >admin_panel_settings</span
                                >
                                Quản trị hệ thống
                            </a>

                            <a
                                href="#"
                                class="flex items-center gap-3 px-6 py-4 text-gray-600 hover:bg-gray-50 hover:text-primary font-medium transition-colors border-l-4 border-transparent"
                            >
                                <span class="material-icons-outlined"
                                    >security</span
                                >
                                Mật khẩu & Bảo mật
                            </a>
                        </div>
                    </div>
                </div>

                <div class="w-full lg:w-3/4">
                    <div
                        class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8"
                    >
                        <div class="mb-8">
                            <h2
                                class="text-2xl font-extrabold text-gray-900 tracking-tight"
                            >
                                Chi tiết hồ sơ
                            </h2>
                            <p class="text-gray-500 mt-1 text-sm">
                                Cập nhật thông tin cá nhân của bạn để nhận được
                                hỗ trợ tốt nhất.
                            </p>
                        </div>

                        <form
                            @submit.prevent="handleSaveProfile"
                            class="space-y-6"
                        >
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div class="space-y-1.5">
                                    <label
                                        class="text-xs font-bold text-gray-700 ml-1"
                                        >Họ và tên</label
                                    >
                                    <div class="relative">
                                        <div
                                            class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"
                                        >
                                            <span
                                                class="material-icons-outlined text-gray-400 text-lg"
                                                >badge</span
                                            >
                                        </div>
                                        <input
                                            v-model="currentUser.fullName"
                                            type="text"
                                            required
                                            class="block w-full pl-11 pr-4 py-3 bg-gray-50 border border-transparent rounded-xl text-sm text-gray-900 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                <div class="space-y-1.5">
                                    <label
                                        class="text-xs font-bold text-gray-700 ml-1"
                                        >Số điện thoại</label
                                    >
                                    <div class="relative">
                                        <div
                                            class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"
                                        >
                                            <span
                                                class="material-icons-outlined text-gray-400 text-lg"
                                                >call</span
                                            >
                                        </div>
                                        <input
                                            v-model="currentUser.phone"
                                            type="tel"
                                            required
                                            class="block w-full pl-11 pr-4 py-3 bg-gray-50 border border-transparent rounded-xl text-sm text-gray-900 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                <div class="space-y-1.5 md:col-span-2">
                                    <label
                                        class="text-xs font-bold text-gray-700 ml-1"
                                        >Địa chỉ Email</label
                                    >
                                    <div class="relative">
                                        <div
                                            class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"
                                        >
                                            <span
                                                class="material-icons-outlined text-gray-400 text-lg"
                                                >mail</span
                                            >
                                        </div>
                                        <input
                                            v-model="currentUser.email"
                                            type="email"
                                            disabled
                                            class="block w-full pl-11 pr-4 py-3 bg-gray-100 border border-transparent rounded-xl text-sm text-gray-500 cursor-not-allowed"
                                        />
                                    </div>
                                    <p class="text-[11px] text-gray-400 ml-1">
                                        Email được sử dụng để đăng nhập không
                                        thể thay đổi trực tiếp.
                                    </p>
                                </div>

                                <div class="space-y-1.5">
                                    <label
                                        class="text-xs font-bold text-gray-700 ml-1"
                                        >Ngày sinh</label
                                    >
                                    <div class="relative">
                                        <div
                                            class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"
                                        >
                                            <span
                                                class="material-icons-outlined text-gray-400 text-lg"
                                                >cake</span
                                            >
                                        </div>
                                        <input
                                            v-model="currentUser.dob"
                                            type="date"
                                            class="block w-full pl-11 pr-4 py-3 bg-gray-50 border border-transparent rounded-xl text-sm text-gray-900 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div
                                class="flex justify-end pt-4 border-t border-gray-100"
                            >
                                <button
                                    type="submit"
                                    :disabled="isSaving"
                                    class="px-6 py-3 bg-primary text-white text-sm font-bold rounded-xl shadow-md disabled:opacity-70 transition-all hover:bg-orange-600 hover:-translate-y-0.5 flex items-center gap-2"
                                >
                                    <svg
                                        v-if="isSaving"
                                        class="animate-spin h-4 w-4 text-white"
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
                                    <span>{{
                                        isSaving
                                            ? 'Đang lưu...'
                                            : 'Lưu thay đổi'
                                    }}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
