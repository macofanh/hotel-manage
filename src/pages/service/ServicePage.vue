<script setup lang="ts">
import { ref } from 'vue'

// Dữ liệu danh sách dịch vụ (Dùng vòng lặp v-for để code ngắn gọn, dễ bảo trì)
const services = ref([
    {
        id: 1,
        title: 'Phòng & Căn hộ',
        icon: 'apartment', // Material icon thay cho fa-hotel
        description:
            'Trải nghiệm không gian lưu trú sang trọng, đầy đủ tiện nghi với tầm nhìn tuyệt đẹp và dịch vụ phòng 24/7.',
    },
    {
        id: 2,
        title: 'Nhà hàng & Ẩm thực',
        icon: 'restaurant', // Thay cho fa-utensils
        description:
            'Thưởng thức tinh hoa ẩm thực Á - Âu được chế biến từ các đầu bếp hàng đầu thế giới trong không gian lãng mạn.',
    },
    {
        id: 3,
        title: 'Spa & Thư giãn',
        icon: 'spa', // Thay cho fa-spa
        description:
            'Nuông chiều bản thân với các liệu pháp massage chuyên sâu, xông hơi và chăm sóc sắc đẹp cao cấp.',
    },
    {
        id: 4,
        title: 'Thể thao & Giải trí',
        icon: 'pool', // Thay cho fa-swimmer
        description:
            'Hệ thống hồ bơi vô cực hiện đại, khu vui chơi giải trí và các hoạt động thể thao ngoài trời đa dạng.',
    },
    {
        id: 5,
        title: 'Sự kiện & Tiệc tùng',
        icon: 'celebration', // Thay cho fa-glass-cheers
        description:
            'Hệ thống sảnh tiệc rộng lớn, trang thiết bị âm thanh ánh sáng hiện đại phục vụ hội nghị và tiệc cưới.',
    },
    {
        id: 6,
        title: 'Gym & Yoga',
        icon: 'fitness_center', // Thay cho fa-dumbbell
        description:
            'Phòng tập thể hình với máy móc tân tiến nhất cùng lớp học Yoga giúp bạn duy trì vóc dáng và sức khỏe.',
    },
])
</script>

<template>
    <div class="bg-[#f9fafb] min-h-screen py-16 sm:py-24">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-16" data-aos="fade-down">
                <div class="flex items-center justify-center gap-4 mb-2">
                    <div class="h-[2px] w-12 bg-primary"></div>
                    <span
                        class="text-primary font-bold tracking-widest text-xs uppercase"
                        >Dịch vụ của chúng tôi</span
                    >
                    <div class="h-[2px] w-12 bg-primary"></div>
                </div>
                <h2
                    class="text-4xl md:text-5xl font-extrabold text-gray-900 uppercase tracking-tight"
                >
                    Khám phá <span class="text-primary">Dịch vụ</span>
                </h2>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div
                    v-for="(service, index) in services"
                    :key="service.id"
                    class="group block bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300 hover:-translate-y-2 cursor-pointer"
                    data-aos="fade-up"
                    :data-aos-delay="100 * (index + 1)"
                >
                    <div
                        class="w-20 h-20 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center mb-6 group-hover:bg-primary transition-colors duration-300"
                    >
                        <span
                            class="material-icons-outlined text-4xl text-primary group-hover:text-white transition-colors duration-300"
                        >
                            {{ service.icon }}
                        </span>
                    </div>

                    <h5
                        class="text-xl font-bold text-gray-900 mb-4 group-hover:text-primary transition-colors"
                    >
                        {{ service.title }}
                    </h5>

                    <p class="text-gray-600 leading-relaxed mb-6 text-sm">
                        {{ service.description }}
                    </p>

                    <div
                        class="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-x-[-10px] group-hover:translate-x-0"
                    >
                        <span>Tìm hiểu thêm</span>
                        <span class="material-icons-outlined text-lg"
                            >arrow_forward</span
                        >
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* Không cần thêm CSS, Tailwind cân hết giao diện này */
</style>
