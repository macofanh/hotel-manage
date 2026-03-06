<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const props = defineProps<{
    id: string
}>()

const room = ref<any>(null)
const isLoading = ref(true)

const similarRooms = ref([
    {
        id: 2,
        name: 'Phòng Executive Suite',
        price: 150,
        info: 'King Bed | 2 Bath',
        image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=600&auto=format&fit=crop',
    },
    {
        id: 3,
        name: 'Phòng Super Deluxe',
        price: 200,
        info: '4 Giường | 3 Bath',
        image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=600&auto=format&fit=crop',
    },
])

const fetchRoomDetail = async (roomId: string) => {
    isLoading.value = true

    // Giả lập delay mạng (nửa giây)
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Giả lập logic lấy data dựa trên ID
    room.value = {
        id: Number(roomId),
        name:
            roomId === '1'
                ? 'Phòng Junior Suite'
                : roomId === '2'
                  ? 'Phòng Executive Suite'
                  : 'Phòng Super Deluxe',
        price: roomId === '1' ? 100 : roomId === '2' ? 150 : 200,
        rating: 4.9,
        reviews: 128,
        size: '450 sqft',
        bed: roomId === '3' ? '4 Giường' : 'King Bed',
        bath: roomId === '1' ? '2 Bath' : '3 Bath',
        description: [
            'Trải nghiệm sự thanh lịch đích thực trong phòng của chúng tôi. Được thiết kế với sự pha trộn hoàn hảo giữa sự sang trọng và thoải mái, căn phòng mang đến không gian sinh hoạt mở rộng rãi với lối trang trí hiện đại, tinh tế.',
            'Cho dù bạn đi công tác hay nghỉ dưỡng, chúng tôi cung cấp mọi tiện nghi bạn cần cho một kỳ nghỉ dưỡng trọn vẹn, bao gồm không gian làm việc chuyên dụng, internet tốc độ cao và hệ thống giải trí cao cấp.',
        ],
        images: [
            'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1200&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=600&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1631049035182-249067d7618e?q=80&w=600&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=600&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=600&auto=format&fit=crop',
        ],
        amenities: [
            { icon: 'wifi', name: 'Wi-Fi tốc độ cao' },
            { icon: 'ac_unit', name: 'Điều hòa nhiệt độ' },
            { icon: 'tv', name: 'Smart TV 65"' },
            { icon: 'bathtub', name: 'Bồn tắm cao cấp' },
        ],
    }

    isLoading.value = false
}

// 3. THEO DÕI SỰ THAY ĐỔI CỦA ID TỪ URL
watch(
    () => props.id,
    (newId) => {
        if (newId) {
            fetchRoomDetail(newId)
            // Cuộn lên đầu trang mỗi khi chuyển phòng
            window.scrollTo({ top: 0, behavior: 'smooth' })
        }
    },
    { immediate: true }, // immediate: true giúp hàm này chạy ngay lập tức khi vừa vào trang
)

const handleProceedToBooking = () => {
    router.push({ name: 'booking', params: { id: room.value.id } })
}

const goToRoom = (id: number) => {
    // Chuyển sang phòng khác -> URL đổi -> watch bắt được -> tự gọi lại data
    router.push({ name: 'room-detail', params: { id: id.toString() } })
}
</script>

<template>
    <main class="flex flex-1 justify-center py-5 bg-[#f8f7f5] min-h-screen">
        <div
            v-if="isLoading"
            class="flex items-center justify-center w-full h-96"
        >
            <div class="flex flex-col items-center gap-3">
                <svg
                    class="animate-spin h-8 w-8 text-primary"
                    viewBox="0 0 24 24"
                >
                    <circle
                        class="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        stroke-width="4"
                        fill="none"
                    ></circle>
                    <path
                        class="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                </svg>
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
                        <div class="grid grid-cols-4 gap-4">
                            <div
                                v-for="(img, index) in room.images.slice(1)"
                                :key="index"
                                class="aspect-[4/3] bg-center bg-no-repeat bg-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                                :class="{
                                    'ring-2 ring-primary ring-offset-2':
                                        index === 0,
                                }"
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
                                class="text-[#8a7a60] text-sm flex items-center gap-1 mt-1"
                            >
                                <span
                                    class="material-symbols-outlined text-primary text-sm"
                                    >star</span
                                >
                                <span class="font-bold text-gray-800">{{
                                    room.rating
                                }}</span>
                                ({{ room.reviews }} đánh giá)
                            </p>
                        </div>

                        <div class="flex items-baseline gap-2">
                            <span class="text-3xl font-extrabold text-[#181511]"
                                >${{ room.price }}</span
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
                                        >king_bed</span
                                    >
                                    <span
                                        class="text-sm font-medium text-gray-800"
                                        >{{ room.bed }}</span
                                    >
                                </div>
                                <div class="flex items-center gap-2">
                                    <span
                                        class="material-symbols-outlined text-primary"
                                        >bathroom</span
                                    >
                                    <span
                                        class="text-sm font-medium text-gray-800"
                                        >{{ room.bath }}</span
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
                            @click="handleProceedToBooking"
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
                class="flex flex-col gap-6 py-10 border-t border-gray-200 mt-4"
            >
                <h3 class="text-2xl font-bold text-gray-900">
                    Các phòng tương tự
                </h3>
                <div
                    class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    <div
                        v-for="simRoom in similarRooms"
                        :key="simRoom.id"
                        class="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 group cursor-pointer hover:shadow-md transition-shadow"
                        @click="goToRoom(simRoom.id)"
                    >
                        <div
                            class="h-48 bg-center bg-no-repeat bg-cover group-hover:scale-105 transition-transform duration-500"
                            :style="{
                                backgroundImage: `url(${simRoom.image})`,
                            }"
                        ></div>
                        <div class="p-5 flex flex-col gap-2 relative bg-white">
                            <div class="flex justify-between items-center">
                                <p class="font-bold text-lg text-gray-900">
                                    {{ simRoom.name }}
                                </p>
                                <p class="text-primary font-bold">
                                    ${{ simRoom.price }}/đêm
                                </p>
                            </div>
                            <button
                                class="mt-2 text-primary text-sm font-bold flex items-center gap-1 hover:text-orange-600 transition-colors w-max"
                            >
                                Xem chi tiết
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
