<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import httpClient from '@/api/axiosClient'

const router = useRouter()
const props = defineProps<{ id: string }>()

const room = ref<any>(null)
const similarRooms = ref<any[]>([]) // 🌟 KHAI BÁO BIẾN CHỨA PHÒNG TƯƠNG TỰ
const isLoading = ref(true)

// Dữ liệu fix cứng cho đẹp giao diện (Vì DB chưa lưu Icon tiện ích lẻ)
const defaultAmenities = [
    { icon: 'wifi', name: 'Wi-Fi tốc độ cao' },
    { icon: 'ac_unit', name: 'Điều hòa nhiệt độ' },
    { icon: 'tv', name: 'Smart TV 65"' },
    { icon: 'bathtub', name: 'Bồn tắm cao cấp' },
]

const fetchRoomDetail = async (roomId: string) => {
    isLoading.value = true
    try {
        // 1. LẤY CHI TIẾT PHÒNG
        const res: any = await httpClient.get(`/api/rooms/${roomId}`)
        const data = res.data || res

        room.value = {
            id: data.room_id || data.id,
            name: `Phòng ${data.room_number}`,
            type_name: data.room_type?.type_name || '',
            price: data.price_per_night || data.room_type?.base_price || 0,
            rating: 4.9,
            reviews: 128,
            size: '450 sqft',
            capacity: data.room_type?.capacity || 2,
            description: [
                data.room_type?.description ||
                    'Phòng nghỉ với đầy đủ tiện nghi...',
            ],
            images: data.images?.length
                ? data.images.map((i: any) => getFullUrl(i.image_url))
                : data.image_url
                  ? [getFullUrl(data.image_url)]
                  : [getFullUrl('')],
            amenities: defaultAmenities,
        }

        // 2. LẤY DANH SÁCH PHÒNG TƯƠNG TỰ (Tự gọi API và lọc ra)
        const allRoomsRes: any = await httpClient.get('/api/rooms/')
        const allRooms = allRoomsRes.data || allRoomsRes

        // Lọc lấy 3 phòng đang trống và KHÁC với phòng đang xem
        similarRooms.value = allRooms
            .filter(
                (r: any) =>
                    r.status === 'AVAILABLE' && r.room_id !== Number(roomId),
            )
            .slice(0, 3)
            .map((r: any) => ({
                id: r.room_id || r.id,
                name: `Phòng ${r.room_number}`,
                price: r.price_per_night || r.room_type?.base_price || 0,
                image: getFullUrl(r.images?.[0]?.image_url || r.image_url),
            }))
    } catch (error) {
        console.error('Lỗi lấy chi tiết phòng:', error)
        alert('Phòng không tồn tại!')
        router.push({ name: 'room' })
    } finally {
        isLoading.value = false
    }
}

watch(
    () => props.id,
    (newId) => {
        if (newId) {
            fetchRoomDetail(newId)
            window.scrollTo({ top: 0, behavior: 'smooth' })
        }
    },
    { immediate: true },
)

const handleProceedToBooking = (bookingRoomId?: number) => {
    // Nếu ấn từ mục phòng tương tự thì truyền id đó, còn không thì truyền id phòng hiện tại
    const idToBook = bookingRoomId || room.value.id
    router.push({ name: 'booking', params: { id: idToBook } })
}

const goToRoom = (id: number) => {
    router.push({ name: 'room-detail', params: { id: id.toString() } })
}

const getFullUrl = (path: string) => {
    if (!path)
        return 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1200&auto=format&fit=crop'
    if (path.startsWith('http')) return path
    return `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}${path}`
}

const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(val || 0)
}
</script>

<template>
    <main class="flex flex-1 justify-center py-5 bg-[#f8f7f5] min-h-screen">
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
                    >Đang tải thông tin phòng...</span
                >
            </div>
        </div>

        <div
            v-else-if="room"
            class="layout-content-container flex flex-col max-w-[1200px] flex-1 px-6 lg:px-10 gap-6"
        >
            <div class="flex flex-wrap items-center gap-2 py-2">
                <router-link
                    :to="{ name: 'home' }"
                    class="text-[#8a7a60] text-sm font-medium hover:text-primary transition-colors"
                    >Trang chủ</router-link
                >
                <span class="material-symbols-outlined text-[#8a7a60] text-sm"
                    >chevron_right</span
                >
                <router-link
                    :to="{ name: 'room' }"
                    class="text-[#8a7a60] text-sm font-medium hover:text-primary transition-colors"
                    >Phòng nghỉ</router-link
                >
                <span class="material-symbols-outlined text-[#8a7a60] text-sm"
                    >chevron_right</span
                >
                <span class="text-[#181511] text-sm font-semibold">{{
                    room.name
                }}</span>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div class="lg:col-span-2 flex flex-col gap-8">
                    <div class="flex flex-col gap-4">
                        <div
                            class="w-full h-[450px] bg-center bg-no-repeat bg-cover rounded-xl shadow-md"
                            :style="{
                                backgroundImage: `url(${room.images[0]})`,
                            }"
                        ></div>
                        <div
                            class="grid grid-cols-4 gap-4"
                            v-if="room.images.length > 1"
                        >
                            <div
                                v-for="(img, index) in room.images.slice(1, 5)"
                                :key="index"
                                class="aspect-[4/3] bg-center bg-no-repeat bg-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                                :style="{ backgroundImage: `url(${img})` }"
                            ></div>
                        </div>
                    </div>

                    <div class="flex flex-col gap-4">
                        <h3 class="text-2xl font-bold text-gray-900">
                            Về phòng này
                        </h3>
                        <p
                            v-for="(paragraph, index) in room.description"
                            :key="index"
                            class="text-[#8a7a60] text-base leading-relaxed"
                        >
                            {{ paragraph }}
                        </p>
                    </div>

                    <div class="flex flex-col gap-6">
                        <h3 class="text-2xl font-bold text-gray-900">
                            Tiện ích phòng
                        </h3>
                        <div
                            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        >
                            <div
                                v-for="(amenity, index) in room.amenities"
                                :key="index"
                                class="flex items-center gap-3"
                            >
                                <span
                                    class="material-symbols-outlined text-primary text-2xl"
                                    >{{ amenity.icon }}</span
                                >
                                <span
                                    class="text-[#181511] font-medium text-sm"
                                    >{{ amenity.name }}</span
                                >
                            </div>
                        </div>
                    </div>
                </div>

                <div class="lg:col-span-1">
                    <div
                        class="sticky top-24 flex flex-col gap-6 p-6 rounded-2xl bg-white shadow-xl border border-gray-100"
                    >
                        <div class="flex flex-col gap-1">
                            <h1
                                class="text-3xl font-black text-[#181511] tracking-tight"
                            >
                                {{ room.name }}
                            </h1>
                            <p
                                class="text-sm font-bold text-primary uppercase tracking-wide"
                            >
                                {{ room.type_name }}
                            </p>
                        </div>

                        <div class="flex items-baseline gap-2">
                            <span
                                class="text-3xl font-extrabold text-[#181511]"
                                >{{ formatCurrency(room.price) }}</span
                            >
                            <span class="text-[#8a7a60] font-medium"
                                >/ Đêm</span
                            >
                        </div>

                        <div
                            class="flex flex-col gap-4 py-4 border-y border-[#eeeae4]"
                        >
                            <div
                                class="flex items-center justify-between text-[#8a7a60]"
                            >
                                <div class="flex items-center gap-2">
                                    <span
                                        class="material-symbols-outlined text-primary"
                                        >group</span
                                    >
                                    <span
                                        class="text-sm font-medium text-gray-800"
                                        >{{ room.capacity }} Người</span
                                    >
                                </div>
                                <div class="flex items-center gap-2">
                                    <span
                                        class="material-symbols-outlined text-primary"
                                        >wifi</span
                                    >
                                    <span
                                        class="text-sm font-medium text-gray-800"
                                        >Miễn phí</span
                                    >
                                </div>
                                <div class="flex items-center gap-2">
                                    <span
                                        class="material-symbols-outlined text-primary"
                                        >square_foot</span
                                    >
                                    <span
                                        class="text-sm font-medium text-gray-800"
                                        >{{ room.size }}</span
                                    >
                                </div>
                            </div>
                        </div>

                        <button
                            @click="handleProceedToBooking()"
                            class="w-full bg-primary hover:bg-orange-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 mt-2"
                        >
                            Tiến hành đặt phòng
                            <span class="material-symbols-outlined text-lg"
                                >arrow_forward</span
                            >
                        </button>
                    </div>
                </div>
            </div>

            <div
                v-if="similarRooms.length > 0"
                class="flex flex-col gap-6 py-10 border-t border-gray-200 mt-4"
            >
                <h3 class="text-2xl font-bold text-gray-900">
                    Các phòng trống khác
                </h3>
                <div
                    class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    <div
                        v-for="simRoom in similarRooms"
                        :key="simRoom.id"
                        class="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 group cursor-pointer hover:shadow-md transition-shadow flex flex-col"
                        @click="goToRoom(simRoom.id)"
                    >
                        <div
                            class="h-48 bg-center bg-no-repeat bg-cover group-hover:scale-105 transition-transform duration-500"
                            :style="{
                                backgroundImage: `url(${simRoom.image})`,
                            }"
                        ></div>
                        <div class="p-5 flex flex-col gap-2 flex-1 bg-white">
                            <div class="flex justify-between items-start gap-2">
                                <p class="font-bold text-lg text-gray-900">
                                    {{ simRoom.name }}
                                </p>
                                <p
                                    class="text-primary font-bold text-sm whitespace-nowrap"
                                >
                                    {{ formatCurrency(simRoom.price) }}
                                </p>
                            </div>
                            <button
                                @click.stop="handleProceedToBooking(simRoom.id)"
                                class="mt-auto text-primary text-sm font-bold flex items-center gap-1 hover:text-orange-600 transition-colors w-max pt-2"
                            >
                                Đặt ngay phòng này
                                <span class="material-symbols-outlined text-sm"
                                    >arrow_right_alt</span
                                >
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>

<style scoped>
/* Tailwind handles the styling */
</style>
