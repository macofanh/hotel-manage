<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import httpClient from '@/api/axiosClient'

const router = useRouter()
const isSaving = ref(false)
const isUploading = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)
const roomTypes = ref<any[]>([])

// Dữ liệu Form
const formData = reactive({
    room_number: '',
    room_type_id: '',
    price_per_night: 0,
    status: 'AVAILABLE',
    image_url: '',
})

const goBack = () => router.push({ name: 'admin-rooms' })

// Lấy danh sách Loại phòng từ BE để làm menu Dropdown
const fetchRoomTypes = async () => {
    try {
        const response: any = await httpClient.get('/api/rooms/types')
        roomTypes.value = response.data || response
        // Chọn mặc định loại phòng đầu tiên nếu có
        if (roomTypes.value.length > 0) {
            formData.room_type_id = roomTypes.value[0].type_id
        }
    } catch (error) {
        console.error('Lỗi khi tải danh sách loại phòng:', error)
    }
}

onMounted(() => {
    fetchRoomTypes()
})

// Xử lý Upload Ảnh Phòng
const triggerFileInput = () => fileInput.value?.click()

const handleImageUpload = async (event: Event) => {
    const target = event.target as HTMLInputElement
    const file = target.files?.[0]
    if (!file) return

    isUploading.value = true
    try {
        const uploadData = new FormData()
        uploadData.append('file', file)

        // Gọi API Upload
        const response: any = await httpClient.post(
            '/api/upload/single',
            uploadData,
            {
                headers: { 'Content-Type': 'multipart/form-data' },
            },
        )

        const imageUrl = response.file_url || response.url || response.data?.url
        if (imageUrl) {
            formData.image_url = imageUrl
            alert('Tải ảnh lên thành công!')
        }
    } catch (error) {
        console.error('Lỗi upload ảnh:', error)
        alert('Tải ảnh lên thất bại.')
    } finally {
        isUploading.value = false
    }
}

// Lưu Phòng Mới
const handleCreateRoom = async () => {
    isSaving.value = true
    try {
        // 🚨 Đóng gói lại Payload cho đúng Schema Backend
        const payload = {
            room_number: formData.room_number,
            type_id: Number(formData.room_type_id), // Backend dùng type_id
            status: formData.status,
            price_per_night: Number(formData.price_per_night),
            // Backend dùng image_urls (dạng danh sách/mảng)
            image_urls: formData.image_url ? [formData.image_url] : [],
        }

        // Gửi payload đã chuẩn hóa lên API
        await httpClient.post('/api/rooms/', payload)

        alert('Tạo phòng thành công!')
        goBack()
    } catch (error: any) {
        console.error('Lỗi khi thêm phòng:', error)
        // Hiển thị chi tiết lỗi từ Backend nếu có
        const detail = error.response?.data?.detail
        alert(
            Array.isArray(detail)
                ? detail[0].msg
                : detail || 'Có lỗi xảy ra khi thêm phòng!',
        )
    } finally {
        isSaving.value = false
    }
}

const getFullUrl = (path: string) => {
    if (!path) return ''
    if (path.startsWith('http')) return path
    return `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}${path}`
}
</script>

<template>
    <div class="flex flex-col h-full gap-6 max-w-4xl mx-auto w-full">
        <header
            class="flex items-center gap-4 whitespace-nowrap border-b border-gray-200 bg-white/80 backdrop-blur-md px-8 py-4 rounded-2xl shadow-sm"
        >
            <button
                @click="goBack"
                class="p-2 rounded-lg text-gray-500 hover:text-primary hover:bg-orange-50 transition-colors"
            >
                <span class="material-symbols-outlined text-xl"
                    >arrow_back</span
                >
            </button>
            <h2
                class="text-xl font-extrabold leading-tight tracking-tight text-gray-900"
            >
                Thêm phòng mới
            </h2>
        </header>

        <main class="bg-white border border-gray-200 rounded-2xl shadow-sm p-8">
            <form @submit.prevent="handleCreateRoom" class="space-y-8">
                <div>
                    <h3
                        class="text-base font-bold text-gray-900 border-b border-gray-100 pb-2 mb-4"
                    >
                        Hình ảnh phòng
                    </h3>
                    <div class="flex items-center gap-6">
                        <div
                            @click="triggerFileInput"
                            class="relative w-48 h-32 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50 cursor-pointer hover:bg-orange-50 hover:border-primary transition-all group overflow-hidden"
                        >
                            <img
                                v-if="formData.image_url"
                                :src="getFullUrl(formData.image_url)"
                                class="w-full h-full object-cover"
                            />
                            <div
                                v-else
                                class="flex flex-col items-center text-gray-400 group-hover:text-primary transition-colors"
                            >
                                <span
                                    class="material-symbols-outlined text-3xl mb-1"
                                    >add_photo_alternate</span
                                >
                                <span class="text-xs font-medium"
                                    >Tải ảnh lên</span
                                >
                            </div>
                            <div
                                v-if="isUploading"
                                class="absolute inset-0 bg-white/80 flex items-center justify-center"
                            >
                                <span
                                    class="material-symbols-outlined animate-spin text-primary text-2xl"
                                    >autorenew</span
                                >
                            </div>
                        </div>
                        <input
                            type="file"
                            ref="fileInput"
                            class="hidden"
                            accept="image/*"
                            @change="handleImageUpload"
                        />
                        <div class="text-sm text-gray-500">
                            <p class="font-bold text-gray-700 mb-1">
                                Ảnh đại diện cho phòng
                            </p>
                            <p>Định dạng hỗ trợ: JPG, PNG, JPEG.</p>
                            <p>Kích thước tối ưu: 800x600px.</p>
                        </div>
                    </div>
                </div>

                <div>
                    <h3
                        class="text-base font-bold text-gray-900 border-b border-gray-100 pb-2 mb-4"
                    >
                        Thông tin chi tiết
                    </h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="space-y-1.5">
                            <label class="text-xs font-bold text-gray-700"
                                >Số phòng (Tên phòng) *</label
                            >
                            <input
                                v-model="formData.room_number"
                                type="text"
                                required
                                class="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:bg-white focus:border-primary outline-none transition-all"
                                placeholder="VD: 101, 205..."
                            />
                        </div>

                        <div class="space-y-1.5">
                            <label class="text-xs font-bold text-gray-700"
                                >Loại phòng *</label
                            >
                            <select
                                v-model="formData.room_type_id"
                                required
                                class="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:bg-white focus:border-primary outline-none transition-all cursor-pointer"
                            >
                                <option value="" disabled>
                                    -- Chọn loại phòng --
                                </option>
                                <option
                                    v-for="type in roomTypes"
                                    :key="type.type_id"
                                    :value="type.type_id"
                                >
                                    {{ type.type_name }}
                                </option>
                            </select>
                        </div>

                        <div class="space-y-1.5">
                            <label class="text-xs font-bold text-gray-700"
                                >Giá mỗi đêm (VND) *</label
                            >
                            <input
                                v-model="formData.price_per_night"
                                type="number"
                                min="0"
                                required
                                class="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:bg-white focus:border-primary outline-none transition-all"
                                placeholder="VD: 500000"
                            />
                        </div>

                        <div class="space-y-1.5">
                            <label class="text-xs font-bold text-gray-700"
                                >Trạng thái hiện tại *</label
                            >
                            <select
                                v-model="formData.status"
                                class="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:bg-white focus:border-primary outline-none transition-all cursor-pointer"
                            >
                                <option value="AVAILABLE">
                                    Trống (Available)
                                </option>
                                <option value="OCCUPIED">
                                    Đang thuê (Occupied)
                                </option>
                                <option value="CLEANING">
                                    Đang dọn dẹp (Cleaning)
                                </option>
                                <option value="MAINTENANCE">
                                    Bảo trì (Maintenance)
                                </option>
                            </select>
                        </div>
                    </div>
                </div>

                <div
                    class="flex justify-end pt-6 border-t border-gray-100 gap-3"
                >
                    <button
                        type="button"
                        @click="goBack"
                        class="px-6 py-3 border border-gray-200 text-gray-700 text-sm font-bold rounded-xl hover:bg-gray-50 transition-all"
                    >
                        Hủy
                    </button>
                    <button
                        type="submit"
                        :disabled="isSaving"
                        class="px-6 py-3 bg-primary text-white text-sm font-bold rounded-xl shadow-md hover:bg-orange-600 transition-all disabled:opacity-70 flex items-center gap-2"
                    >
                        <span
                            v-if="!isSaving"
                            class="material-symbols-outlined text-[20px]"
                            >save</span
                        >
                        <span
                            v-else
                            class="material-symbols-outlined animate-spin text-[20px]"
                            >autorenew</span
                        >
                        {{ isSaving ? 'Đang lưu...' : 'Lưu phòng mới' }}
                    </button>
                </div>
            </form>
        </main>
    </div>
</template>
