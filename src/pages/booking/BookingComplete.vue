<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import httpClient from '@/api/axiosClient'

const props = defineProps<{ id?: string }>()
const router = useRouter()
const route = useRoute()

const isLoading = ref(true)
const booking = ref<any>(null)
const userInfo = ref<any>({})

const timeLeft = ref(15 * 60)
let timerId: ReturnType<typeof setInterval> | null = null
let pollingId: ReturnType<typeof setInterval> | null = null // 🌟 Thêm biến để Polling

const formattedTime = computed(() => {
    const m = Math.floor(timeLeft.value / 60)
        .toString()
        .padStart(2, '0')
    const s = (timeLeft.value % 60).toString().padStart(2, '0')
    return `${m}:${s}`
})

const BANK_BIN = '970422'
const ACCOUNT_NO = '00123112005'
const ACCOUNT_NAME = 'MAC HOTEL LUXURY'

const currentBookingId = computed(() => props.id || route.params.id)

const fetchBookingDetail = async (isBackground = false) => {
    try {
        if (!isBackground) isLoading.value = true

        const res: any = await httpClient.get('/api/bookings/my-bookings')
        const allBookings = res.data || res

        const currentBooking = allBookings.find(
            (b: any) => String(b.booking_id) === String(currentBookingId.value),
        )

        if (currentBooking) {
            booking.value = currentBooking

            // 🌟 NẾU ĐÃ THANH TOÁN XONG -> Dừng đếm ngược, dừng hỏi thăm BE
            if (
                currentBooking.status === 'CONFIRMED' ||
                currentBooking.is_deposit_paid
            ) {
                if (timerId) clearInterval(timerId)
                if (pollingId) clearInterval(pollingId)
            }
        }
    } catch (error) {
        console.error('Lỗi tải Đơn hàng:', error)
    } finally {
        if (!isBackground) isLoading.value = false
    }
}

onMounted(() => {
    const storedUser = localStorage.getItem('user_info')
    if (storedUser) userInfo.value = JSON.parse(storedUser)

    fetchBookingDetail()

    // Đếm ngược 15 phút
    timerId = setInterval(() => {
        if (timeLeft.value > 0) timeLeft.value--
        else if (timerId) clearInterval(timerId)
    }, 1000)

    // 🌟 POLLING: Cứ 3 giây lại gọi API ngầm 1 lần để check trạng thái
    pollingId = setInterval(() => {
        fetchBookingDetail(true) // true = chạy ngầm không hiện loading
    }, 3000)
})

onUnmounted(() => {
    if (timerId) clearInterval(timerId)
    if (pollingId) clearInterval(pollingId)
})

const nights = computed(() => {
    if (!booking.value) return 1
    const start = new Date(booking.value.check_in_date).getTime()
    const end = new Date(booking.value.check_out_date).getTime()
    const diff = Math.ceil((end - start) / (1000 * 3600 * 24))
    return diff > 0 ? diff : 1
})

const qrCodeUrl = computed(() => {
    if (!booking.value) return ''
    const amount = booking.value.deposit_amount
    const message = `MACBOOKING ${booking.value.booking_id}`
    return `https://img.vietqr.io/image/${BANK_BIN}-${ACCOUNT_NO}-compact.png?amount=${amount}&addInfo=${encodeURIComponent(message)}&accountName=${encodeURIComponent(ACCOUNT_NAME)}`
})

const formatCurrency = (val: number) =>
    new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(val || 0)
const formatDate = (dateString: string) => {
    if (!dateString) return ''
    return new Intl.DateTimeFormat('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    }).format(new Date(dateString))
}
</script>

<template>
    <div class="bg-gray-50 min-h-screen pb-20 pt-10">
        <div
            v-if="isLoading"
            class="flex items-center justify-center w-full h-[60vh]"
        >
            <div class="flex flex-col items-center gap-4">
                <span
                    class="material-symbols-outlined animate-spin text-primary text-5xl"
                    >autorenew</span
                >
                <span class="text-gray-600 font-bold tracking-wide"
                    >Đang tải thông tin đơn hàng...</span
                >
            </div>
        </div>

        <div v-else-if="booking" class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="mb-8 text-center">
                <h1 class="text-3xl font-black text-gray-900 mb-2">
                    Thanh toán đặt phòng
                </h1>
                <p class="text-gray-500">
                    Mã đơn hàng: #MAC-{{ booking.booking_id }}
                </p>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div class="lg:col-span-7">
                    <div
                        v-if="
                            booking.status === 'CONFIRMED' ||
                            booking.is_deposit_paid
                        "
                        class="bg-white rounded-3xl p-10 shadow-sm border border-green-100 flex flex-col items-center justify-center h-full text-center"
                    >
                        <div
                            class="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6"
                        >
                            <span
                                class="material-symbols-outlined text-green-600 text-5xl"
                                >check_circle</span
                            >
                        </div>
                        <h2 class="text-2xl font-black text-gray-900 mb-2">
                            Tuyệt vời! Đã nhận được cọc
                        </h2>
                        <p class="text-gray-500 mb-8 max-w-sm">
                            Hệ thống đã xác nhận khoản thanh toán của bạn. Phòng
                            đã được giữ thành công!
                        </p>

                        <div
                            class="bg-green-50 w-full rounded-2xl p-4 border border-green-100 mb-8"
                        >
                            <p class="text-green-700 font-bold">
                                Số tiền đã nhận:
                                {{ formatCurrency(booking.deposit_amount) }}
                            </p>
                        </div>

                        <router-link
                            :to="{ name: 'my-bookings' }"
                            class="bg-primary text-white font-bold py-3 px-8 rounded-xl shadow-lg hover:bg-orange-600 transition-all"
                        >
                            Xem lịch sử đặt phòng
                        </router-link>
                    </div>

                    <div
                        v-else
                        class="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col items-center h-full relative overflow-hidden"
                    >
                        <div
                            class="absolute top-0 left-0 w-full h-1 bg-gray-100 overflow-hidden"
                        >
                            <div
                                class="h-full bg-primary/50 w-1/3 animate-pulse relative"
                                style="animation: scroll 2s infinite linear"
                            ></div>
                        </div>

                        <div
                            class="flex items-center gap-2 mb-6 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-bold"
                        >
                            <span
                                class="material-symbols-outlined text-base animate-spin"
                                >sync</span
                            >
                            Hệ thống đang chờ thanh toán...
                        </div>

                        <div
                            class="bg-gray-50 p-6 rounded-3xl border-2 border-dashed border-gray-200 mb-8"
                        >
                            <img
                                :src="qrCodeUrl"
                                class="w-64 h-64 object-contain mix-blend-multiply"
                                alt="QR Thanh toán"
                            />
                        </div>

                        <div class="w-full max-w-sm space-y-4">
                            <div class="text-center">
                                <p
                                    class="text-gray-500 text-sm font-bold uppercase tracking-wider mb-1"
                                >
                                    Số tiền cần cọc (30%)
                                </p>
                                <p class="text-4xl font-black text-primary">
                                    {{ formatCurrency(booking.deposit_amount) }}
                                </p>
                            </div>

                            <div
                                class="bg-orange-50 rounded-2xl p-4 text-center border border-orange-100"
                            >
                                <p
                                    class="text-orange-600 text-xs font-bold uppercase mb-1"
                                >
                                    Nội dung chuyển khoản (Bắt buộc)
                                </p>
                                <p
                                    class="text-xl font-black text-gray-900 tracking-widest"
                                >
                                    MACBOOKING {{ booking.booking_id }}
                                </p>
                            </div>
                        </div>

                        <div
                            class="flex items-center justify-center gap-2 mt-8 text-red-500 bg-red-50 py-3 px-6 rounded-full font-bold w-full max-w-sm"
                        >
                            <span class="material-symbols-outlined">timer</span>
                            <span
                                >Mã hết hạn sau:
                                <span class="font-mono text-lg ml-1">{{
                                    formattedTime
                                }}</span></span
                            >
                        </div>
                    </div>
                </div>

                <div class="lg:col-span-5">
                    <div
                        class="bg-white rounded-3xl shadow-sm border border-gray-100 sticky top-8"
                    >
                        <div class="p-6 space-y-6">
                            <div>
                                <p
                                    class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3"
                                >
                                    Chi tiết lưu trú
                                </p>
                                <div
                                    class="bg-gray-50 rounded-2xl p-4 space-y-3"
                                >
                                    <div
                                        class="flex justify-between items-center"
                                    >
                                        <span class="text-gray-600 font-medium"
                                            >Phòng nhận</span
                                        >
                                        <span class="font-bold text-gray-900"
                                            >Phòng
                                            {{
                                                booking.room?.room_number
                                            }}</span
                                        >
                                    </div>
                                    <div
                                        class="flex justify-between items-center"
                                    >
                                        <span class="text-gray-600 font-medium"
                                            >Nhận phòng</span
                                        >
                                        <span class="font-bold text-gray-900">{{
                                            formatDate(booking.check_in_date)
                                        }}</span>
                                    </div>
                                    <div
                                        class="flex justify-between items-center"
                                    >
                                        <span class="text-gray-600 font-medium"
                                            >Trả phòng</span
                                        >
                                        <span class="font-bold text-gray-900">{{
                                            formatDate(booking.check_out_date)
                                        }}</span>
                                    </div>
                                    <div
                                        class="flex justify-between items-center pt-3 border-t border-gray-200"
                                    >
                                        <span class="text-gray-600 font-medium"
                                            >Tổng thời gian</span
                                        >
                                        <span
                                            class="font-bold text-primary bg-orange-50 px-2 py-1 rounded-md"
                                            >{{ nights }} đêm</span
                                        >
                                    </div>
                                </div>
                            </div>

                            <div>
                                <p
                                    class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3"
                                >
                                    Thông tin liên hệ
                                </p>
                                <div class="space-y-2">
                                    <div class="flex justify-between text-sm">
                                        <span class="text-gray-500"
                                            >Khách hàng</span
                                        >
                                        <span class="font-bold text-gray-900">{{
                                            booking.user?.full_name ||
                                            userInfo.full_name ||
                                            userInfo.fullName
                                        }}</span>
                                    </div>
                                    <div class="flex justify-between text-sm">
                                        <span class="text-gray-500"
                                            >Điện thoại</span
                                        >
                                        <span class="font-bold text-gray-900">{{
                                            booking.user?.phone_number ||
                                            userInfo.phone_number ||
                                            userInfo.phone
                                        }}</span>
                                    </div>
                                </div>
                            </div>

                            <div
                                class="pt-4 border-t border-dashed border-gray-200"
                            >
                                <div
                                    class="flex justify-between items-center mb-2"
                                >
                                    <span class="text-gray-500 font-medium"
                                        >Tổng tiền phòng</span
                                    >
                                    <span class="font-bold text-gray-900">{{
                                        formatCurrency(booking.total_amount)
                                    }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
@keyframes scroll {
    0% {
        transform: translateX(-100%);
    }
    100% {
        transform: translateX(300%);
    }
}
</style>
