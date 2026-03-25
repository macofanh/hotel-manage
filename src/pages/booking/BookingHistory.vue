<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import httpClient from '@/api/axiosClient'

const router = useRouter()
const currentFilter = ref('all') // all, upcoming, completed, cancelled
const bookings = ref<any[]>([])
const isLoading = ref(true)

const fetchMyBookings = async () => {
    try {
        const res: any = await httpClient.get('/api/bookings/my-bookings')
        bookings.value = res.data || res
    } catch (error) {
        console.error('Lỗi lấy lịch sử:', error)
    } finally {
        isLoading.value = false
    }
}

onMounted(() => fetchMyBookings())

// Map DB status sang FE Tab status
const getTabStatus = (dbStatus: string) => {
    if (['PENDING', 'CONFIRMED'].includes(dbStatus)) return 'upcoming'
    if (['CHECKED_IN', 'CHECKED_OUT'].includes(dbStatus)) return 'completed'
    return 'cancelled'
}

const filteredBookings = computed(() => {
    if (currentFilter.value === 'all') return bookings.value
    return bookings.value.filter(
        (b) => getTabStatus(b.status) === currentFilter.value,
    )
})

// UI Badge
const getStatusBadge = (status: string) => {
    switch (status) {
        case 'PENDING':
            return {
                class: 'bg-amber-50 text-amber-600 border-amber-200',
                text: 'Chờ thanh toán cọc',
                icon: 'pending_actions',
            }
        case 'CONFIRMED':
            return {
                class: 'bg-blue-50 text-blue-600 border-blue-200',
                text: 'Đã xác nhận cọc',
                icon: 'schedule',
            }
        case 'CHECKED_IN':
            return {
                class: 'bg-indigo-50 text-indigo-600 border-indigo-200',
                text: 'Đang lưu trú',
                icon: 'vpn_key',
            }
        case 'CHECKED_OUT':
            return {
                class: 'bg-green-50 text-green-600 border-green-200',
                text: 'Đã hoàn thành',
                icon: 'check_circle',
            }
        case 'CANCELLED':
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
    <div class="bg-[#f9fafb] min-h-screen py-10">
        <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="mb-8">
                <h1
                    class="text-3xl font-extrabold text-gray-900 tracking-tight"
                >
                    Đơn đặt phòng của tôi
                </h1>
            </div>

            <div class="flex overflow-x-auto gap-2 mb-8 pb-2">
                <button
                    @click="currentFilter = 'all'"
                    :class="
                        currentFilter === 'all'
                            ? 'bg-gray-900 text-white'
                            : 'bg-white text-gray-600 border border-gray-200'
                    "
                    class="px-5 py-2.5 rounded-xl font-bold text-sm"
                >
                    Tất cả
                </button>
                <button
                    @click="currentFilter = 'upcoming'"
                    :class="
                        currentFilter === 'upcoming'
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-gray-600 border border-gray-200'
                    "
                    class="px-5 py-2.5 rounded-xl font-bold text-sm"
                >
                    Sắp tới
                </button>
                <button
                    @click="currentFilter = 'completed'"
                    :class="
                        currentFilter === 'completed'
                            ? 'bg-green-600 text-white'
                            : 'bg-white text-gray-600 border border-gray-200'
                    "
                    class="px-5 py-2.5 rounded-xl font-bold text-sm"
                >
                    Đã ở
                </button>
                <button
                    @click="currentFilter = 'cancelled'"
                    :class="
                        currentFilter === 'cancelled'
                            ? 'bg-red-600 text-white'
                            : 'bg-white text-gray-600 border border-gray-200'
                    "
                    class="px-5 py-2.5 rounded-xl font-bold text-sm"
                >
                    Đã hủy
                </button>
            </div>

            <div v-if="isLoading" class="flex justify-center py-10">
                <span
                    class="material-symbols-outlined animate-spin text-primary text-4xl"
                    >autorenew</span
                >
            </div>

            <div
                v-else-if="filteredBookings.length === 0"
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
                <router-link
                    :to="{ name: 'room' }"
                    class="mt-4 inline-flex items-center justify-center px-6 py-3 bg-primary text-white font-bold rounded-xl shadow-md"
                >
                    Khám phá phòng ngay
                </router-link>
            </div>

            <div v-else class="flex flex-col gap-6">
                <div
                    v-for="booking in filteredBookings"
                    :key="booking.booking_id"
                    class="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col gap-4"
                >
                    <div
                        class="flex justify-between items-start border-b border-gray-50 pb-4"
                    >
                        <div>
                            <div class="flex items-center gap-2 mb-1">
                                <span
                                    class="text-xs font-bold text-primary tracking-wider"
                                    >MÃ ĐƠN: #MAC-{{ booking.booking_id }}</span
                                >
                                <span class="text-gray-300">•</span>
                                <span class="text-xs text-gray-500"
                                    >Đặt ngày
                                    {{ formatDate(booking.created_at) }}</span
                                >
                            </div>
                            <h3 class="text-xl font-bold text-gray-900">
                                Phòng {{ booking.room?.room_number }}
                            </h3>
                        </div>
                        <div
                            :class="getStatusBadge(booking.status).class"
                            class="flex items-center gap-1 px-3 py-1.5 rounded-full border text-xs font-bold"
                        >
                            <span class="material-icons-outlined text-[14px]">{{
                                getStatusBadge(booking.status).icon
                            }}</span>
                            {{ getStatusBadge(booking.status).text }}
                        </div>
                    </div>

                    <div
                        class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                    >
                        <div class="flex items-center gap-6 text-sm">
                            <div class="flex items-center gap-2 text-gray-600">
                                <span
                                    class="material-icons-outlined text-gray-400"
                                    >login</span
                                >
                                <span class="font-bold text-gray-900">{{
                                    formatDate(booking.check_in_date)
                                }}</span>
                            </div>
                            <div
                                class="w-4 border-t-2 border-dashed border-gray-200"
                            ></div>
                            <div class="flex items-center gap-2 text-gray-600">
                                <span
                                    class="material-icons-outlined text-gray-400"
                                    >logout</span
                                >
                                <span class="font-bold text-gray-900">{{
                                    formatDate(booking.check_out_date)
                                }}</span>
                            </div>
                        </div>

                        <div class="text-right w-full md:w-auto">
                            <span class="text-sm text-gray-500 font-medium mr-2"
                                >Tổng tiền:</span
                            >
                            <span
                                class="text-xl font-extrabold text-gray-900"
                                >{{
                                    formatCurrency(booking.total_amount)
                                }}</span
                            >
                        </div>
                    </div>

                    <div
                        v-if="booking.status === 'PENDING'"
                        class="flex justify-end pt-2 border-t border-gray-50"
                    >
                        <router-link
                            :to="{
                                name: 'booking-complete',
                                params: { id: booking.booking_id },
                            }"
                            class="px-4 py-2 text-sm font-bold text-white bg-primary hover:bg-orange-600 rounded-lg shadow-sm"
                        >
                            Tiếp tục thanh toán cọc
                        </router-link>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
