<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import httpClient from '@/api/axiosClient'

const router = useRouter()
const searchQuery = ref('')
const rooms = ref<any[]>([])
const isLoading = ref(true)

// Lấy data thật từ Backend
const fetchRooms = async () => {
    try {
        const res: any = await httpClient.get('/api/rooms/')
        rooms.value = res.data || res
    } catch (error) {
        console.error('Lỗi lấy danh sách phòng:', error)
    } finally {
        isLoading.value = false
    }
}

onMounted(() => {
    fetchRooms()
})

// Lọc phòng (Tìm theo số phòng hoặc mô tả loại phòng)
const filteredRooms = computed(() => {
    const query = searchQuery.value.toLowerCase().trim()
    // Chỉ hiển thị phòng đang AVAILABLE (Trống) cho khách đặt
    let result = rooms.value.filter((r) => r.status === 'AVAILABLE')

    if (!query) return result

    return result.filter(
        (room) =>
            room.room_number?.toLowerCase().includes(query) ||
            room.room_type?.type_name?.toLowerCase().includes(query) ||
            room.room_type?.description?.toLowerCase().includes(query),
    )
})

const handleBookNow = (roomId: number) => {
    router.push({ name: 'booking', params: { id: roomId } })
}

const handleViewDetail = (roomId: number) => {
    router.push({ name: 'room-detail', params: { id: roomId } })
}

// Hàm lấy URL ảnh
const getFullUrl = (path: string) => {
    if (!path)
        return 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=800&auto=format&fit=crop'
    if (path.startsWith('http')) return path
    return `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}${path}`
}

// Hàm Format Tiền
const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(val || 0)
}
</script>

<template>
    <div class="bg-[#f9fafb] min-h-screen">
        <div
            class="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 overflow-hidden"
        >
            <div class="text-center mb-12">
                <div class="flex items-center justify-center gap-4 mb-2">
                    <div class="h-[2px] w-12 bg-primary"></div>
                    <span
                        class="text-primary font-bold tracking-widest text-xs uppercase"
                        >Bộ sưu tập phòng</span
                    >
                    <div class="h-[2px] w-12 bg-primary"></div>
                </div>
                <h2
                    class="text-4xl md:text-5xl font-extrabold text-gray-900 uppercase tracking-tight"
                >
                    Khám phá <span class="text-primary">Phòng nghỉ</span>
                </h2>
            </div>

            <div class="flex justify-end mb-8">
                <div class="relative w-full md:w-80">
                    <div
                        class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none"
                    >
                        <span class="material-icons-outlined text-gray-400"
                            >search</span
                        >
                    </div>
                    <input
                        v-model="searchQuery"
                        type="text"
                        placeholder="Tìm kiếm theo số phòng, loại phòng..."
                        class="block w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all shadow-sm"
                    />
                    <button
                        v-if="searchQuery"
                        @click="searchQuery = ''"
                        class="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-primary transition-colors"
                    >
                        <span class="material-icons-outlined text-lg"
                            >close</span
                        >
                    </button>
                </div>
            </div>

            <div v-if="isLoading" class="flex justify-center py-20">
                <span
                    class="material-symbols-outlined animate-spin text-primary text-4xl"
                    >autorenew</span
                >
            </div>

            <div
                v-else-if="filteredRooms.length === 0"
                class="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm"
            >
                <span
                    class="material-icons-outlined text-6xl text-gray-300 mb-4"
                    >search_off</span
                >
                <h3 class="text-xl font-bold text-gray-800 mb-2">
                    Không tìm thấy kết quả
                </h3>
                <p class="text-gray-500 text-sm">
                    Không có phòng nào phù hợp với từ khóa "<span
                        class="font-bold text-gray-900"
                        >{{ searchQuery }}</span
                    >"
                </p>
            </div>

            <div
                v-else
                class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
                <div
                    v-for="room in filteredRooms"
                    :key="room.room_id || room.id"
                    class="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 transition-transform duration-300 hover:-translate-y-2 group flex flex-col"
                >
                    <div class="relative h-64 overflow-hidden">
                        <img
                            :alt="room.room_number"
                            class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            :src="
                                getFullUrl(
                                    room.images?.[0]?.image_url ||
                                        room.image_url,
                                )
                            "
                        />
                        <div
                            class="absolute bottom-0 left-0 bg-primary text-white font-bold py-2.5 px-6 rounded-tr-xl shadow-md"
                        >
                            {{
                                formatCurrency(
                                    room.price_per_night ||
                                        room.room_type?.base_price ||
                                        0,
                                )
                            }}
                            <span class="text-sm font-medium">/ Đêm</span>
                        </div>
                    </div>

                    <div class="p-6 flex flex-col flex-1">
                        <div class="flex justify-between items-start mb-4">
                            <div>
                                <h3 class="text-xl font-bold text-gray-900">
                                    Phòng {{ room.room_number }}
                                </h3>
                                <p
                                    class="text-xs font-bold text-gray-400 uppercase tracking-wide mt-1"
                                >
                                    {{
                                        room.room_type?.type_name ||
                                        'Phòng Tiêu Chuẩn'
                                    }}
                                </p>
                            </div>
                            <div class="flex text-primary">
                                <span
                                    class="material-icons-outlined text-sm"
                                    v-for="n in 5"
                                    :key="n"
                                    >star</span
                                >
                            </div>
                        </div>

                        <div
                            class="flex items-center gap-6 mb-6 text-gray-500 text-sm border-y border-gray-50 py-3"
                        >
                            <div class="flex items-center gap-1.5">
                                <span
                                    class="material-icons-outlined text-primary text-lg"
                                    >group</span
                                >
                                <span
                                    >{{
                                        room.room_type?.capacity || 2
                                    }}
                                    Khách</span
                                >
                            </div>
                            <div
                                class="flex items-center gap-1.5 border-l border-gray-200 pl-4"
                            >
                                <span
                                    class="material-icons-outlined text-primary text-lg"
                                    >wifi</span
                                >
                                <span>Wifi Miễn phí</span>
                            </div>
                        </div>

                        <p
                            class="text-gray-600 text-sm leading-relaxed mb-8 line-clamp-2 min-h-[40px]"
                        >
                            {{
                                room.room_type?.description ||
                                'Phòng nghỉ đầy đủ tiện nghi, mang lại cảm giác thoải mái.'
                            }}
                        </p>

                        <div class="flex gap-4 mt-auto">
                            <button
                                @click="
                                    handleViewDetail(room.room_id || room.id)
                                "
                                class="flex-1 bg-orange-50 hover:bg-orange-100 text-primary font-bold py-3 px-4 rounded-xl transition-colors text-xs uppercase tracking-wider"
                            >
                                Xem chi tiết
                            </button>
                            <button
                                @click="handleBookNow(room.room_id || room.id)"
                                class="flex-1 bg-gray-900 hover:bg-primary text-white font-bold py-3 px-4 rounded-xl transition-colors text-xs uppercase tracking-wider shadow-md"
                            >
                                Đặt ngay
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>
