<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import httpClient from '@/api/axiosClient'

interface Booking {
    booking_id: number
    user_id: number
    room_id: number
    check_in_date: string
    check_out_date: string
    total_amount: number
    deposit_amount: number
    is_deposit_paid: boolean
    status: string
    created_at: string
    user?: { full_name: string; email: string; phone_number: string }
    room?: { room_number: string }
}

const bookings = ref<Booking[]>([])
const isLoading = ref(false)
const searchQuery = ref('')
const filterStatus = ref('ALL')

let ws: WebSocket | null = null

const fetchBookings = async () => {
    isLoading.value = true
    try {
        const response: any = await httpClient.get('/api/bookings/all')
        bookings.value = response.data || response
    } catch (error) {
        console.error('Lỗi khi tải danh sách đơn đặt phòng:', error)
    } finally {
        isLoading.value = false
    }
}

onMounted(() => {
    fetchBookings()

    // 🌟 KẾT NỐI WEBSOCKET LẮNG NGHE WEBHOOK TỪ BACKEND
    const wsUrl = import.meta.env.VITE_API_BASE_URL
        ? import.meta.env.VITE_API_BASE_URL.replace('http', 'ws') +
          '/api/bookings/ws/admin'
        : 'ws://localhost:8000/api/bookings/ws/admin'

    ws = new WebSocket(wsUrl)

    ws.onmessage = (event) => {
        // Hiện thông báo Popup
        alert('🔔 THÔNG BÁO TỰ ĐỘNG CHỐT ĐƠN:\n' + event.data)
        // Tự động load lại danh sách đơn hàng để cập nhật trạng thái
        fetchBookings()
    }
})

onUnmounted(() => {
    if (ws) ws.close()
})

const stats = computed(() => {
    const total = bookings.value.length
    const pending = bookings.value.filter((b) => b.status === 'PENDING').length
    const confirmed = bookings.value.filter(
        (b) => b.status === 'CONFIRMED',
    ).length
    const cancelled = bookings.value.filter(
        (b) => b.status === 'CANCELLED',
    ).length
    return { total, pending, confirmed, cancelled }
})

const filteredBookings = computed(() => {
    let result = bookings.value
    if (filterStatus.value !== 'ALL') {
        result = result.filter((b) => b.status === filterStatus.value)
    }
    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        result = result.filter(
            (b) =>
                b.booking_id.toString().includes(query) ||
                b.user_id.toString().includes(query) ||
                b.room_id.toString().includes(query),
        )
    }
    return result
})

const handleConfirmDeposit = async (bookingId: number) => {
    if (
        !confirm(`Xác nhận khách hàng đã thanh toán cọc cho Đơn #${bookingId}?`)
    )
        return
    try {
        await httpClient.put(`/api/bookings/${bookingId}/confirm-deposit`)
        alert(
            'Đã xác nhận thanh toán cọc thành công! Trạng thái đơn đã chuyển sang CONFIRMED.',
        )
        fetchBookings()
    } catch (error: any) {
        alert(error?.response?.data?.detail || 'Lỗi khi xác nhận cọc!')
    }
}

const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(amount || 0)
const formatDate = (dateString: string) =>
    dateString
        ? new Intl.DateTimeFormat('vi-VN', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
          }).format(new Date(dateString))
        : ''
const formatShortDate = (dateString: string) =>
    dateString
        ? new Intl.DateTimeFormat('vi-VN', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
          }).format(new Date(dateString))
        : ''
</script>

<template>
    <div class="flex flex-col h-full gap-6">
        <header
            class="flex items-center justify-between whitespace-nowrap border-b border-gray-200 bg-white/80 backdrop-blur-md px-8 py-4 rounded-2xl shadow-sm"
        >
            <div class="flex items-center gap-8">
                <div class="flex items-center gap-4 text-gray-900">
                    <div class="size-6 text-primary">
                        <span class="material-symbols-outlined text-[28px]"
                            >receipt_long</span
                        >
                    </div>
                </div>
                <div class="relative w-80">
                    <span
                        class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl"
                        >search</span
                    >
                    <input
                        v-model="searchQuery"
                        class="w-full h-10 bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                        placeholder="Tìm theo Mã đơn, Mã phòng..."
                    />
                </div>
            </div>
            <div class="flex items-center gap-3">
                <button
                    @click="fetchBookings"
                    class="flex items-center justify-center rounded-lg h-10 w-10 bg-gray-50 border border-gray-200 text-gray-600 hover:text-primary transition-colors"
                >
                    <span
                        class="material-symbols-outlined"
                        :class="{ 'animate-spin': isLoading }"
                        >refresh</span
                    >
                </button>
            </div>
        </header>

        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div
                class="flex flex-col gap-2 rounded-2xl p-6 bg-white border border-gray-200 shadow-sm"
            >
                <p
                    class="text-gray-500 text-xs font-bold uppercase tracking-wider"
                >
                    Tổng Đơn Đặt
                </p>
                <p class="text-gray-900 text-3xl font-extrabold">
                    {{ stats.total }}
                </p>
            </div>
            <div
                class="flex flex-col gap-2 rounded-2xl p-6 bg-white border border-gray-200 shadow-sm"
            >
                <p
                    class="text-gray-500 text-xs font-bold uppercase tracking-wider"
                >
                    Đang chờ cọc (Pending)
                </p>
                <p class="text-amber-500 text-3xl font-extrabold">
                    {{ stats.pending }}
                </p>
            </div>
            <div
                class="flex flex-col gap-2 rounded-2xl p-6 bg-white border border-gray-200 shadow-sm"
            >
                <p
                    class="text-gray-500 text-xs font-bold uppercase tracking-wider"
                >
                    Đã chốt (Confirmed)
                </p>
                <p class="text-green-500 text-3xl font-extrabold">
                    {{ stats.confirmed }}
                </p>
            </div>
            <div
                class="flex flex-col gap-2 rounded-2xl p-6 bg-white border border-gray-200 shadow-sm"
            >
                <p
                    class="text-gray-500 text-xs font-bold uppercase tracking-wider"
                >
                    Đã hủy
                </p>
                <p class="text-red-500 text-3xl font-extrabold">
                    {{ stats.cancelled }}
                </p>
            </div>
        </div>

        <div
            class="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden flex-1 flex flex-col"
        >
            <div
                class="p-5 border-b border-gray-200 flex justify-between items-center bg-gray-50/50"
            >
                <div class="flex items-center gap-3">
                    <span class="text-sm font-bold text-gray-800">Bộ lọc:</span>
                    <div class="flex gap-2">
                        <button
                            @click="filterStatus = 'ALL'"
                            :class="
                                filterStatus === 'ALL'
                                    ? 'bg-primary text-white shadow-md'
                                    : 'bg-white border border-gray-200 text-gray-600'
                            "
                            class="px-3 py-1.5 text-xs font-bold rounded-lg transition-all"
                        >
                            Tất cả
                        </button>
                        <button
                            @click="filterStatus = 'PENDING'"
                            :class="
                                filterStatus === 'PENDING'
                                    ? 'bg-amber-500 text-white shadow-md'
                                    : 'bg-white border border-gray-200 text-gray-600'
                            "
                            class="px-3 py-1.5 text-xs font-bold rounded-lg transition-all"
                        >
                            Chờ Cọc
                        </button>
                        <button
                            @click="filterStatus = 'CONFIRMED'"
                            :class="
                                filterStatus === 'CONFIRMED'
                                    ? 'bg-green-500 text-white shadow-md'
                                    : 'bg-white border border-gray-200 text-gray-600'
                            "
                            class="px-3 py-1.5 text-xs font-bold rounded-lg transition-all"
                        >
                            Đã Xác Nhận
                        </button>
                    </div>
                </div>
            </div>

            <div class="overflow-x-auto flex-1">
                <table class="w-full text-left border-collapse">
                    <thead>
                        <tr
                            class="bg-gray-50 text-gray-500 text-xs uppercase font-extrabold tracking-wider border-b border-gray-200"
                        >
                            <th class="px-6 py-4">Mã Đơn / Ngày Đặt</th>
                            <th class="px-6 py-4">Khách & Phòng</th>
                            <th class="px-6 py-4">Lịch Trình</th>
                            <th class="px-6 py-4">Tài Chính</th>
                            <th class="px-6 py-4 text-center">Trạng Thái</th>
                            <th class="px-6 py-4 text-center">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-100">
                        <tr v-if="isLoading">
                            <td
                                colspan="6"
                                class="px-6 py-10 text-center text-gray-500"
                            >
                                Đang tải dữ liệu...
                            </td>
                        </tr>
                        <tr v-else-if="filteredBookings.length === 0">
                            <td
                                colspan="6"
                                class="px-6 py-10 text-center text-gray-500"
                            >
                                Không tìm thấy đơn.
                            </td>
                        </tr>

                        <tr
                            v-else
                            v-for="booking in filteredBookings"
                            :key="booking.booking_id"
                            class="hover:bg-gray-50/80 transition-colors"
                        >
                            <td class="px-6 py-4">
                                <p class="text-sm font-extrabold text-primary">
                                    #MAC-{{ booking.booking_id }}
                                </p>
                                <p
                                    class="text-xs text-gray-500 mt-1 font-medium"
                                >
                                    {{ formatDate(booking.created_at) }}
                                </p>
                            </td>
                            <td class="px-6 py-4">
                                <p class="text-sm font-bold text-gray-900">
                                    {{
                                        booking.user?.full_name ||
                                        `Khách hàng ID: ${booking.user_id}`
                                    }}
                                </p>
                                <p
                                    class="text-xs text-gray-600 mt-1 font-semibold"
                                >
                                    Phòng:
                                    {{
                                        booking.room?.room_number ||
                                        `ID: ${booking.room_id}`
                                    }}
                                </p>
                            </td>
                            <td class="px-6 py-4">
                                <div
                                    class="flex flex-col gap-1 text-sm font-medium"
                                >
                                    <p class="text-green-600">
                                        In:
                                        {{
                                            formatShortDate(
                                                booking.check_in_date,
                                            )
                                        }}
                                    </p>
                                    <p class="text-red-500">
                                        Out:
                                        {{
                                            formatShortDate(
                                                booking.check_out_date,
                                            )
                                        }}
                                    </p>
                                </div>
                            </td>
                            <td class="px-6 py-4">
                                <p class="text-sm font-bold text-gray-900">
                                    Tổng:
                                    {{ formatCurrency(booking.total_amount) }}
                                </p>
                                <p
                                    class="text-xs mt-1 font-semibold"
                                    :class="
                                        booking.is_deposit_paid
                                            ? 'text-green-600'
                                            : 'text-amber-500'
                                    "
                                >
                                    Cọc:
                                    {{ formatCurrency(booking.deposit_amount) }}
                                </p>
                            </td>
                            <td class="px-6 py-4 text-center">
                                <span
                                    v-if="booking.status === 'PENDING'"
                                    class="px-2.5 py-1 rounded-md bg-amber-50 text-amber-600 text-[11px] font-extrabold"
                                    >CHỜ CỌC</span
                                >
                                <span
                                    v-else-if="booking.status === 'CONFIRMED'"
                                    class="px-2.5 py-1 rounded-md bg-green-50 text-green-600 text-[11px] font-extrabold"
                                    >ĐÃ CHỐT</span
                                >
                                <span
                                    v-else
                                    class="px-2.5 py-1 rounded-md bg-gray-100 text-gray-600 text-[11px] font-extrabold"
                                    >{{ booking.status }}</span
                                >
                            </td>
                            <td class="px-6 py-4">
                                <button
                                    v-if="booking.status === 'PENDING'"
                                    @click="
                                        handleConfirmDeposit(booking.booking_id)
                                    "
                                    class="px-3 py-1.5 bg-green-500 text-white rounded-lg text-xs font-bold"
                                >
                                    Duyệt Cọc
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>
