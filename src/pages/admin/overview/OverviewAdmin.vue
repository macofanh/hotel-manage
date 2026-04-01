<script setup lang="ts">
import { ref, onMounted } from 'vue'
import httpClient from '@/api/axiosClient'

const isLoading = ref(true)
const totalYearlyRevenue = ref(0)
const totalRoomsCount = ref(0) // Biến lưu tổng số phòng

// Khởi tạo giá trị mặc định chuẩn để không bị lỗi undefined
const summary = ref({
    users: { value: 0, growth: 0, is_up: true },
    revenue: { value: 0, growth: 0, is_up: true },
})

const chartSeries = ref([
    {
        name: 'Doanh thu',
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    },
])

const chartOptions = ref({
    chart: {
        type: 'bar',
        toolbar: { show: false },
        fontFamily: 'Inter, sans-serif',
    },
    colors: ['#f48c25'],
    plotOptions: { bar: { borderRadius: 4, columnWidth: '40%' } },
    dataLabels: { enabled: false },
    xaxis: {
        categories: [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec',
        ],
        axisBorder: { show: false },
        axisTicks: { show: false },
    },
    yaxis: {
        labels: {
            formatter: (value: number) => {
                return new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND',
                    maximumFractionDigits: 0,
                }).format(value)
            },
        },
    },
    grid: { borderColor: '#f5f2f0', strokeDashArray: 4 },
    tooltip: {
        y: {
            formatter: (val: number) =>
                new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND',
                }).format(val),
        },
    },
})

const fetchDashboardData = async () => {
    isLoading.value = true
    try {
        // GỌI API ĐỘC LẬP (Cái nào lỗi thì trả về null/0 để không ảnh hưởng cái khác)
        const summaryRes = await httpClient
            .get('/api/dashboard/summary')
            .catch(() => ({ data: null }))
        const usersRes = await httpClient
            .get('/api/dashboard/total-users')
            .catch(() => ({ data: { total_users: 0 } }))
        const roomsRes = await httpClient
            .get('/api/dashboard/total-rooms')
            .catch(() => ({ data: { total_rooms: 0 } }))
        const monthlyRevRes = await httpClient
            .get('/api/dashboard/monthly-revenue')
            .catch(() => ({ data: { monthly_revenue: 0 } }))
        const chartRes = await httpClient
            .get('/api/dashboard/revenue-chart')
            .catch(() => ({ data: null }))

        // 1. Gán an toàn dữ liệu Summary
        if (summaryRes.data) {
            summary.value.users.growth = summaryRes.data.users?.growth || 0
            summary.value.users.is_up = summaryRes.data.users?.is_up ?? true
            summary.value.revenue.growth = summaryRes.data.revenue?.growth || 0
            summary.value.revenue.is_up = summaryRes.data.revenue?.is_up ?? true
        }

        // 2. Gán dữ liệu thực tế từ các API đếm
        summary.value.users.value = usersRes.data.total_users || 0
        totalRoomsCount.value = roomsRes.data.total_rooms || 0
        summary.value.revenue.value = monthlyRevRes.data.monthly_revenue || 0

        // 3. Xử lý Biểu đồ
        const chartData = chartRes.data || chartRes
        if (chartData && chartData.data) {
            chartSeries.value = [
                { name: 'Doanh thu', data: [...chartData.data] },
            ]
            totalYearlyRevenue.value = chartData.data.reduce(
                (sum: number, val: number) => sum + val,
                0,
            )
        }
    } catch (error) {
        console.error('Lỗi tải dữ liệu Dashboard:', error)
    } finally {
        isLoading.value = false
    }
}

onMounted(() => {
    fetchDashboardData()
})

const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(val)
}
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
                            >dashboard</span
                        >
                    </div>
                    <h2
                        class="text-xl font-extrabold leading-tight tracking-tight"
                    >
                        Tổng quan hệ thống
                    </h2>
                </div>
            </div>
            <div class="flex items-center gap-3">
                <button
                    @click="fetchDashboardData"
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

        <div v-if="isLoading" class="flex-1 flex items-center justify-center">
            <span
                class="material-symbols-outlined animate-spin text-primary text-5xl"
                >autorenew</span
            >
        </div>

        <div v-else class="flex flex-col gap-6">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div
                    class="flex flex-col gap-2 rounded-2xl p-6 bg-white border border-gray-200 shadow-sm transition-all hover:shadow-md"
                >
                    <div class="flex justify-between items-start">
                        <p
                            class="text-gray-500 text-sm font-bold uppercase tracking-wider"
                        >
                            Tổng khách hàng
                        </p>
                        <span
                            class="material-symbols-outlined text-primary p-2 bg-orange-50 rounded-xl"
                            >groups</span
                        >
                    </div>
                    <p class="text-gray-900 tracking-tight text-3xl font-black">
                        {{ summary.users.value }}
                    </p>
                    <div class="flex items-center gap-1.5 mt-2">
                        <span
                            class="material-symbols-outlined text-lg font-bold"
                            :class="
                                summary.users.is_up
                                    ? 'text-green-600'
                                    : 'text-red-500'
                            "
                        >
                            {{
                                summary.users.is_up
                                    ? 'trending_up'
                                    : 'trending_down'
                            }}
                        </span>
                        <p
                            class="text-sm font-bold"
                            :class="
                                summary.users.is_up
                                    ? 'text-green-600'
                                    : 'text-red-500'
                            "
                        >
                            {{ summary.users.is_up ? '+' : ''
                            }}{{ summary.users.growth }}%
                        </p>
                        <p class="text-gray-400 text-xs font-medium">
                            so với tháng trước
                        </p>
                    </div>
                </div>

                <div
                    class="flex flex-col gap-2 rounded-2xl p-6 bg-white border border-gray-200 shadow-sm transition-all hover:shadow-md"
                >
                    <div class="flex justify-between items-start">
                        <p
                            class="text-gray-500 text-sm font-bold uppercase tracking-wider"
                        >
                            Tổng số phòng
                        </p>
                        <span
                            class="material-symbols-outlined text-primary p-2 bg-orange-50 rounded-xl"
                            >meeting_room</span
                        >
                    </div>
                    <p class="text-gray-900 tracking-tight text-3xl font-black">
                        {{ totalRoomsCount }} Phòng
                    </p>
                    <div class="flex items-center gap-1.5 mt-2">
                        <p class="text-gray-400 text-xs font-medium">
                            Đang có trong hệ thống
                        </p>
                    </div>
                </div>

                <div
                    class="flex flex-col gap-2 rounded-2xl p-6 bg-white border border-gray-200 shadow-sm transition-all hover:shadow-md"
                >
                    <div class="flex justify-between items-start">
                        <p
                            class="text-gray-500 text-sm font-bold uppercase tracking-wider"
                        >
                            Doanh thu tháng {{ new Date().getMonth() + 1 }}
                        </p>
                        <span
                            class="material-symbols-outlined text-primary p-2 bg-orange-50 rounded-xl"
                            >payments</span
                        >
                    </div>
                    <p class="text-gray-900 tracking-tight text-3xl font-black">
                        {{ formatCurrency(summary.revenue.value) }}
                    </p>
                    <div class="flex items-center gap-1.5 mt-2">
                        <span
                            class="material-symbols-outlined text-lg font-bold"
                            :class="
                                summary.revenue.is_up
                                    ? 'text-green-600'
                                    : 'text-red-500'
                            "
                        >
                            {{
                                summary.revenue.is_up
                                    ? 'trending_up'
                                    : 'trending_down'
                            }}
                        </span>
                        <p
                            class="text-sm font-bold"
                            :class="
                                summary.revenue.is_up
                                    ? 'text-green-600'
                                    : 'text-red-500'
                            "
                        >
                            {{ summary.revenue.is_up ? '+' : ''
                            }}{{ summary.revenue.growth }}%
                        </p>
                        <p class="text-gray-400 text-xs font-medium">
                            so với tháng trước
                        </p>
                    </div>
                </div>
            </div>

            <div
                class="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm"
            >
                <div class="flex items-center justify-between mb-6">
                    <div class="flex flex-col gap-1">
                        <h2
                            class="text-gray-900 text-xl font-extrabold leading-tight"
                        >
                            Biểu đồ Doanh thu
                        </h2>
                        <p class="text-gray-500 text-sm font-medium">
                            Theo dõi hiệu suất kinh doanh trong năm nay
                        </p>
                    </div>
                    <div
                        class="text-right bg-orange-50 px-4 py-2 rounded-xl border border-orange-100"
                    >
                        <p
                            class="text-xs font-bold text-gray-500 uppercase tracking-wider"
                        >
                            Tổng doanh thu năm
                        </p>
                        <p class="text-2xl font-black text-primary">
                            {{ formatCurrency(totalYearlyRevenue) }}
                        </p>
                    </div>
                </div>
                <div class="w-full h-80 pt-4">
                    <apexchart
                        type="bar"
                        height="100%"
                        :options="chartOptions"
                        :series="chartSeries"
                    ></apexchart>
                </div>
            </div>
        </div>
    </div>
</template>
