<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps<{
    id: string
}>()

const router = useRouter()

const isLoading = ref(true)
const room = ref<any>(null)

const timeLeft = ref(15 * 60)
let timerId: ReturnType<typeof setInterval> | null = null

const formattedTime = computed(() => {
    const minutes = Math.floor(timeLeft.value / 60)
        .toString()
        .padStart(2, '0')
    const seconds = (timeLeft.value % 60).toString().padStart(2, '0')
    return `${minutes}:${seconds}`
})


onMounted(async () => {
    // Bắt đầu đếm ngược
    timerId = setInterval(() => {
        if (timeLeft.value > 0) {
            timeLeft.value--
        } else if (timerId) {
            clearInterval(timerId)
        }
    }, 1000)

    // Giả lập thời gian tải API
    await new Promise((resolve) => setTimeout(resolve, 500))

    const roomId = props.id || '1'

    room.value = {
        id: roomId,
        name:
            roomId === '3'
                ? 'Phòng Super Deluxe'
                : roomId === '2'
                  ? 'Phòng Executive Suite'
                  : 'Phòng Junior Suite Cao Cấp',
        hotel: 'MacHotel Luxury',
        rating: 4.9,
        image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=400&auto=format&fit=crop',
        pricePerNight: roomId === '3' ? 200 : roomId === '2' ? 150 : 100,
        nights: 3,
        serviceFee: 45.0,
        tax: 28.5,
        checkIn: '12 Th10, 2026',
        checkOut: '15 Th10, 2026',
        guests: '2 Người lớn',
    }

    isLoading.value = false
})

// Xóa timer khi rời khỏi trang để tránh rò rỉ bộ nhớ
onUnmounted(() => {
    if (timerId) clearInterval(timerId)
})

// CÁC HÀM XỬ LÝ NÚT BẤM
const handlePaymentSuccess = () => {
    alert('Thanh toán thành công! Cảm ơn bạn đã đặt phòng.')
    router.push({ name: 'my-bookings' })
}

const handleGoBack = () => {
    // Quay lại trang nhập thông tin kèm theo ID phòng hiện tại
    router.push({ name: 'booking', params: { id: props.id } })
}
</script>

<template>
    <div class="bg-[#f8f7f5] min-h-screen pb-20">
        <div
            v-if="isLoading"
            class="flex items-center justify-center w-full h-96"
        >
            <div class="flex flex-col items-center gap-3">
                <svg
                    class="animate-spin h-8 w-8 text-primary"
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
                <span class="text-gray-500 font-medium"
                    >Đang khởi tạo cổng thanh toán...</span
                >
            </div>
        </div>

        <div v-else class="flex flex-1 justify-center py-5">
            <div
                class="layout-content-container flex flex-col max-w-[1200px] w-full px-6 md:px-10"
            >
                <div class="flex flex-wrap gap-2 py-4">
                    <router-link
                        :to="{ name: 'home' }"
                        class="text-[#8d7a5e] text-sm font-medium hover:text-primary"
                        >Trang chủ</router-link
                    >
                    <span class="text-[#8d7a5e] text-sm font-medium">/</span>
                    <router-link
                        :to="{ name: 'room' }"
                        class="text-[#8d7a5e] text-sm font-medium hover:text-primary"
                        >Phòng nghỉ</router-link
                    >
                    <span class="text-[#8d7a5e] text-sm font-medium">/</span>
                    <span class="text-[#181510] text-sm font-medium"
                        >Thanh toán</span
                    >
                </div>

                <div class="flex flex-wrap justify-between gap-3 py-6">
                    <div class="flex min-w-72 flex-col gap-2">
                        <p
                            class="text-[#181510] text-4xl font-black leading-tight tracking-[-0.033em]"
                        >
                            Thanh toán
                        </p>
                        <p class="text-[#8d7a5e] text-lg font-medium">
                            Quét mã QR để hoàn tất thanh toán và giữ phòng của
                            bạn.
                        </p>
                    </div>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4">
                    <div class="lg:col-span-2 flex flex-col gap-6">
                        <div
                            class="bg-white rounded-2xl p-8 shadow-sm border border-[#e7e2da]"
                        >
                            <div class="flex items-center justify-between mb-8">
                                <div class="flex flex-col">
                                    <h3
                                        class="text-[#181510] text-2xl font-bold leading-tight"
                                    >
                                        Thanh toán qua mã QR
                                    </h3>
                                    <p class="text-[#8d7a5e] text-sm">
                                        Xác nhận tự động thông qua cổng thanh
                                        toán
                                    </p>
                                </div>
                                <div
                                    class="flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-sm font-bold"
                                >
                                    <span
                                        class="material-symbols-outlined text-base"
                                        >verified_user</span
                                    >
                                    Giao dịch an toàn
                                </div>
                            </div>

                            <div
                                class="flex flex-col items-center justify-center py-6 bg-[#fcfbf9] rounded-2xl border-2 border-dashed border-[#e7e2da]"
                            >
                                <div
                                    class="relative bg-white p-6 rounded-2xl shadow-xl border border-[#e7e2da] mb-6"
                                >
                                    <div
                                        class="absolute -top-3 -left-3 bg-primary text-white p-2 rounded-lg shadow-lg"
                                    >
                                        <span class="material-symbols-outlined"
                                            >qr_code_2</span
                                        >
                                    </div>
                                    <img
                                        alt="Payment QR Code"
                                        class="w-[200px] h-[200px] md:w-[250px] md:h-[250px]"
                                        src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=ThanhToanMacHotel"
                                    />
                                    <div
                                        class="absolute inset-0 flex items-center justify-center pointer-events-none"
                                    >
                                        <div
                                            class="bg-white p-1.5 rounded-md border shadow-sm"
                                        >
                                            <span
                                                class="material-symbols-outlined text-primary text-2xl"
                                                >apartment</span
                                            >
                                        </div>
                                    </div>
                                </div>

                                <div
                                    class="text-center space-y-4 max-w-sm px-4"
                                >
                                    <div class="space-y-1">
                                        <p
                                            class="text-3xl font-black text-primary"
                                        >
                                            ${{
                                                (
                                                    room.pricePerNight *
                                                        room.nights +
                                                    room.serviceFee +
                                                    room.tax
                                                ).toFixed(2)
                                            }}
                                        </p>
                                        <p
                                            class="text-[#8d7a5e] text-xs font-bold uppercase tracking-widest"
                                        >
                                            Số tiền cần thanh toán
                                        </p>
                                    </div>
                                    <div
                                        class="p-4 bg-white rounded-xl border border-[#e7e2da]"
                                    >
                                        <p
                                            class="text-[#181510] text-sm font-bold mb-1"
                                        >
                                            Mở ứng dụng ngân hàng để quét mã
                                        </p>
                                        <p class="text-[#8d7a5e] text-xs">
                                            Hỗ trợ tất cả ứng dụng Mobile
                                            Banking và Ví điện tử
                                        </p>
                                    </div>
                                    <div
                                        class="flex items-center justify-center gap-2 text-red-500 font-bold text-sm bg-red-50 py-2 px-4 rounded-full"
                                    >
                                        <span
                                            class="material-symbols-outlined text-base"
                                            >timer</span
                                        >
                                        <span
                                            >Mã hết hạn sau:
                                            <span class="font-mono text-base">{{
                                                formattedTime
                                            }}</span></span
                                        >
                                    </div>

                                    <button
                                        @click="handlePaymentSuccess"
                                        class="mt-4 px-4 py-2 bg-gray-900 text-white text-xs font-bold rounded-lg hover:bg-gray-800 transition-colors"
                                    >
                                        [Dev] Giả lập thanh toán thành công
                                    </button>
                                </div>
                            </div>

                            <div
                                class="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4"
                            >
                                <div
                                    class="flex items-center gap-3 p-3 rounded-lg border border-[#e7e2da]"
                                >
                                    <span
                                        class="material-symbols-outlined text-primary text-2xl"
                                        >smartphone</span
                                    >
                                    <div class="flex flex-col">
                                        <span class="text-xs font-bold"
                                            >Mở ứng dụng</span
                                        >
                                        <span class="text-[10px] text-[#8d7a5e]"
                                            >Mở App ngân hàng/Ví</span
                                        >
                                    </div>
                                </div>
                                <div
                                    class="flex items-center gap-3 p-3 rounded-lg border border-[#e7e2da]"
                                >
                                    <span
                                        class="material-symbols-outlined text-primary text-2xl"
                                        >photo_camera</span
                                    >
                                    <div class="flex flex-col">
                                        <span class="text-xs font-bold"
                                            >Quét mã QR</span
                                        >
                                        <span class="text-[10px] text-[#8d7a5e]"
                                            >Hướng camera vào mã</span
                                        >
                                    </div>
                                </div>
                                <div
                                    class="flex items-center gap-3 p-3 rounded-lg border border-[#e7e2da]"
                                >
                                    <span
                                        class="material-symbols-outlined text-primary text-2xl"
                                        >check_circle</span
                                    >
                                    <div class="flex flex-col">
                                        <span class="text-xs font-bold"
                                            >Xác nhận</span
                                        >
                                        <span class="text-[10px] text-[#8d7a5e]"
                                            >Thanh toán & hoàn tất</span
                                        >
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="flex items-center justify-between px-2">
                            <button
                                @click="handleGoBack"
                                class="text-[#8d7a5e] text-sm font-bold flex items-center gap-2 hover:text-primary transition-colors"
                            >
                                <span
                                    class="material-symbols-outlined text-base"
                                    >arrow_back</span
                                >
                                Quay lại trang nhập thông tin
                            </button>
                            <button
                                class="text-primary text-sm font-bold hover:underline"
                            >
                                Chọn phương thức khác
                            </button>
                        </div>
                    </div>

                    <div class="lg:col-span-1">
                        <div
                            class="bg-white rounded-2xl shadow-sm border border-[#e7e2da] sticky top-24"
                        >
                            <div class="p-6 border-b border-[#e7e2da]">
                                <h3 class="text-xl font-bold text-[#181510]">
                                    Tóm tắt đặt phòng
                                </h3>
                            </div>

                            <div class="p-6 space-y-4">
                                <div
                                    class="flex items-start gap-4 pb-4 border-b border-[#e7e2da]"
                                >
                                    <div
                                        class="w-24 h-20 rounded-xl bg-cover bg-center shrink-0 shadow-sm"
                                        :style="{
                                            backgroundImage: `url('${room.image}')`,
                                        }"
                                    ></div>
                                    <div class="flex flex-col">
                                        <span
                                            class="text-sm font-bold text-[#181510] line-clamp-2"
                                            >{{ room.name }}</span
                                        >
                                        <span
                                            class="text-xs text-[#8d7a5e] mt-1"
                                            >{{ room.hotel }}</span
                                        >
                                        <div
                                            class="flex items-center gap-1 mt-1.5 text-primary"
                                        >
                                            <span
                                                class="material-icons-outlined text-sm"
                                                >star</span
                                            >
                                            <span class="text-xs font-bold">{{
                                                room.rating
                                            }}</span>
                                        </div>
                                    </div>
                                </div>

                                <div class="space-y-3 pt-2">
                                    <div
                                        class="flex justify-between items-center text-sm"
                                    >
                                        <span
                                            class="text-[#8d7a5e] font-medium flex items-center gap-2"
                                        >
                                            <span
                                                class="material-symbols-outlined text-base"
                                                >calendar_month</span
                                            >
                                            Ngày
                                        </span>
                                        <span class="font-bold text-[#181510]"
                                            >{{ room.checkIn }} -
                                            {{ room.checkOut }}</span
                                        >
                                    </div>
                                    <div
                                        class="flex justify-between items-center text-sm"
                                    >
                                        <span
                                            class="text-[#8d7a5e] font-medium flex items-center gap-2"
                                        >
                                            <span
                                                class="material-symbols-outlined text-base"
                                                >nights_stay</span
                                            >
                                            Thời gian
                                        </span>
                                        <span class="font-bold text-[#181510]"
                                            >{{ room.nights }} Đêm</span
                                        >
                                    </div>
                                    <div
                                        class="flex justify-between items-center text-sm"
                                    >
                                        <span
                                            class="text-[#8d7a5e] font-medium flex items-center gap-2"
                                        >
                                            <span
                                                class="material-symbols-outlined text-base"
                                                >person</span
                                            >
                                            Số khách
                                        </span>
                                        <span
                                            class="font-bold text-[#181510]"
                                            >{{ room.guests }}</span
                                        >
                                    </div>
                                </div>

                                <div
                                    class="pt-4 border-t border-[#e7e2da] space-y-2"
                                >
                                    <div class="flex justify-between text-sm">
                                        <span class="text-[#8d7a5e] font-medium"
                                            >${{
                                                room.pricePerNight.toFixed(2)
                                            }}
                                            x {{ room.nights }} đêm</span
                                        >
                                        <span class="font-bold text-[#181510]"
                                            >${{
                                                (
                                                    room.pricePerNight *
                                                    room.nights
                                                ).toFixed(2)
                                            }}</span
                                        >
                                    </div>
                                    <div class="flex justify-between text-sm">
                                        <span class="text-[#8d7a5e] font-medium"
                                            >Phí dịch vụ</span
                                        >
                                        <span class="font-bold text-[#181510]"
                                            >${{
                                                room.serviceFee.toFixed(2)
                                            }}</span
                                        >
                                    </div>
                                    <div class="flex justify-between text-sm">
                                        <span class="text-[#8d7a5e] font-medium"
                                            >Thuế và phí</span
                                        >
                                        <span class="font-bold text-[#181510]"
                                            >${{ room.tax.toFixed(2) }}</span
                                        >
                                    </div>
                                    <div
                                        class="flex justify-between items-center pt-4 border-t border-[#e7e2da] mt-2"
                                    >
                                        <span
                                            class="text-lg font-bold text-[#181510]"
                                            >Tổng cộng (USD)</span
                                        >
                                        <span
                                            class="text-2xl font-black text-primary"
                                        >
                                            ${{
                                                (
                                                    room.pricePerNight *
                                                        room.nights +
                                                    room.serviceFee +
                                                    room.tax
                                                ).toFixed(2)
                                            }}
                                        </span>
                                    </div>
                                </div>

                                <div class="pt-6">
                                    <div
                                        class="flex items-center gap-2 text-[10px] text-[#8d7a5e] justify-center uppercase tracking-widest font-bold"
                                    >
                                        <span
                                            class="material-symbols-outlined text-sm"
                                            >shield</span
                                        >
                                        Mã hóa & Bảo mật 100%
                                    </div>
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
/* Không cần CSS thêm */
</style>
