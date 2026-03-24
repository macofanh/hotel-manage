<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import httpClient from '@/api/axiosClient'

const router = useRouter()

// Định nghĩa Interface (Linh hoạt theo BE của bạn)
interface Room {
    id: number // Hoặc room_id tùy BE của bạn
    room_number: string
    room_type_name?: string // Tùy cấu trúc BE trả về
    price_per_night?: number
    status: string // 'AVAILABLE', 'OCCUPIED', 'CLEANING', 'MAINTENANCE'
    image_url?: string
}

const rooms = ref<any[]>([])
const isLoading = ref(false)
const searchQuery = ref('')
const filterStatus = ref('ALL') // ALL, AVAILABLE, OCCUPIED, CLEANING

// 1. Lấy danh sách Phòng
const fetchRooms = async () => {
    isLoading.value = true
    try {
        const response: any = await httpClient.get('/api/rooms/')
        rooms.value = response.data || response
    } catch (error) {
        console.error('Lỗi khi tải danh sách phòng:', error)
        alert('Không thể tải danh sách phòng!')
    } finally {
        isLoading.value = false
    }
}

onMounted(() => {
    fetchRooms()
})

// 2. Thống kê số lượng (Stats)
const stats = computed(() => {
    const total = rooms.value.length
    const available = rooms.value.filter((r) => r.status === 'AVAILABLE').length
    const occupied = rooms.value.filter((r) => r.status === 'OCCUPIED').length
    const cleaning = rooms.value.filter(
        (r) => r.status === 'CLEANING' || r.status === 'MAINTENANCE',
    ).length
    return { total, available, occupied, cleaning }
})

// 3. Lọc & Tìm kiếm
const filteredRooms = computed(() => {
    let result = rooms.value

    // Lọc theo trạng thái
    if (filterStatus.value !== 'ALL') {
        result = result.filter((r) => r.status === filterStatus.value)
    }

    // Lọc theo số phòng
    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        result = result.filter((r) =>
            r.room_number?.toLowerCase().includes(query),
        )
    }

    return result
})

// 4. Xóa Phòng
const handleDelete = async (id: number, roomNumber: string) => {
    if (
        !confirm(
            `Bạn có chắc chắn muốn xóa phòng ${roomNumber}? Hành động này không thể hoàn tác!`,
        )
    ) {
        return
    }
    try {
        await httpClient.delete(`/api/rooms/${id}`)
        alert('Xóa phòng thành công!')
        fetchRooms()
    } catch (error: any) {
        console.error('Lỗi khi xóa:', error)
        alert(error?.response?.data?.detail || 'Lỗi khi xóa phòng!')
    }
}

// 5. Điều hướng
const goToAddRoom = () => router.push({ name: 'admin-rooms-create' })
const goToEditRoom = (id: number) =>
    router.push({ name: 'admin-rooms-edit', params: { id } })

// Tiện ích lấy URL ảnh
// const getFullUrl = (path: string) => {
//     if (!path) return 'https://placehold.co/600x400?text=No+Image' // Ảnh mặc định nếu phòng chưa có ảnh
//     if (path.startsWith('http')) return path
//     return `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}${path}`
// }
const getFullUrl = (path: string): string => {
    if (!path) return 'https://placehold.co/600x400?text=No+Image'
    if (path.startsWith('http')) return path
    const BASE_URL =
        import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
    return `${BASE_URL}${path}`
}

// Hàm format tiền tệ
const formatCurrency = (amount: number) => {
    if (!amount) return '0'
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(amount)
}
</script>

<template>
    <div class="flex flex-col h-full gap-6 max-w-7xl mx-auto w-full">
        <header
            class="flex items-center justify-between whitespace-nowrap border-b border-gray-200 bg-white/80 backdrop-blur-md px-8 py-4 rounded-2xl shadow-sm"
        >
            <div class="flex items-center gap-8">
                <div class="flex items-center gap-4 text-gray-900">
                    <div class="size-6 text-primary">
                        <span class="material-symbols-outlined text-[28px]"
                            >bed</span
                        >
                    </div>
                </div>
                <div class="relative w-64">
                    <span
                        class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl"
                        >search</span
                    >
                    <input
                        v-model="searchQuery"
                        class="w-full h-10 bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                        placeholder="Tìm kiếm số phòng..."
                    />
                </div>
            </div>

            <div class="flex items-center gap-3">
                <button
                    @click="fetchRooms"
                    class="flex items-center justify-center rounded-lg h-10 w-10 bg-gray-50 border border-gray-200 text-gray-600 hover:text-primary transition-colors"
                >
                    <span
                        class="material-symbols-outlined"
                        :class="{ 'animate-spin': isLoading }"
                        >refresh</span
                    >
                </button>
                <button
                    @click="goToAddRoom"
                    class="ml-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold shadow-md shadow-primary/20 hover:bg-orange-600 transition-all flex items-center gap-2 active:scale-95"
                >
                    <span class="material-symbols-outlined text-base">add</span>
                    Thêm phòng mới
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
                    Tổng số phòng
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
                    Trống
                </p>
                <p class="text-green-500 text-3xl font-extrabold">
                    {{ stats.available }}
                </p>
            </div>
            <div
                class="flex flex-col gap-2 rounded-2xl p-6 bg-white border border-gray-200 shadow-sm"
            >
                <p
                    class="text-gray-500 text-xs font-bold uppercase tracking-wider"
                >
                    Đang thuê
                </p>
                <p class="text-red-500 text-3xl font-extrabold">
                    {{ stats.occupied }}
                </p>
            </div>
            <div
                class="flex flex-col gap-2 rounded-2xl p-6 bg-white border border-gray-200 shadow-sm"
            >
                <p
                    class="text-gray-500 text-xs font-bold uppercase tracking-wider"
                >
                    Đang dọn / Bảo trì
                </p>
                <p class="text-amber-500 text-3xl font-extrabold">
                    {{ stats.cleaning }}
                </p>
            </div>
        </div>

        <div
            class="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-200 shadow-sm"
        >
            <div class="flex items-center gap-3">
                <span class="text-sm font-bold text-gray-600 ml-2"
                    >Lọc theo trạng thái:</span
                >
                <div class="flex gap-2">
                    <button
                        @click="filterStatus = 'ALL'"
                        :class="
                            filterStatus === 'ALL'
                                ? 'bg-primary text-white shadow-md shadow-primary/20'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        "
                        class="px-4 py-1.5 text-xs font-bold rounded-full transition-all"
                    >
                        Tất cả
                    </button>
                    <button
                        @click="filterStatus = 'AVAILABLE'"
                        :class="
                            filterStatus === 'AVAILABLE'
                                ? 'bg-green-500 text-white shadow-md shadow-green-500/20'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        "
                        class="px-4 py-1.5 text-xs font-bold rounded-full transition-all"
                    >
                        Trống
                    </button>
                    <button
                        @click="filterStatus = 'OCCUPIED'"
                        :class="
                            filterStatus === 'OCCUPIED'
                                ? 'bg-red-500 text-white shadow-md shadow-red-500/20'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        "
                        class="px-4 py-1.5 text-xs font-bold rounded-full transition-all"
                    >
                        Đang thuê
                    </button>
                    <button
                        @click="filterStatus = 'CLEANING'"
                        :class="
                            filterStatus === 'CLEANING'
                                ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        "
                        class="px-4 py-1.5 text-xs font-bold rounded-full transition-all"
                    >
                        Đang dọn
                    </button>
                </div>
            </div>
            <div class="flex items-center gap-4">
                <select
                    class="text-sm border-gray-200 bg-gray-50 rounded-lg focus:ring-primary focus:border-primary py-2 px-4 outline-none font-medium cursor-pointer"
                >
                    <option>Sắp xếp: Số phòng</option>
                    <option>Sắp xếp: Giá giảm dần</option>
                    <option>Sắp xếp: Giá tăng dần</option>
                </select>
            </div>
        </div>

        <div v-if="isLoading" class="flex items-center justify-center py-20">
            <span
                class="material-symbols-outlined animate-spin text-primary text-4xl"
                >autorenew</span
            >
        </div>

        <div
            v-else-if="filteredRooms.length === 0"
            class="flex flex-col items-center justify-center py-20 text-gray-500 bg-white rounded-2xl border border-gray-200"
        >
            <span class="material-symbols-outlined text-5xl mb-2 text-gray-300"
                >bed</span
            >
            <p class="font-medium">Không tìm thấy phòng nào phù hợp.</p>
        </div>

        <div
            v-else
            class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
            <div
                v-for="room in filteredRooms"
                :key="room.id || room.room_id"
                class="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all group relative"
            >
                <div
                    class="h-44 bg-cover bg-center"
                    :style="`background-image: url('${getFullUrl(room.image_url)}')`"
                ></div>

                <div class="p-5 flex flex-col gap-3">
                    <div class="flex justify-between items-start">
                        <div>
                            <h3 class="text-lg font-extrabold text-gray-900">
                                Phòng {{ room.room_number }}
                            </h3>
                            <p
                                class="text-xs text-gray-500 font-bold mt-0.5 uppercase tracking-wide"
                            >
                                {{
                                    room.room_type?.type_name ||
                                    'Hạng phòng cơ bản'
                                }}
                            </p>
                        </div>

                        <span
                            v-if="room.status === 'AVAILABLE'"
                            class="px-2.5 py-1 rounded-md bg-green-50 text-green-600 border border-green-100 text-[10px] font-extrabold uppercase tracking-wide"
                            >Available</span
                        >
                        <span
                            v-else-if="room.status === 'OCCUPIED'"
                            class="px-2.5 py-1 rounded-md bg-red-50 text-red-600 border border-red-100 text-[10px] font-extrabold uppercase tracking-wide"
                            >Occupied</span
                        >
                        <span
                            v-else
                            class="px-2.5 py-1 rounded-md bg-amber-50 text-amber-600 border border-amber-100 text-[10px] font-extrabold uppercase tracking-wide"
                            >Cleaning</span
                        >
                    </div>

                    <div
                        class="flex items-center justify-between border-t border-gray-100 pt-3 mt-1"
                    >
                        <div>
                            <p
                                class="text-[11px] text-gray-400 font-bold uppercase"
                            >
                                Mức giá
                            </p>
                            <p class="text-base font-extrabold text-primary">
                                {{
                                    formatCurrency(
                                        room.price_per_night ||
                                            room.room_type?.base_price ||
                                            0,
                                    )
                                }}
                                <span
                                    class="text-[10px] text-gray-400 font-medium"
                                    >/đêm</span
                                >
                            </p>
                        </div>

                        <div class="flex gap-1">
                            <button
                                @click="goToEditRoom(room.id || room.room_id)"
                                class="text-gray-400 hover:text-primary hover:bg-orange-50 p-2 rounded-lg transition-colors"
                                title="Chỉnh sửa"
                            >
                                <span
                                    class="material-symbols-outlined text-[20px]"
                                    >edit</span
                                >
                            </button>
                            <button
                                @click="
                                    handleDelete(
                                        room.id || room.room_id,
                                        room.room_number,
                                    )
                                "
                                class="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
                                title="Xóa phòng"
                            >
                                <span
                                    class="material-symbols-outlined text-[20px]"
                                    >delete</span
                                >
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <footer class="text-center pb-2 pt-4">
            <p
                class="text-xs text-gray-400 font-semibold tracking-wider uppercase"
            >
                © 2026 MacHotel Luxury Admin Panel
            </p>
        </footer>
    </div>
</template>
