<script setup lang="ts">
import { ref, onMounted } from 'vue'
import httpClient from '@/api/axiosClient'

const isLoading = ref(true)
const totalYearlyRevenue = ref(0)

// Dữ liệu 3 thẻ thống kê trên cùng
const summary = ref({
    users: { value: 0, growth: 0, is_up: true },
    occupancy: { value: 0, growth: 0, is_up: true },
    revenue: { value: 0, growth: 0, is_up: true },
})

// Cấu hình Biểu đồ ApexCharts
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
    colors: ['#f48c25'], // Màu primary (Cam)
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

// Gọi 2 API để lấy dữ liệu
const fetchDashboardData = async () => {
    isLoading.value = true
    try {
        // 1. Lấy số liệu tổng quan
        const summaryRes: any = await httpClient.get('/api/dashboard/summary')
        summary.value = summaryRes.data || summaryRes

        // 2. Lấy dữ liệu biểu đồ
        const chartRes: any = await httpClient.get(
            '/api/dashboard/revenue-chart',
        )
        const chartData = chartRes.data || chartRes

        if (chartData && chartData.data) {
            // Cập nhật biểu đồ (Ép Vue phải nhận diện sự thay đổi bằng cách tạo mảng mới)
            chartSeries.value = [
                {
                    name: 'Doanh thu',
                    data: [...chartData.data],
                },
            ]

            // 🌟 TÍNH TỔNG DOANH THU NĂM (Cộng dồn 12 tháng)
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
                            Công suất phòng
                        </p>
                        <span
                            class="material-symbols-outlined text-primary p-2 bg-orange-50 rounded-xl"
                            >meeting_room</span
                        >
                    </div>
                    <p class="text-gray-900 tracking-tight text-3xl font-black">
                        {{ summary.occupancy.value }}%
                    </p>
                    <div class="flex items-center gap-1.5 mt-2">
                        <span
                            class="material-symbols-outlined text-lg font-bold"
                            :class="
                                summary.occupancy.is_up
                                    ? 'text-green-600'
                                    : 'text-red-500'
                            "
                        >
                            {{
                                summary.occupancy.is_up
                                    ? 'trending_up'
                                    : 'trending_down'
                            }}
                        </span>
                        <p
                            class="text-sm font-bold"
                            :class="
                                summary.occupancy.is_up
                                    ? 'text-green-600'
                                    : 'text-red-500'
                            "
                        >
                            {{ summary.occupancy.is_up ? '+' : ''
                            }}{{ summary.occupancy.growth }}%
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
                            Doanh thu tháng
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
