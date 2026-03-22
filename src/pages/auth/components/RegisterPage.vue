<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '../authService'

const router = useRouter()

const form = reactive({
    username: '',
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    isAdmin: false, 
    adminSecret: '',
    terms: false,
})

const isLoading = ref(false)
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const errorMessage = ref('')

const handleRegister = async () => {
    errorMessage.value = ''

    if (!form.terms) {
        errorMessage.value = 'Vui lòng đồng ý với Điều khoản dịch vụ!'
        return
    }

    if (form.password !== form.confirmPassword) {
        errorMessage.value = 'Mật khẩu xác nhận không khớp!'
        return
    }

    // 🚨 Bắt lỗi Frontend: Nếu chọn Admin mà nhập sai mã thì chặn luôn
    if (form.isAdmin && form.adminSecret !== 'MAC_ADMIN_2026') {
        errorMessage.value = 'Mã xác thực Admin không chính xác!'
        return
    }

    isLoading.value = true
    try {
        await authService.register({
            username: form.username,
            password: form.password,
            full_name: form.fullName,
            email: form.email,
            phone_number: form.phone,
            // 🚨 Nếu check Admin thì gửi mã lên, không thì gửi undefined (BE tự cho thành Customer)
            admin_secret: form.isAdmin ? form.adminSecret : undefined,
        })

        alert('Đăng ký thành công! Vui lòng đăng nhập.')
        router.push({ name: 'login' })
    } catch (error: any) {
        errorMessage.value =
            error?.response?.data?.detail ||
            'Đăng ký thất bại, tên đăng nhập hoặc email có thể đã tồn tại.'
        console.error('Lỗi đăng ký:', error)
    } finally {
        isLoading.value = false
    }
}
</script>

<template>
    <div class="bg-[#F8FAFC] min-h-screen flex items-center justify-center p-4">
        <div class="w-full max-w-[600px]">
            <div class="text-center mb-6">
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

                <div
                    v-if="errorMessage"
                    class="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-xs font-semibold text-red-600"
                >
                    {{ errorMessage }}
                </div>

                <form @submit.prevent="handleRegister" class="space-y-5">
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div class="space-y-1.5">
                            <label
                                class="text-xs font-bold text-gray-700 ml-1"
                                for="username"
                                >Tên đăng nhập</label
                            >
                            <div class="group relative">
                                <div
                                    class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none"
                                >
                                    <span
                                        class="material-icons-outlined text-gray-400 text-xl"
                                        >account_circle</span
                                    >
                                </div>
                                <input
                                    v-model="form.username"
                                    id="username"
                                    type="text"
                                    required
                                    placeholder="Nhập username"
                                    class="block w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-transparent rounded-xl text-sm text-gray-900 focus:bg-white focus:border-primary outline-none transition-all"
                                />
                            </div>
                        </div>

                        <div class="space-y-1.5">
                            <label
                                class="text-xs font-bold text-gray-700 ml-1"
                                for="fullName"
                                >Họ và tên</label
                            >
                            <div class="group relative">
                                <div
                                    class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none"
                                >
                                    <span
                                        class="material-icons-outlined text-gray-400 text-xl"
                                        >person</span
                                    >
                                </div>
                                <input
                                    v-model="form.fullName"
                                    id="fullName"
                                    type="text"
                                    required
                                    placeholder="Nhập tên của bạn"
                                    class="block w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-transparent rounded-xl text-sm focus:bg-white focus:border-primary outline-none transition-all"
                                />
                            </div>
                        </div>

                        <div class="space-y-1.5">
                            <label
                                class="text-xs font-bold text-gray-700 ml-1"
                                for="email"
                                >Địa chỉ Email</label
                            >
                            <div class="group relative">
                                <div
                                    class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none"
                                >
                                    <span
                                        class="material-icons-outlined text-gray-400 text-xl"
                                        >mail</span
                                    >
                                </div>
                                <input
                                    v-model="form.email"
                                    id="email"
                                    type="email"
                                    required
                                    placeholder="Email của bạn"
                                    class="block w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-transparent rounded-xl text-sm focus:bg-white focus:border-primary outline-none transition-all"
                                />
                            </div>
                        </div>

                        <div class="space-y-1.5">
                            <label
                                class="text-xs font-bold text-gray-700 ml-1"
                                for="phone"
                                >Số điện thoại</label
                            >
                            <div class="group relative">
                                <div
                                    class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none"
                                >
                                    <span
                                        class="material-icons-outlined text-gray-400 text-xl"
                                        >call</span
                                    >
                                </div>
                                <input
                                    v-model="form.phone"
                                    id="phone"
                                    type="tel"
                                    required
                                    placeholder="Số điện thoại"
                                    class="block w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-transparent rounded-xl text-sm focus:bg-white focus:border-primary outline-none transition-all"
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
                                        class="material-icons-outlined text-gray-400 text-xl"
                                        >lock</span
                                    >
                                </div>
                                <input
                                    v-model="form.password"
                                    id="password"
                                    :type="showPassword ? 'text' : 'password'"
                                    required
                                    placeholder="••••••••"
                                    class="block w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-transparent rounded-xl text-sm focus:bg-white focus:border-primary outline-none transition-all"
                                />
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
                                        class="material-icons-outlined text-gray-400 text-xl"
                                        >lock_reset</span
                                    >
                                </div>
                                <input
                                    v-model="form.confirmPassword"
                                    id="confirmPassword"
                                    :type="
                                        showConfirmPassword
                                            ? 'text'
                                            : 'password'
                                    "
                                    required
                                    placeholder="••••••••"
                                    class="block w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-transparent rounded-xl text-sm focus:bg-white focus:border-primary outline-none transition-all"
                                />
                            </div>
                        </div>
                    </div>
                    <div
                        class="bg-gray-50 p-4 rounded-xl border border-gray-100 mt-2"
                    >
                        <label
                            class="relative flex items-center cursor-pointer w-max"
                        >
                            <input
                                v-model="form.isAdmin"
                                type="checkbox"
                                class="peer sr-only"
                            />
                            <div
                                class="w-4 h-4 bg-white border-2 border-gray-300 rounded peer-checked:bg-primary peer-checked:border-primary transition-all flex items-center justify-center"
                            >
                                <span
                                    class="material-icons-outlined text-[12px] text-white opacity-0 peer-checked:opacity-100 font-bold"
                                    >check</span
                                >
                            </div>
                            <span class="ml-2.5 text-xs font-bold text-gray-700"
                                >Chọn nếu bạn là Admin</span
                            >
                        </label>

                        <div
                            v-if="form.isAdmin"
                            class="mt-3 relative transition-all"
                        >
                            <div
                                class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none"
                            >
                                <span
                                    class="material-icons-outlined text-orange-500 text-xl"
                                    >admin_panel_settings</span
                                >
                            </div>
                            <input
                                v-model="form.adminSecret"
                                type="password"
                                placeholder="Nhập mã xác thực Admin..."
                                class="block w-full pl-10 pr-4 py-2 bg-white border border-orange-200 rounded-lg text-sm text-gray-900 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
                            />
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
                                class="w-4 h-4 bg-gray-100 border-2 border-gray-200 rounded peer-checked:bg-primary transition-all flex-shrink-0 flex items-center justify-center"
                            >
                                <span
                                    class="material-icons-outlined text-[12px] text-white opacity-0 peer-checked:opacity-100 font-bold"
                                    >check</span
                                >
                            </div>
                            <span
                                class="ml-2.5 text-[11px] font-semibold text-gray-600 mt-[1px]"
                                >Tôi đồng ý với
                                <a href="#" class="text-primary hover:underline"
                                    >Điều khoản dịch vụ</a
                                >
                                và
                                <a href="#" class="text-primary hover:underline"
                                    >Chính sách bảo mật</a
                                ></span
                            >
                        </label>
                    </div>

                    <button
                        type="submit"
                        :disabled="isLoading"
                        class="w-full mt-2 py-3 bg-primary text-white text-sm font-bold rounded-xl shadow-md disabled:opacity-70 transition-all hover:bg-orange-600 hover:-translate-y-0.5"
                    >
                        <span
                            v-if="isLoading"
                            class="flex items-center justify-center gap-2"
                        >
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
                            Đang xử lý...
                        </span>
                        <span v-else>Đăng ký ngay</span>
                    </button>
                </form>

                <div class="mt-6 pt-5 border-t border-gray-50 text-center">
                    <p class="text-xs text-gray-500 font-medium">
                        Đã có tài khoản?
                        <router-link
                            :to="{ name: 'login' }"
                            class="text-primary font-bold ml-1 hover:text-orange-600 transition-colors"
                            >Đăng nhập tại đây</router-link
                        >
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>
