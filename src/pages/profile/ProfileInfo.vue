<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Dữ liệu giả lập của User (Sau này lấy từ trạng thái đăng nhập hoặc gọi API)
const currentUser = reactive({
    fullName: 'Nguyễn Tuấn Anh',
    email: 'tuananh@example.com',
    phone: '0123 456 789',
    dob: '1998-05-15',
    address: '123 Đường ABC, Quận Ninh Kiều, Cần Thơ',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop',
    joinDate: 'Tháng 10, 2025',
})

const isSaving = ref(false)

const handleSaveProfile = async () => {
    isSaving.value = true
    try {
        // Giả lập thời gian gọi API lưu dữ liệu
        await new Promise((resolve) => setTimeout(resolve, 1000))
        alert('Cập nhật thông tin thành công!')
    } catch (error) {
        console.error(error)
        alert('Có lỗi xảy ra!')
    } finally {
        isSaving.value = false
    }
}

const handleLogout = () => {
    // Xử lý logic đăng xuất ở đây (xóa localStorage, v.v.)
    alert('Đăng xuất thành công!')
    router.push({ name: 'login' })
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
                                class="w-full h-full bg-orange-100 flex items-center justify-center text-primary text-3xl font-bold"
                            >
                                {{ currentUser.fullName.charAt(0) }}
                            </div>
                            <div
                                class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <span class="material-icons-outlined text-white"
                                    >photo_camera</span
                                >
                            </div>
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
                                :to="{ name: 'info' }"
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
                                <span
                                    class="bg-gray-100 text-gray-600 text-xs font-bold px-2.5 py-1 rounded-full"
                                    >3</span
                                >
                            </router-link>

                            <a
                                href="#"
                                class="flex items-center gap-3 px-6 py-4 text-gray-600 hover:bg-gray-50 hover:text-primary font-medium transition-colors border-l-4 border-transparent"
                            >
                                <span class="material-icons-outlined"
                                    >security</span
                                >
                                Mật khẩu & Bảo mật
                            </a>

                            <div class="h-px bg-gray-100 my-1 mx-4"></div>
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
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
