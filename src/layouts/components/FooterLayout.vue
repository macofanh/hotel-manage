<script setup lang="ts">
// Bạn có thể import các icon hoặc logic nếu cần
</script>

<template>
    <footer class="mt-20 py-12 border-t border-gray-200 bg-white">
        <div class="container mx-auto px-10">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-12">
                <div class="col-span-1 md:col-span-1">
                    <div class="flex items-center gap-2 mb-4">
                        <span
                            class="material-icons-outlined text-primary text-3xl"
                            >hotel</span
                        >
                        <h2
                            class="text-gray-900 font-extrabold text-xl uppercase tracking-tight"
                        >
                            Mac<span class="text-primary">Hotel</span>
                        </h2>
                    </div>
                    <p class="text-gray-500 text-sm leading-relaxed">
                        Mang đến trải nghiệm nghỉ dưỡng đẳng cấp và sang trọng.
                        Chúng tôi luôn đồng hành cùng bạn trong mọi kỳ nghỉ.
                    </p>
                </div>

                <div class="flex flex-col gap-4">
                    <h3
                        class="font-bold text-gray-900 uppercase text-sm tracking-wider"
                    >
                        Liên hệ
                    </h3>
                    <div class="flex flex-col gap-3">
                        <div class="flex items-start gap-3 text-gray-600">
                            <span
                                class="material-icons-outlined text-primary text-xl"
                                >location_on</span
                            >
                            <span class="text-sm"
                                >123 Đường ABC, Quận Ninh Kiều, Cần Thơ</span
                            >
                        </div>
                        <div class="flex items-center gap-3 text-gray-600">
                            <span
                                class="material-icons-outlined text-primary text-xl"
                                >call</span
                            >
                            <span class="text-sm">0123 456 789</span>
                        </div>
                        <div class="flex items-center gap-3 text-gray-600">
                            <span
                                class="material-icons-outlined text-primary text-xl"
                                >mail</span
                            >
                            <span class="text-sm">contact@machotel.com</span>
                        </div>
                    </div>
                </div>

                <div class="flex flex-col gap-4">
                    <h3
                        class="font-bold text-gray-900 uppercase text-sm tracking-wider"
                    >
                        Hỗ trợ
                    </h3>
                    <nav class="flex flex-col gap-2">
                        <a
                            class="text-gray-500 text-sm hover:text-primary transition-colors"
                            href="#"
                            >Trung tâm hỗ trợ</a
                        >
                        <a
                            class="text-gray-500 text-sm hover:text-primary transition-colors"
                            href="#"
                            >Chính sách hủy phòng</a
                        >
                        <a
                            class="text-gray-500 text-sm hover:text-primary transition-colors"
                            href="#"
                            >Quy định hoàn tiền</a
                        >
                        <a
                            class="text-gray-500 text-sm hover:text-primary transition-colors"
                            href="#"
                            >Câu hỏi thường gặp</a
                        >
                    </nav>
                </div>

                <div class="flex flex-col gap-4">
                    <h3
                        class="font-bold text-gray-900 uppercase text-sm tracking-wider"
                    >
                        Kết nối với chúng tôi
                    </h3>
                    <div class="flex gap-4">
                        <a
                            href="#"
                            class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-primary hover:text-white transition-all"
                        >
                            <i class="bi bi-facebook"></i>
                        </a>
                        <a
                            href="#"
                            class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-primary hover:text-white transition-all"
                        >
                            <i class="bi bi-instagram"></i>
                        </a>
                        <a
                            href="#"
                            class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-primary hover:text-white transition-all"
                        >
                            <i class="bi bi-youtube"></i>
                        </a>
                    </div>
                    <div class="mt-2">
                        <p class="text-xs text-gray-400 mb-2 italic">
                            Chấp nhận thanh toán
                        </p>
                        <div class="flex gap-2 opacity-60">
                            <span class="material-icons-outlined"
                                >payments</span
                            >
                            <span class="material-icons-outlined"
                                >credit_card</span
                            >
                        </div>
                    </div>
                </div>
            </div>

            <div
                class="mt-12 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4"
            >
                <p class="text-gray-400 text-xs">
                    © 2026 MacHotel Inc. Mọi quyền được bảo lưu.
                </p>
                <div class="flex gap-6">
                    <a href="#" class="text-xs text-gray-400 hover:text-primary"
                        >Chính sách bảo mật</a
                    >
                    <a href="#" class="text-xs text-gray-400 hover:text-primary"
                        >Điều khoản sử dụng</a
                    >
                </div>
            </div>
        </div>
    </footer>
</template>

<style scoped>
/* Bạn có thể thêm font-family nếu muốn */
</style>
