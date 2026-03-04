<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const form = reactive({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    terms: false,
})

const isLoading = ref(false)
const showPassword = ref(false)
const showConfirmPassword = ref(false)

const handleRegister = async () => {
    if (!form.terms) {
        alert('Vui lòng đồng ý với Điều khoản dịch vụ và Chính sách bảo mật!')
        return
    }

    if (form.password !== form.confirmPassword) {
        alert('Mật khẩu xác nhận không khớp!')
        return
    }

    isLoading.value = true
    try {
        await new Promise((resolve) => setTimeout(resolve, 1200))

        console.log('Dữ liệu đăng ký:', form)

        router.push({ name: 'login' })
    } catch (error) {
        console.error('Lỗi đăng ký:', error)
    } finally {
        isLoading.value = false
    }
}
</script>

<template>
    <div class="bg-[#F8FAFC] min-h-screen flex items-center justify-center p-4">
        <div class="w-full max-w-[380px]">
            <div class="text-center mb-6">
                <div class="flex items-center justify-center gap-2 mb-2">
                    <div class="h-[1px] w-8 bg-primary"></div>
                    <span
                        class="text-primary font-bold tracking-widest uppercase text-[10px]"
                        >Tạo tài khoản</span
                    >
                    <div class="h-[1px] w-8 bg-primary"></div>
                </div>
                <h1
                    class="text-2xl font-black text-gray-900 tracking-tight mb-1"
                >
                    Mac<span class="text-primary">Hotel</span>
                </h1>
            </div>

            <div
                class="bg-white p-7 rounded-[1.5rem] shadow-[0_8px_20px_rgba(0,0,0,0.15)]"
            >
                <h2 class="text-lg font-bold text-gray-800 mb-5 text-center">
                    Đăng ký thành viên
                </h2>

                <form @submit.prevent="handleRegister" class="space-y-4">
                    <div class="space-y-1.5">
                        <label
                            class="text-xs font-bold text-gray-700 ml-1"
                            for="fullName"
                        >
                            Họ và tên
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
                                v-model="form.fullName"
                                id="fullName"
                                type="text"
                                required
                                placeholder="Nhập tên của bạn"
                                class="block w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-transparent rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div class="space-y-1.5">
                        <label
                            class="text-xs font-bold text-gray-700 ml-1"
                            for="email"
                        >
                            Địa chỉ Email
                        </label>
                        <div class="group relative">
                            <div
                                class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none"
                            >
                                <span
                                    class="material-icons-outlined text-gray-400 group-focus-within:text-primary text-xl transition-colors"
                                    >mail</span
                                >
                            </div>
                            <input
                                v-model="form.email"
                                id="email"
                                type="email"
                                required
                                placeholder="Nhập email của bạn"
                                class="block w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-transparent rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div class="space-y-1.5">
                        <label
                            class="text-xs font-bold text-gray-700 ml-1"
                            for="phone"
                        >
                            Số điện thoại
                        </label>
                        <div class="group relative">
                            <div
                                class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none"
                            >
                                <span
                                    class="material-icons-outlined text-gray-400 group-focus-within:text-primary text-xl transition-colors"
                                    >call</span
                                >
                            </div>
                            <input
                                v-model="form.phone"
                                id="phone"
                                type="tel"
                                required
                                placeholder="Nhập số của bạn"
                                class="block w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-transparent rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div class="space-y-1.5">
                        <label
                            class="text-xs font-bold text-gray-700 ml-1"
                            for="password"
                            >Mật khẩu</label
                        >
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
                                :type="showPassword ? 'text' : 'password'"
                                required
                                placeholder="••••••••"
                                class="block w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-transparent rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                            />
                            <button
                                type="button"
                                @click="showPassword = !showPassword"
                                class="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-primary transition-colors cursor-pointer"
                            >
                                <span class="material-icons-outlined text-xl">{{
                                    showPassword
                                        ? 'visibility'
                                        : 'visibility_off'
                                }}</span>
                            </button>
                        </div>
                    </div>

                    <div class="space-y-1.5">
                        <label
                            class="text-xs font-bold text-gray-700 ml-1"
                            for="confirmPassword"
                            >Xác nhận mật khẩu</label
                        >
                        <div class="group relative">
                            <div
                                class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none"
                            >
                                <span
                                    class="material-icons-outlined text-gray-400 group-focus-within:text-primary text-xl transition-colors"
                                    >lock_reset</span
                                >
                            </div>
                            <input
                                v-model="form.confirmPassword"
                                id="confirmPassword"
                                :type="
                                    showConfirmPassword ? 'text' : 'password'
                                "
                                required
                                placeholder="••••••••"
                                class="block w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-transparent rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                            />
                            <button
                                type="button"
                                @click="
                                    showConfirmPassword = !showConfirmPassword
                                "
                                class="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-primary transition-colors cursor-pointer"
                            >
                                <span class="material-icons-outlined text-xl">{{
                                    showConfirmPassword
                                        ? 'visibility'
                                        : 'visibility_off'
                                }}</span>
                            </button>
                        </div>
                    </div>

                    <div class="flex items-start px-1 pt-1">
                        <label
                            class="relative flex items-start cursor-pointer mt-0.5"
                        >
                            <input
                                v-model="form.terms"
                                type="checkbox"
                                class="peer sr-only"
                            />
                            <div
                                class="w-4 h-4 bg-gray-100 border-2 border-gray-200 rounded peer-checked:bg-primary peer-checked:border-primary transition-all flex-shrink-0"
                            ></div>
                            <span
                                class="ml-2.5 text-[11px] font-semibold text-gray-600 leading-tight"
                            >
                                Tôi đồng ý với
                                <a href="#" class="text-primary hover:underline"
                                    >Điều khoản dịch vụ</a
                                >
                                và
                                <a href="#" class="text-primary hover:underline"
                                    >Chính sách bảo mật</a
                                >
                            </span>
                            <span
                                class="absolute text-white opacity-0 peer-checked:opacity-100 left-0.5 top-[2px] transition-opacity"
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
                        class="w-full mt-2 relative flex justify-center items-center gap-2 py-3 bg-primary text-white text-sm font-bold rounded-xl shadow-md shadow-primary/20 hover:bg-orange-600 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-70 disabled:hover:translate-y-0"
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
                        <template v-else>
                            <span>Đăng ký ngay</span>
                            <span class="material-icons-outlined text-[18px]"
                                >arrow_forward</span
                            >
                        </template>
                    </button>
                </form>

                <div class="mt-6 pt-5 border-t border-gray-50 text-center">
                    <p class="text-xs text-gray-500 font-medium">
                        Đã có tài khoản?
                        <router-link
                            :to="{ name: 'login' }"
                            class="text-primary font-bold hover:text-orange-600 ml-1 transition-colors"
                        >
                            Đăng nhập tại đây
                        </router-link>
                    </p>
                </div>
            </div>

            <div class="mt-8 text-center">
                <p
                    class="text-[10px] text-gray-400 font-medium uppercase tracking-widest"
                >
                    © 2026 MacHotel Luxury. Dịch vụ chuyên nghiệp.
                </p>
            </div>
        </div>
    </div>
</template>
