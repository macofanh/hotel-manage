<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '@/pages/auth/useAuth'

const route = useRoute()
const router = useRouter()
const { currentUser, logout } = useAuth()

const isActive = (routeName: string) => {
    return (
        route.name === routeName || route.name?.toString().startsWith(routeName)
    )
}

const handleLogout = () => {
    logout()
    alert('Đăng xuất thành công!')
    router.push({ name: 'login' })
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
    <div class="flex h-screen w-full bg-[#f8f7f5] overflow-hidden">
        <aside
            class="w-64 flex-shrink-0 bg-white border-r border-gray-200 flex flex-col justify-between p-4 h-full z-10"
        >
            <div class="flex flex-col gap-6">
                <div class="flex gap-3 items-center px-2 py-4">
                    <div
                        class="flex items-center justify-center cursor-pointer rounded-full size-10 bg-orange-100 border-2 border-transparent hover:border-primary shadow-sm transition-all overflow-hidden group"
                    >
                        <img
                            v-if="(currentUser as any)?.avatar_url"
                            :src="getFullUrl((currentUser as any).avatar_url)"
                            alt="Avatar"
                            class="w-full h-full object-cover"
                        />

                        <span
                            v-else-if="currentUser?.full_name"
                            class="text-primary font-bold text-lg uppercase group-hover:scale-110 transition-transform"
                        >
                            {{ currentUser.full_name.charAt(0) }}
                        </span>

                        <span
                            v-else
                            class="material-icons-outlined text-primary text-[24px] group-hover:scale-110 transition-transform"
                        >
                            person
                        </span>
                    </div>

                    <div class="flex flex-col">
                        <h1
                            class="text-gray-900 text-base font-bold leading-tight truncate w-32"
                        >
                            {{ currentUser?.full_name || 'Admin' }}
                        </h1>
                        <p
                            class="text-gray-500 text-[11px] font-bold uppercase tracking-wider mt-0.5"
                        >
                            {{ currentUser?.role || 'SUPER ADMIN' }}
                        </p>
                    </div>
                </div>

                <nav class="flex flex-col gap-1.5">
                    <router-link
                        :to="{ name: 'admin-overview' }"
                        class="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer group transition-all"
                        :class="
                            isActive('admin-overview')
                                ? 'bg-primary text-white shadow-md shadow-primary/20'
                                : 'hover:bg-gray-50 text-gray-700'
                        "
                    >
                        <span
                            class="material-symbols-outlined"
                            :style="
                                isActive('admin-overview')
                                    ? 'font-variation-settings: \'FILL\' 1'
                                    : ''
                            "
                            >dashboard</span
                        >
                        <p class="text-sm font-semibold">Tổng quan</p>
                    </router-link>

                    <router-link
                        :to="{ name: 'admin-users' }"
                        class="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer group transition-all"
                        :class="
                            isActive('admin-users')
                                ? 'bg-primary text-white shadow-md shadow-primary/20'
                                : 'hover:bg-gray-50 text-gray-700'
                        "
                    >
                        <span
                            class="material-symbols-outlined group-hover:text-primary transition-colors"
                            :class="
                                isActive('admin-users') ? '!text-white' : ''
                            "
                            >group</span
                        >
                        <p class="text-sm font-medium">Người dùng</p>
                    </router-link>

                    <router-link
                        :to="{ name: 'admin-bookings' }"
                        class="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer group transition-all"
                        :class="
                            isActive('admin-bookings')
                                ? 'bg-primary text-white shadow-md shadow-primary/20'
                                : 'hover:bg-gray-50 text-gray-700'
                        "
                    >
                        <span
                            class="material-symbols-outlined group-hover:text-primary transition-colors"
                            :class="
                                isActive('admin-bookings') ? '!text-white' : ''
                            "
                            >receipt_long</span
                        >
                        <p class="text-sm font-medium">Đơn đặt phòng</p>
                    </router-link>

                    <router-link
                        :to="{ name: 'admin-rooms' }"
                        class="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer group transition-all"
                        :class="
                            isActive('admin-rooms')
                                ? 'bg-primary text-white shadow-md shadow-primary/20'
                                : 'hover:bg-gray-50 text-gray-700'
                        "
                    >
                        <span
                            class="material-symbols-outlined group-hover:text-primary transition-colors"
                            :class="
                                isActive('admin-rooms') ? '!text-white' : ''
                            "
                            >bed</span
                        >
                        <p class="text-sm font-medium">Danh sách Phòng</p>
                    </router-link>

                    <router-link
                        :to="{ name: 'admin-services' }"
                        class="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer group transition-all"
                        :class="
                            isActive('admin-services')
                                ? 'bg-primary text-white shadow-md shadow-primary/20'
                                : 'hover:bg-gray-50 text-gray-700'
                        "
                    >
                        <span
                            class="material-symbols-outlined group-hover:text-primary transition-colors"
                            :class="
                                isActive('admin-services') ? '!text-white' : ''
                            "
                            >room_service</span
                        >
                        <p class="text-sm font-medium">Dịch vụ</p>
                    </router-link>

                    <div class="mt-4 pt-4 border-t border-gray-100">
                        <div
                            class="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 text-gray-700 cursor-pointer group transition-all"
                        >
                            <span
                                class="material-symbols-outlined group-hover:text-primary transition-colors"
                                >settings</span
                            >
                            <p class="text-sm font-medium">Cài đặt hệ thống</p>
                        </div>
                    </div>
                </nav>
            </div>

            <div class="flex flex-col gap-1">
                <button
                    @click="handleLogout"
                    class="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-50 text-red-600 cursor-pointer transition-colors w-full text-left"
                >
                    <span class="material-symbols-outlined">logout</span>
                    <p class="text-sm font-semibold">Đăng xuất</p>
                </button>
            </div>
        </aside>

        <main class="flex-1 h-full overflow-y-auto bg-[#f8f7f5] p-8 relative">
            <router-view v-slot="{ Component }">
                <transition name="fade" mode="out-in">
                    <component :is="Component" />
                </transition>
            </router-view>
        </main>
    </div>
</template>

<style scoped>
/* Hiệu ứng chuyển trang mượt mà */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
