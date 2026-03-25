<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import httpClient from '@/api/axiosClient'
import { useAuth } from '../auth/useAuth'
import { profileService } from '../profile/profileService'

const props = defineProps<{ id: string }>() // Đây là room_id
const router = useRouter()
const { currentUser: authUser } = useAuth()

// 🌟 Đưa hàm getFullUrl lên trên để các hàm bên dưới gọi không bị lỗi
const getFullUrl = (path: string) => {
    if (!path) return 'https://placehold.co/600x400'
    if (path.startsWith('http')) return path
    return `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}${path}`
}

const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(val || 0)
}

// Lấy ngày hôm nay và ngày mai làm mặc định
const today = new Date().toISOString().split('T')[0]
const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0]

// 1. DỮ LIỆU FORM (Dùng để gửi đi khi đặt phòng)
const form = reactive({
    fullName: '',
    email: '',
    phone: '',
    checkIn: today,
    checkOut: tomorrow,
    requests: '',
    terms: false,
})

// Dữ liệu User dùng chung
const currentUser = reactive({
    fullName: '',
    email: '',
    phone: '',
    dob: '',
    address: '',
    avatar: '',
    joinDate: '',
})

const isLoading = ref(true)
const isSubmitting = ref(false)
const room = ref<any>(null)

// Tự động tính số đêm
const nights = computed(() => {
    if (!form.checkIn || !form.checkOut) return 1
    const start = new Date(form.checkIn).getTime()
    const end = new Date(form.checkOut).getTime()
    const diff = Math.ceil((end - start) / (1000 * 3600 * 24))
    return diff > 0 ? diff : 1
})

// Tính tổng tiền dự kiến
const estimatedTotal = computed(() => {
    if (!room.value) return 0
    const price =
        room.value.price_per_night || room.value.room_type?.base_price || 0
    return price * nights.value
})

// 2. LẤY THÔNG TIN USER TỪ SERVICE (Cách mới chuẩn chỉnh)
const fetchProfile = async () => {
    if (authUser.value) {
        currentUser.fullName = authUser.value.full_name || ''
        currentUser.email = authUser.value.email || ''
    }

    try {
        const data: any = await profileService.getProfile()

        currentUser.fullName = data.full_name || currentUser.fullName
        currentUser.email = data.email || currentUser.email
        currentUser.phone = data.phone_number || ''
        currentUser.avatar = getFullUrl(data.avatar_url || '')

        if (data.created_at) {
            const date = new Date(data.created_at)
            currentUser.joinDate = `Tháng ${date.getMonth() + 1}, ${date.getFullYear()}`
        }

        // 🌟 Gán thẳng dữ liệu từ currentUser vào form
        form.fullName = currentUser.fullName
        form.email = currentUser.email
        form.phone = currentUser.phone
    } catch (error) {
        console.error('Lỗi tải profile:', error)
        // Backup: Lỡ API Profile có lỗi thì vẫn có tên và email từ authUser
        form.fullName = currentUser.fullName
        form.email = currentUser.email
    }
}

// 3. LẤY THÔNG TIN PHÒNG (Đã dọn dẹp sạch sẽ, chỉ còn lấy phòng)
const fetchRoom = async () => {
    try {
        const res: any = await httpClient.get(`/api/rooms/${props.id}`)
        room.value = res.data || res
    } catch (error) {
        alert('Phòng không tồn tại!')
        router.push({ name: 'room' })
    } finally {
        isLoading.value = false
    }
}

// Chạy song song cả 2 hàm khi load trang
onMounted(async () => {
    await Promise.all([fetchProfile(), fetchRoom()])
})

// 4. XỬ LÝ ĐẶT PHÒNG GỌI API
const handleCompleteBooking = async () => {
    if (!form.terms) {
        alert('Vui lòng đồng ý với Điều khoản dịch vụ!')
        return
    }

    if (new Date(form.checkIn!) >= new Date(form.checkOut!)) {
        alert('Ngày trả phòng phải sau ngày nhận phòng!')
        return
    }

    isSubmitting.value = true
    try {
        const payload = {
            room_id: Number(props.id),
            check_in_date: new Date(`${form.checkIn}T14:00:00`).toISOString(),
            check_out_date: new Date(`${form.checkOut}T12:00:00`).toISOString(),
        }

        const res: any = await httpClient.post('/api/bookings/', payload)
        const bookingData = res.data || res

        router.push({
            name: 'booking-complete',
            params: { id: bookingData.booking_id },
        })
    } catch (error: any) {
        console.error('Lỗi đặt phòng:', error)
        alert(error.response?.data?.detail || 'Có lỗi xảy ra khi đặt phòng!')
    } finally {
        isSubmitting.value = false
    }
}
</script>

<template>
    <div class="bg-[#f8f7f5] min-h-screen pb-20">
        <div
            v-if="isLoading"
            class="flex items-center justify-center w-full h-96"
        >
            <div class="flex flex-col items-center gap-3">
                <span
                    class="material-symbols-outlined animate-spin text-primary text-4xl"
                    >autorenew</span
                >
                <span class="text-gray-500 font-medium"
                    >Đang chuẩn bị đơn đặt phòng...</span
                >
            </div>
        </div>

        <div v-else class="flex flex-1 justify-center py-5">
            <div
                class="layout-content-container flex flex-col max-w-[1200px] w-full px-6 md:px-10"
            >
                <div class="flex flex-wrap justify-between gap-3 py-6">
                    <div class="flex flex-col gap-2">
                        <p
                            class="text-[#181510] text-3xl font-black leading-tight tracking-tight"
                        >
                            Xác nhận thông tin đặt phòng
                        </p>
                    </div>
                </div>

                <form
                    @submit.prevent="handleCompleteBooking"
                    class="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4"
                >
                    <div class="lg:col-span-2 flex flex-col gap-6">
                        <div
                            class="bg-white rounded-2xl p-8 shadow-sm border border-[#e7e2da]"
                        >
                            <h3 class="text-[#181510] text-xl font-bold mb-6">
                                Thông tin chuyến đi & Liên hệ
                            </h3>

                            <div
                                class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 pb-6 border-b border-gray-200"
                            >
                                <div class="flex flex-col gap-2">
                                    <label
                                        class="text-sm font-bold text-gray-900"
                                        >Nhận phòng (Check-in) *</label
                                    >
                                    <input
                                        v-model="form.checkIn"
                                        :min="today"
                                        class="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                        type="date"
                                        required
                                    />
                                </div>
                                <div class="flex flex-col gap-2">
                                    <label
                                        class="text-sm font-bold text-gray-900"
                                        >Trả phòng (Check-out) *</label
                                    >
                                    <input
                                        v-model="form.checkOut"
                                        :min="form.checkIn"
                                        class="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                        type="date"
                                        required
                                    />
                                </div>
                            </div>

                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div class="flex flex-col gap-2">
                                    <label
                                        class="text-sm font-bold text-gray-900"
                                        >Họ và tên *</label
                                    >
                                    <input
                                        v-model="form.fullName"
                                        class="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                        type="text"
                                        required
                                    />
                                </div>

                                <div class="flex flex-col gap-2">
                                    <label
                                        class="text-sm font-bold text-gray-900"
                                        >Số điện thoại *</label
                                    >
                                    <input
                                        v-model="form.phone"
                                        class="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                        type="tel"
                                        required
                                    />
                                </div>

                                <div class="md:col-span-2 flex flex-col gap-2">
                                    <label
                                        class="text-sm font-bold text-gray-900"
                                        >Địa chỉ Email *</label
                                    >
                                    <input
                                        v-model="form.email"
                                        class="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                        type="email"
                                        required
                                    />
                                </div>

                                <div class="md:col-span-2 flex flex-col gap-2">
                                    <label
                                        class="text-sm font-bold text-gray-900"
                                        >Yêu cầu đặc biệt</label
                                    >
                                    <textarea
                                        v-model="form.requests"
                                        class="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                                        rows="3"
                                        placeholder="Thêm khăn tắm, phòng yên tĩnh..."
                                    ></textarea>
                                </div>

                                <div
                                    class="md:col-span-2 flex items-start gap-3 pt-2"
                                >
                                    <input
                                        v-model="form.terms"
                                        class="mt-1 rounded border-gray-300 text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                                        id="terms"
                                        type="checkbox"
                                    />
                                    <label
                                        class="text-sm text-gray-500 cursor-pointer leading-relaxed"
                                        for="terms"
                                    >
                                        Tôi cam kết thông tin cá nhân là chính
                                        xác và đồng ý với các chính sách hủy
                                        phòng của khách sạn.
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="lg:col-span-1">
                        <div
                            class="bg-white rounded-2xl shadow-sm border border-[#e7e2da] sticky top-24"
                        >
                            <div class="p-6 border-b border-[#e7e2da]">
                                <h3 class="text-xl font-bold text-[#181510]">
                                    Chi tiết đặt phòng
                                </h3>
                            </div>

                            <div class="p-6 space-y-4">
                                <div
                                    class="flex items-start gap-4 pb-4 border-b border-[#e7e2da]"
                                >
                                    <img
                                        :src="
                                            getFullUrl(
                                                room.images?.[0]?.image_url ||
                                                    room.image_url,
                                            )
                                        "
                                        class="w-24 h-20 rounded-xl object-cover shadow-sm"
                                    />
                                    <div class="flex flex-col">
                                        <span
                                            class="text-sm font-bold text-[#181510]"
                                            >Phòng {{ room.room_number }}</span
                                        >
                                        <span
                                            class="text-xs text-[#8d7a5e] mt-1"
                                            >{{
                                                room.room_type?.type_name
                                            }}</span
                                        >
                                    </div>
                                </div>

                                <div class="pt-2 space-y-2">
                                    <div class="flex justify-between text-sm">
                                        <span class="text-[#8d7a5e]"
                                            >Giá mỗi đêm</span
                                        >
                                        <span
                                            class="font-bold text-[#181510]"
                                            >{{
                                                formatCurrency(
                                                    room.price_per_night ||
                                                        room.room_type
                                                            ?.base_price ||
                                                        0,
                                                )
                                            }}</span
                                        >
                                    </div>
                                    <div class="flex justify-between text-sm">
                                        <span class="text-[#8d7a5e]"
                                            >Thời gian lưu trú</span
                                        >
                                        <span class="font-bold text-[#181510]"
                                            >{{ nights }} Đêm</span
                                        >
                                    </div>
                                    <div
                                        class="flex justify-between items-center pt-4 border-t border-[#e7e2da] mt-2"
                                    >
                                        <span
                                            class="text-base font-bold text-[#181510]"
                                            >Tạm tính</span
                                        >
                                        <span
                                            class="text-xl font-black text-primary"
                                            >{{
                                                formatCurrency(estimatedTotal)
                                            }}</span
                                        >
                                    </div>
                                    <p
                                        class="text-[11px] text-[#8d7a5e] text-right italic"
                                    >
                                        *Bạn sẽ thanh toán cọc 30% ở bước tiếp
                                        theo.
                                    </p>
                                </div>

                                <button
                                    type="submit"
                                    :disabled="isSubmitting"
                                    class="w-full bg-primary hover:bg-orange-600 text-white font-bold py-4 rounded-xl mt-6 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20 disabled:opacity-70"
                                >
                                    <span
                                        v-if="isSubmitting"
                                        class="material-symbols-outlined animate-spin"
                                        >autorenew</span
                                    >
                                    {{
                                        isSubmitting
                                            ? 'Đang xử lý...'
                                            : 'Xác nhận & Đi tới Thanh toán'
                                    }}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>
