<script setup lang="ts">
import { ref, computed } from 'vue'

// Trạng thái bộ lọc hiện tại
const currentFilter = ref('all') // 'all', 'upcoming', 'completed', 'cancelled'


const bookings = ref([
    {
        id: 'DH-10293',
        roomName: 'Phòng Junior Suite Cao Cấp',
        image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=400&auto=format&fit=crop',
        checkIn: '12 Th10, 2026',
        checkOut: '15 Th10, 2026',
        guests: '2 Người lớn, 1 Trẻ em',
        totalPrice: 300,
        status: 'upcoming', // sắp tới
        bookingDate: '01 Th10, 2026',
    },
    {
        id: 'DH-09821',
        roomName: 'Phòng Super Deluxe',
        image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=400&auto=format&fit=crop',
        checkIn: '05 Th09, 2026',
        checkOut: '07 Th09, 2026',
        guests: '4 Người lớn',
        totalPrice: 400,
        status: 'completed', // đã hoàn thành
        bookingDate: '20 Th08, 2026',
    },
    {
        id: 'DH-08744',
        roomName: 'Phòng Executive Suite',
        image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=400&auto=format&fit=crop',
        checkIn: '10 Th08, 2026',
        checkOut: '12 Th08, 2026',
        guests: '2 Người lớn',
        totalPrice: 300,
        status: 'cancelled', // đã hủy
        bookingDate: '05 Th08, 2026',
    },
])

// Lọc đơn hàng dựa trên Tab đang chọn
const filteredBookings = computed(() => {
    if (currentFilter.value === 'all') return bookings.value
    return bookings.value.filter((b) => b.status === currentFilter.value)
})

// Hàm lấy màu sắc và Text cho Badge Trạng thái
const getStatusBadge = (status: string) => {
    switch (status) {
        case 'upcoming':
            return {
                class: 'bg-blue-50 text-blue-600 border-blue-200',
                text: 'Sắp tới',
                icon: 'schedule',
            }
        case 'completed':
            return {
                class: 'bg-green-50 text-green-600 border-green-200',
                text: 'Đã hoàn thành',
                icon: 'check_circle',
            }
        case 'cancelled':
            return {
                class: 'bg-red-50 text-red-600 border-red-200',
                text: 'Đã hủy',
                icon: 'cancel',
            }
        default:
            return {
                class: 'bg-gray-50 text-gray-600 border-gray-200',
                text: 'Không xác định',
                icon: 'help',
            }
    }
}
</script>

<template>
    <div class="bg-[#f9fafb] min-h-screen py-10">
        <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="mb-8">
                <h1
                    class="text-3xl font-extrabold text-gray-900 tracking-tight"
                >
                    Đơn đặt phòng của tôi
                </h1>
                <p class="text-gray-500 mt-2">
                    Quản lý và theo dõi lịch sử các chuyến đi của bạn.
                </p>
            </div>

            <div class="flex overflow-x-auto gap-2 mb-8 pb-2 scrollbar-hide">
                <button
                    @click="currentFilter = 'all'"
                    :class="
                        currentFilter === 'all'
                            ? 'bg-gray-900 text-white shadow-md'
                            : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                    "
                    class="px-5 py-2.5 rounded-xl font-bold text-sm whitespace-nowrap transition-all"
                >
                    Tất cả đơn
                </button>
                <button
                    @click="currentFilter = 'upcoming'"
                    :class="
                        currentFilter === 'upcoming'
                            ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                            : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                    "
                    class="px-5 py-2.5 rounded-xl font-bold text-sm whitespace-nowrap transition-all"
                >
                    Sắp tới
                </button>
                <button
                    @click="currentFilter = 'completed'"
                    :class="
                        currentFilter === 'completed'
                            ? 'bg-green-600 text-white shadow-md shadow-green-600/20'
                            : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                    "
                    class="px-5 py-2.5 rounded-xl font-bold text-sm whitespace-nowrap transition-all"
                >
                    Đã hoàn thành
                </button>
                <button
                    @click="currentFilter = 'cancelled'"
                    :class="
                        currentFilter === 'cancelled'
                            ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
                            : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                    "
                    class="px-5 py-2.5 rounded-xl font-bold text-sm whitespace-nowrap transition-all"
                >
                    Đã hủy
                </button>
            </div>

            <div
                v-if="filteredBookings.length === 0"
                class="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm"
            >
                <div
                    class="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                    <span class="material-icons-outlined text-4xl text-gray-400"
                        >event_busy</span
                    >
                </div>
                <h3 class="text-lg font-bold text-gray-900 mb-2">
                    Chưa có đơn đặt phòng nào
                </h3>
                <p class="text-gray-500 mb-6 text-sm">
                    Bạn chưa có chuyến đi nào trong danh mục này.
                </p>
                <router-link
                    :to="{ name: 'room' }"
                    class="inline-flex items-center justify-center px-6 py-3 bg-primary text-white font-bold rounded-xl shadow-md hover:bg-orange-600 transition-colors"
                >
                    Khám phá phòng ngay
                </router-link>
            </div>

            <div v-else class="flex flex-col gap-6">
                <div
                    v-for="booking in filteredBookings"
                    :key="booking.id"
                    class="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row gap-6"
                >
                    <div
                        class="w-full md:w-48 h-32 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100"
                    >
                        <img
                            :src="booking.image"
                            :alt="booking.roomName"
                            class="w-full h-full object-cover"
                        />
                    </div>

                    <div class="flex-1 flex flex-col justify-between">
                        <div>
                            <div class="flex justify-between items-start mb-2">
                                <div>
                                    <div class="flex items-center gap-2 mb-1">
                                        <span
                                            class="text-xs font-bold text-gray-500 tracking-wider"
                                            >MÃ ĐƠN: {{ booking.id }}</span
                                        >
                                        <span class="text-gray-300">•</span>
                                        <span class="text-xs text-gray-500"
                                            >Đặt ngày
                                            {{ booking.bookingDate }}</span
                                        >
                                    </div>
                                    <h3 class="text-lg font-bold text-gray-900">
                                        {{ booking.roomName }}
                                    </h3>
                                </div>

                                <div
                                    :class="
                                        getStatusBadge(booking.status).class
                                    "
                                    class="flex items-center gap-1 px-3 py-1 rounded-full border text-xs font-bold"
                                >
                                    <span
                                        class="material-icons-outlined text-[14px]"
                                        >{{
                                            getStatusBadge(booking.status).icon
                                        }}</span
                                    >
                                    {{ getStatusBadge(booking.status).text }}
                                </div>
                            </div>

                            <div class="grid grid-cols-2 gap-y-2 mt-4 text-sm">
                                <div
                                    class="flex items-center gap-2 text-gray-600"
                                >
                                    <span
                                        class="material-icons-outlined text-gray-400 text-lg"
                                        >calendar_today</span
                                    >
                                    <span
                                        >{{ booking.checkIn }}
                                        <span class="mx-1">→</span>
                                        {{ booking.checkOut }}</span
                                    >
                                </div>
                                <div
                                    class="flex items-center gap-2 text-gray-600"
                                >
                                    <span
                                        class="material-icons-outlined text-gray-400 text-lg"
                                        >group</span
                                    >
                                    <span>{{ booking.guests }}</span>
                                </div>
                            </div>
                        </div>

                        <div
                            class="flex items-center justify-between mt-6 pt-4 border-t border-gray-50"
                        >
                            <div class="flex items-baseline gap-1.5">
                                <span class="text-sm text-gray-500 font-medium"
                                    >Tổng tiền:</span
                                >
                                <span
                                    class="text-xl font-extrabold text-gray-900"
                                    >${{ booking.totalPrice }}</span
                                >
                            </div>

                            <div class="flex gap-3">
                                <button
                                    v-if="booking.status === 'upcoming'"
                                    class="px-4 py-2 text-sm font-bold text-red-500 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                                >
                                    Hủy phòng
                                </button>

                                <button
                                    v-if="booking.status === 'completed'"
                                    class="px-4 py-2 text-sm font-bold text-primary bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors"
                                >
                                    Đánh giá
                                </button>

                                <button
                                    class="px-4 py-2 text-sm font-bold text-white bg-gray-900 hover:bg-gray-800 rounded-lg transition-colors shadow-sm"
                                >
                                    Xem chi tiết
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
    display: none;
}
.scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
</style>
