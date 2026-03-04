<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goToRoom = () => {
    router.push({ name: 'room' })
}
</script>

<template>
    <div class="container mx-auto px-4 py-16">
        <div class="flex flex-col lg:flex-row gap-12 items-center">
            <div class="w-full lg:w-1/2">
                <h1
                    class="text-3xl md:text-4xl font-extrabold mb-6 text-gray-900"
                >
                    Chào mừng đến với
                    <span class="text-primary uppercase">MacHotel</span>
                </h1>
                <p class="mb-8 text-gray-600 leading-relaxed">
                    Trải nghiệm không gian nghỉ dưỡng đẳng cấp với dịch vụ hoàn
                    hảo. Chúng tôi cam kết mang lại cho bạn và gia đình những
                    giây phút thư giãn tuyệt vời nhất, kết nối mọi tiện nghi
                    hiện đại và thiết kế sang trọng.
                </p>

                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-6">
                    <div
                        class="border border-gray-200 rounded-lg p-1 hover:border-primary transition-colors cursor-pointer group"
                    >
                        <div
                            class="border border-gray-100 rounded text-center p-6 bg-gray-50 group-hover:bg-white transition-colors"
                        >
                            <span
                                class="material-icons-outlined text-4xl text-primary mb-3 block"
                                >hotel</span
                            >
                            <h2 class="text-3xl font-bold text-gray-800 mb-1">
                                1234
                            </h2>
                            <p
                                class="text-sm font-medium text-gray-500 uppercase tracking-wide m-0"
                            >
                                Phòng
                            </p>
                        </div>
                    </div>
                    <div
                        class="border border-gray-200 rounded-lg p-1 hover:border-primary transition-colors cursor-pointer group"
                    >
                        <div
                            class="border border-gray-100 rounded text-center p-6 bg-gray-50 group-hover:bg-white transition-colors"
                        >
                            <span
                                class="material-icons-outlined text-4xl text-primary mb-3 block"
                                >manage_accounts</span
                            >
                            <h2 class="text-3xl font-bold text-gray-800 mb-1">
                                1234
                            </h2>
                            <p
                                class="text-sm font-medium text-gray-500 uppercase tracking-wide m-0"
                            >
                                Nhân viên
                            </p>
                        </div>
                    </div>
                    <div
                        class="border border-gray-200 rounded-lg p-1 hover:border-primary transition-colors cursor-pointer group"
                    >
                        <div
                            class="border border-gray-100 rounded text-center p-6 bg-gray-50 group-hover:bg-white transition-colors"
                        >
                            <span
                                class="material-icons-outlined text-4xl text-primary mb-3 block"
                                >groups</span
                            >
                            <h2 class="text-3xl font-bold text-gray-800 mb-1">
                                1234
                            </h2>
                            <p
                                class="text-sm font-medium text-gray-500 uppercase tracking-wide m-0"
                            >
                                Khách hàng
                            </p>
                        </div>
                    </div>
                </div>

                <button
                    class="inline-block bg-primary text-white font-bold py-4 px-8 rounded hover:bg-orange-600 transition-colors uppercase tracking-wider text-sm shadow-lg shadow-primary/30"
                    @click="goToRoom"
                >
                    Xem phòng ngay
                </button>
            </div>

            <div class="w-full lg:w-1/2">
                <div class="grid grid-cols-2 gap-4">
                    <div class="text-right">
                        <img
                            class="rounded-lg w-3/4 inline-block object-cover shadow-md mt-[25%]"
                            src="@/assets/images/about-1.jpg"
                            alt="About 1"
                        />
                    </div>
                    <div class="text-left">
                        <img
                            class="rounded-lg w-full inline-block object-cover shadow-md"
                            src="@/assets/images/about-2.jpg"
                            alt="About 2"
                        />
                    </div>
                    <div class="text-right">
                        <img
                            class="rounded-lg w-1/2 inline-block object-cover shadow-md"
                            src="@/assets/images/about-3.jpg"
                            alt="About 3"
                        />
                    </div>
                    <div class="text-left">
                        <img
                            class="rounded-lg w-3/4 inline-block object-cover shadow-md"
                            src="@/assets/images/about-4.jpg"
                            alt="About 4"
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
