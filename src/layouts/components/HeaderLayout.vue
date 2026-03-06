<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuth } from '@/pages/auth/useAuth'

const router = useRouter()
const { isLoggedIn, currentUser, logout } = useAuth()

const goToLogin = () => {
    router.push({ name: 'login' })
}

const handleLogout = () => {
    logout()
    router.push({ name: 'home' })
}

const goHome = () => {
    router.push({ name: 'home' })
}

const gotoRoomPage = () => {
    router.push({ name: 'room' })
}

const gotoServicePage = () => {
    router.push({ name: 'service' })
}

const gotoBookingHistory = () => {
    router.push({ name: 'my-bookings' })
}

const gotoProfileInfo = () => {
    router.push({ name: 'profile' })
}
</script>

<template>
    <div
        class="layout-content-container flex flex-col w-full sticky top-0 z-50"
    >
        <header
            class="flex items-center justify-between whitespace-nowrap px-10 py-4 bg-white shadow-sm border-b border-gray-100"
        >
            <div
                @click="goHome"
                class="flex items-center gap-2 cursor-pointer group"
            >
                <span
                    class="material-icons-outlined text-primary text-3xl group-hover:scale-110 transition-transform"
                >
                    hotel
                </span>
                <h2
                    class="text-gray-900 font-extrabold text-2xl leading-tight tracking-tight uppercase"
                >
                    Mac<span class="text-primary">Hotel</span>
                </h2>
            </div>

            <div class="flex flex-1 justify-end gap-8 items-center">
                <nav class="hidden md:flex items-center gap-8">
                    <button
                        class="text-sm font-semibold text-gray-600 hover:text-primary transition-colors"
                        @click="goHome"
                    >
                        Trang chủ
                    </button>
                    <button
                        class="text-sm font-semibold text-gray-600 hover:text-primary transition-colors"
                        @click="gotoRoomPage"
                    >
                        Phòng
                    </button>
                    <button
                        class="text-sm font-semibold text-gray-600 hover:text-primary transition-colors"
                        @click="gotoServicePage"
                    >
                        Dịch vụ
                    </button>
                    <button
                        v-if="isLoggedIn"
                        class="text-sm font-semibold text-primary hover:text-orange-600 transition-colors"
                        @click="gotoBookingHistory"
                    >
                        Đơn đặt phòng
                    </button>
                </nav>

                <div class="h-6 w-px bg-gray-500 hidden md:block"></div>

                <template v-if="!isLoggedIn">
                    <button
                        @click="goToLogin"
                        class="flex cursor-pointer items-center justify-center rounded-full h-10 px-6 bg-primary text-white text-sm font-bold shadow-md hover:bg-orange-600 hover:shadow-lg transition-all transform hover:-translate-y-0.5"
                    >
                        <span class="truncate">Đăng nhập</span>
                    </button>
                </template>

                <template v-else>
                    <div class="flex items-center gap-4">
                        <button
                            @click="handleLogout"
                            class="flex cursor-pointer items-center justify-center rounded-full h-9 px-5 bg-gray-100 text-gray-600 text-sm font-bold hover:bg-red-50 hover:text-red-500 transition-colors"
                        >
                            <span class="truncate">Đăng xuất</span>
                        </button>

                        <button @click="gotoProfileInfo">
                            <div
                                class="flex items-center justify-center cursor-pointer rounded-full size-10 bg-gray-100 border-2 border-transparent hover:border-orange-400 shadow-sm transition-all overflow-hidden group"
                                title="Hồ sơ của tôi"
                            >
                                <img
                                    v-if="currentUser?.avatar"
                                    :src="currentUser.avatar"
                                    alt="Avatar"
                                    class="w-full h-full object-cover"
                                />

                                <span
                                    v-else
                                    class="material-icons-outlined text-gray-400 group-hover:text-primary text-[26px] transition-colors"
                                >
                                    person
                                </span>
                            </div>
                        </button>
                    </div>
                </template>
            </div>
        </header>
    </div>
</template>
