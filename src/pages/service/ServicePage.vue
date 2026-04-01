<script setup lang="ts">
import { ref, onMounted } from 'vue'
import httpClient from '@/api/axiosClient'

interface Service {
    service_id: number
    service_name: string
    description: string
    price: number
    unit: string
}

const services = ref<Service[]>([])
const activeBooking = ref<any>(null)
const isLoading = ref(true)

// State cho Modal Đặt món
const isOrderModalOpen = ref(false)
const selectedService = ref<Service | null>(null)
const orderQuantity = ref(1)
const isOrdering = ref(false)

const fetchServicesAndBooking = async () => {
    isLoading.value = true
    try {
        // 1. Lấy menu dịch vụ
        const resMenu: any = await httpClient.get('/api/services/')
        services.value = resMenu.data || resMenu

        // 2. Tìm đơn đặt phòng đang "Active" của khách hàng này
        const resBooking: any = await httpClient.get(
            '/api/bookings/my-bookings',
        )
        const myBookings = resBooking.data || resBooking
        // Lấy phòng khách đang ở (CHECKED_IN) hoặc sắp tới (CONFIRMED)
        activeBooking.value = myBookings.find(
            (b: any) => b.status === 'CHECKED_IN' || b.status === 'CONFIRMED',
        )
    } catch (error) {
        console.error('Lỗi tải dữ liệu:', error)
    } finally {
        isLoading.value = false
    }
}

const openOrderModal = (service: Service) => {
    if (!activeBooking.value) {
        alert('Bạn phải có phòng đang thuê hoặc đã xác nhận để gọi dịch vụ!')
        return
    }
    selectedService.value = service
    orderQuantity.value = 1
    isOrderModalOpen.value = true
}

const submitOrder = async () => {
    if (!selectedService.value || !activeBooking.value) return
    isOrdering.value = true

    try {
        await httpClient.post('/api/services/orders', {
            booking_id: activeBooking.value.booking_id,
            service_id: selectedService.value.service_id,
            quantity: orderQuantity.value,
        })

        isOrderModalOpen.value = false
        alert(
            `Đã gọi thành công ${orderQuantity.value} ${selectedService.value.unit} ${selectedService.value.service_name}! Tiền sẽ được cộng vào hóa đơn phòng.`,
        )
    } catch (error) {
        alert('Lỗi khi gọi dịch vụ, vui lòng thử lại!')
    } finally {
        isOrdering.value = false
    }
}

onMounted(() => {
    fetchServicesAndBooking()
})

const formatCurrency = (val: number) =>
    new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(val || 0)
</script>

<template>
    <div class="bg-gray-50 min-h-screen pb-20 pt-10">
        <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="mb-8 text-center">
                <h1 class="text-3xl font-black text-gray-900 mb-2">
                    Dịch Vụ Khách Sạn
                </h1>
                <p class="text-gray-500">
                    Thư giãn và tận hưởng các tiện ích tuyệt vời của chúng tôi
                </p>

                <div
                    v-if="activeBooking"
                    class="mt-4 inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-bold border border-green-100"
                >
                    <span class="material-symbols-outlined text-base"
                        >verified</span
                    >
                    Đang phục vụ cho Phòng:
                    {{
                        activeBooking.room?.room_number ||
                        `Mã đơn #${activeBooking.booking_id}`
                    }}
                </div>
                <div
                    v-else-if="!isLoading"
                    class="mt-4 inline-flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-full text-sm font-bold border border-red-100"
                >
                    <span class="material-symbols-outlined text-base"
                        >error</span
                    >
                    Bạn chưa có phòng nào đang hoạt động để gọi dịch vụ.
                </div>
            </div>

            <div v-if="isLoading" class="flex justify-center py-20">
                <span
                    class="material-symbols-outlined animate-spin text-primary text-4xl"
                    >autorenew</span
                >
            </div>

            <div
                v-else
                class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
                <div
                    v-for="item in services"
                    :key="item.service_id"
                    class="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col hover:shadow-md transition-shadow"
                >
                    <div class="flex items-start justify-between mb-4">
                        <div
                            class="size-12 bg-orange-50 text-primary rounded-2xl flex items-center justify-center"
                        >
                            <span class="material-symbols-outlined text-2xl"
                                >room_service</span
                            >
                        </div>
                        <p class="text-xl font-black text-primary">
                            {{ formatCurrency(item.price) }}
                        </p>
                    </div>
                    <h3 class="text-lg font-bold text-gray-900 mb-1">
                        {{ item.service_name }}
                    </h3>
                    <p class="text-sm text-gray-500 mb-6 flex-1 line-clamp-2">
                        {{ item.description || 'Dịch vụ tiện ích cao cấp.' }}
                    </p>

                    <button
                        @click="openOrderModal(item)"
                        :disabled="!activeBooking"
                        class="w-full py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-primary transition-colors disabled:opacity-50 disabled:hover:bg-gray-900"
                    >
                        Đặt
                    </button>
                </div>
            </div>
        </div>

        <div
            v-if="isOrderModalOpen"
            class="fixed inset-0 z-50 flex items-center justify-center px-4"
        >
            <div
                @click="isOrderModalOpen = false"
                class="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
            ></div>
            <div
                class="bg-white rounded-3xl shadow-2xl max-w-sm w-full relative z-10 p-6"
            >
                <h3 class="text-xl font-black text-gray-900 text-center mb-1">
                    {{ selectedService?.service_name }}
                </h3>
                <p class="text-sm text-gray-500 text-center mb-6">
                    Giá: {{ formatCurrency(selectedService?.price || 0) }} /
                    {{ selectedService?.unit }}
                </p>

                <div class="flex items-center justify-center gap-6 mb-8">
                    <button
                        @click="orderQuantity > 1 && orderQuantity--"
                        class="size-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200"
                    >
                        <span class="material-symbols-outlined">remove</span>
                    </button>
                    <span class="text-3xl font-black text-gray-900">{{
                        orderQuantity
                    }}</span>
                    <button
                        @click="orderQuantity++"
                        class="size-10 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20"
                    >
                        <span class="material-symbols-outlined">add</span>
                    </button>
                </div>

                <div
                    class="bg-gray-50 rounded-2xl p-4 mb-6 flex justify-between items-center"
                >
                    <span class="text-sm font-bold text-gray-600"
                        >Tổng tạm tính:</span
                    >
                    <span class="text-lg font-black text-primary">{{
                        formatCurrency(
                            (selectedService?.price || 0) * orderQuantity,
                        )
                    }}</span>
                </div>

                <div class="flex gap-3">
                    <button
                        @click="isOrderModalOpen = false"
                        class="flex-1 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200"
                    >
                        Hủy
                    </button>
                    <button
                        @click="submitOrder"
                        :disabled="isOrdering"
                        class="flex-1 py-3 bg-primary text-white font-bold rounded-xl hover:bg-orange-600 shadow-lg flex justify-center items-center"
                    >
                        <span
                            v-if="isOrdering"
                            class="material-symbols-outlined animate-spin text-sm mr-2"
                            >autorenew</span
                        >
                        Xác nhận gọi
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
