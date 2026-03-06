<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 1. Thêm biến lưu trữ từ khóa tìm kiếm
const searchQuery = ref('')

// Fake Data Danh sách phòng
const rooms = ref([
    {
        id: 1,
        name: 'Phòng Junior Suite Cao Cấp',
        price: 100,
        image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=800&auto=format&fit=crop',
        beds: 3,
        baths: 2,
        wifi: true,
        description:
            'Trải nghiệm không gian sang trọng với đầy đủ tiện nghi hiện đại, view nhìn ra trung tâm thành phố tuyệt đẹp.',
    },
    {
        id: 2,
        name: 'Phòng Executive Suite',
        price: 150,
        image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=800&auto=format&fit=crop',
        beds: 2,
        baths: 2,
        wifi: true,
        description:
            'Phòng Executive được thiết kế đặc biệt dành cho giới doanh nhân với khu vực làm việc rộng rãi và yên tĩnh.',
    },
    {
        id: 3,
        name: 'Phòng Super Deluxe',
        price: 200,
        image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=800&auto=format&fit=crop',
        beds: 4,
        baths: 3,
        wifi: true,
        description:
            'Tận hưởng sự xa hoa bậc nhất với không gian siêu rộng, bồn tắm sục jacuzzi và quầy minibar miễn phí.',
    },
])

// 2. Tự động lọc danh sách phòng dựa trên tên hoặc mô tả
const filteredRooms = computed(() => {
    const query = searchQuery.value.toLowerCase().trim()
    if (!query) return rooms.value

    return rooms.value.filter(
        (room) =>
            room.name.toLowerCase().includes(query) ||
            room.description.toLowerCase().includes(query),
    )
})

const handleBookNow = (roomId: number) => {
    router.push({ name: 'booking', params: { id: roomId } })
}

const handleViewDetail = (roomId: number) => {
    router.push({ name: 'room-detail', params: { id: roomId } })
}
</script>

<template>
    <div class="bg-[#f9fafb] min-h-screen">
        <div
            class="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 overflow-hidden"
        >
            <div class="text-center mb-12" data-aos="fade-down">
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

            <div
                class="flex justify-end mb-8"
                data-aos="fade-up"
                data-aos-delay="50"
            >
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
                        placeholder="Tìm kiếm theo tên phòng..."
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

            <div
                v-if="filteredRooms.length === 0"
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
                <button
                    @click="searchQuery = ''"
                    class="mt-6 text-primary font-bold hover:underline"
                >
                    Xóa tìm kiếm
                </button>
            </div>

            <div
                v-else
                class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
                <div
                    v-for="(room, index) in filteredRooms"
                    :key="room.id"
                    class="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 transition-transform duration-300 hover:-translate-y-2 group"
                    data-aos="fade-up"
                    :data-aos-delay="100 * (index + 1)"
                >
                    <div class="relative h-64 overflow-hidden">
                        <img
                            :alt="room.name"
                            class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            :src="room.image"
                        />
                        <div
                            class="absolute bottom-0 left-0 bg-primary text-white font-bold py-2.5 px-6 rounded-tr-xl"
                        >
                            ${{ room.price }} / Đêm
                        </div>
                    </div>

                    <div class="p-6">
                        <div class="flex justify-between items-center mb-4">
                            <h3 class="text-xl font-bold text-gray-900">
                                {{ room.name }}
                            </h3>
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
                                    >bed</span
                                >
                                <span>{{ room.beds }} Giường</span>
                            </div>
                            <div
                                class="flex items-center gap-1.5 border-l border-gray-200 pl-4"
                            >
                                <span
                                    class="material-icons-outlined text-primary text-lg"
                                    >bathtub</span
                                >
                                <span>{{ room.baths }} Tắm</span>
                            </div>
                            <div
                                v-if="room.wifi"
                                class="flex items-center gap-1.5 border-l border-gray-200 pl-4"
                            >
                                <span
                                    class="material-icons-outlined text-primary text-lg"
                                    >wifi</span
                                >
                                <span>Wifi</span>
                            </div>
                        </div>

                        <p
                            class="text-gray-600 text-sm leading-relaxed mb-8 line-clamp-2 min-h-[40px]"
                        >
                            {{ room.description }}
                        </p>

                        <div class="flex gap-4">
                            <button
                                @click="handleViewDetail(room.id)"
                                class="flex-1 bg-orange-50 hover:bg-orange-100 text-primary font-bold py-3 px-4 rounded-xl transition-colors text-xs uppercase tracking-wider"
                            >
                                Xem chi tiết
                            </button>
                            <button
                                @click="handleBookNow(room.id)"
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
