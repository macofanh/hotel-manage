<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../useAuth'

const router = useRouter()
const { login } = useAuth()

const form = reactive({
    identifier: '',
    password: '',
    rememberMe: false,
})

const isLoading = ref(false)

const handleLogin = async () => {
    isLoading.value = true
    try {
        await new Promise((resolve) => setTimeout(resolve, 1200))
        const userData = {
            fullName: 'Tuấn Anh',
            avatar: null,
        }
        login('fake-jwt-token-123', userData)
        router.push({ name: 'home' })
    } catch (error) {
        console.error(error)
    } finally {
        isLoading.value = false
    }
}
</script>

<template>
    <div class="bg-[#F8FAFC] min-h-screen flex items-center justify-center p-4">
        <div class="w-full max-w-[380px]">
            <div class="text-center mb-6">
                <div
                    class="inline-flex items-center justify-center w-14 h-14 bg-white rounded-2xl shadow-sm border border-gray-100 mb-4"
                >
                    <span class="material-icons-outlined text-primary text-3xl"
                        >apartment</span
                    >
                </div>
                <h1
                    class="text-2xl font-black text-gray-900 tracking-tight mb-1"
                >
                    Mac<span class="text-primary">Hotel</span>
                </h1>
                <p class="text-gray-500 text-sm font-medium">
                    Chào mừng bạn quay trở lại!
                </p>
            </div>

            <div
                class="bg-white p-7 rounded-[1.5rem] shadow-[0_8px_20px_rgba(0,0,0,0.15)]"
            >
                <h2 class="text-xl font-bold text-gray-800 mb-6">Đăng nhập</h2>

                <form @submit.prevent="handleLogin" class="space-y-4">
                    <div class="space-y-1.5">
                        <label
                            class="text-xs font-bold text-gray-700 ml-1"
                            for="identifier"
                        >
                            Tài khoản
                        </label>
                        <div class="group relative">
                            <div
                                class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none"
                            >
                                <span
                                    class="material-icons-outlined text-gray-400 group-focus-within:text-primary text-xl transition-colors"
                                    >person</span
                                >
                            </div>
                            <input
                                v-model="form.identifier"
                                id="identifier"
                                type="text"
                                required
                                placeholder="Nhập email của bạn"
                                class="block w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-transparent rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div class="space-y-1.5">
                        <div class="flex items-center justify-between px-1">
                            <label
                                class="text-xs font-bold text-gray-700"
                                for="password"
                                >Mật khẩu</label
                            >
                            <a
                                href="#"
                                class="text-[10px] font-bold text-primary hover:underline uppercase tracking-tighter"
                                >Quên mật khẩu?</a
                            >
                        </div>
                        <div class="group relative">
                            <div
                                class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none"
                            >
                                <span
                                    class="material-icons-outlined text-gray-400 group-focus-within:text-primary text-xl transition-colors"
                                    >lock</span
                                >
                            </div>
                            <input
                                v-model="form.password"
                                id="password"
                                type="password"
                                required
                                placeholder="••••••••"
                                class="block w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-transparent rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div class="flex items-center px-1 py-1">
                        <label
                            class="relative flex items-center cursor-pointer"
                        >
                            <input
                                v-model="form.rememberMe"
                                type="checkbox"
                                class="peer sr-only"
                            />
                            <div
                                class="w-4 h-4 bg-gray-100 border-2 border-gray-200 rounded peer-checked:bg-primary peer-checked:border-primary transition-all"
                            ></div>
                            <span
                                class="ml-2.5 text-xs font-semibold text-gray-600"
                                >Duy trì đăng nhập</span
                            >
                            <span
                                class="absolute text-white opacity-0 peer-checked:opacity-100 left-0.5 transition-opacity"
                            >
                                <span
                                    class="material-icons-outlined text-[12px] font-bold"
                                    >check</span
                                >
                            </span>
                        </label>
                    </div>

                    <button
                        type="submit"
                        :disabled="isLoading"
                        class="w-full relative flex justify-center items-center py-3 bg-primary text-white text-sm font-bold rounded-xl shadow-md shadow-primary/20 hover:bg-orange-600 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-70 disabled:hover:translate-y-0"
                    >
                        <div v-if="isLoading" class="flex items-center gap-2">
                            <svg
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
                            <span>Đang xử lý...</span>
                        </div>
                        <span v-else>Đăng nhập</span>
                    </button>
                </form>

                <div class="mt-8 pt-5 border-t border-gray-50 text-center">
                    <p class="text-xs text-gray-500 font-medium">
                        Bạn chưa có tài khoản?
                        <router-link
                            :to="{ name: 'register' }"
                            class="text-primary font-bold hover:text-orange-600 ml-1 transition-colors"
                        >
                            Tạo tài khoản ngay
                        </router-link>
                    </p>
                </div>
            </div>

            <div class="mt-8 text-center">
                <p
                    class="text-[10px] text-gray-400 font-medium uppercase tracking-widest"
                >
                    © 2026 MacHotel Luxury
                </p>
            </div>
        </div>
    </div>
</template>
