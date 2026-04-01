<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import httpClient from '@/api/axiosClient'

interface Service {
    service_id: number
    service_name: string
    description: string
    price: number
    unit: string
}

const services = ref<Service[]>([])
const isLoading = ref(false)
const searchQuery = ref('')
const isAddPanelOpen = ref(false)
const isSubmitting = ref(false)

const form = ref({
    service_name: '',
    description: '',
    price: 0,
    unit: 'Lượt',
})

const fetchServices = async () => {
    isLoading.value = true
    try {
        const res: any = await httpClient.get('/api/services/', {
            params: { search: searchQuery.value },
        })
        services.value = res.data || res
    } catch (error) {
        console.error('Lỗi tải danh sách dịch vụ:', error)
    } finally {
        isLoading.value = false
    }
}

let searchTimeout: ReturnType<typeof setTimeout> | null = null
watch(searchQuery, () => {
    if (searchTimeout) clearTimeout(searchTimeout)
    searchTimeout = setTimeout(() => {
        fetchServices()
    }, 500)
})

const submitService = async () => {
    if (!form.value.service_name || form.value.price <= 0) {
        alert('Vui lòng nhập tên dịch vụ và giá hợp lệ!')
        return
    }

    isSubmitting.value = true
    try {
        await httpClient.post('/api/services/', form.value)
        isAddPanelOpen.value = false
        form.value = {
            service_name: '',
            description: '',
            price: 0,
            unit: 'Lượt',
        }
        fetchServices()
        alert('Thêm dịch vụ thành công!')
    } catch (error) {
        alert('Có lỗi xảy ra khi thêm dịch vụ.')
    } finally {
        isSubmitting.value = false
    }
}

onMounted(() => {
    fetchServices()
})

const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(val || 0)
}

const totalServices = computed(() => services.value.length)
</script>

<template>
    <div class="flex flex-col h-full gap-6 bg-gray-50 min-h-screen">
        <header
            class="flex items-center justify-between whitespace-nowrap border-b border-gray-200 bg-white/80 backdrop-blur-md px-8 py-4 rounded-2xl shadow-sm mx-6 mt-6"
        >
            <div class="flex items-center gap-8 flex-1">
                <div class="flex items-center gap-4 text-gray-900">
                    <div class="size-6 text-primary">
                        <span class="material-symbols-outlined text-[28px]"
                            >room_service</span
                        >
                    </div>
                    <h2
                        class="text-xl font-extrabold leading-tight tracking-tight"
                    >
                        Quản lý Dịch vụ
                    </h2>
                </div>
                <div class="relative w-80">
                    <span
                        class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl"
                        >search</span
                    >
                    <input
                        v-model="searchQuery"
                        class="w-full h-10 bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                        placeholder="Tìm kiếm tên dịch vụ..."
                        type="text"
                    />
                </div>
            </div>
            <div class="flex items-center gap-3">
                <button
                    @click="isAddPanelOpen = true"
                    class="px-4 py-2 bg-primary text-white text-sm font-bold rounded-lg flex items-center gap-2 shadow-lg shadow-primary/20 hover:bg-orange-600 transition-colors"
                >
                    <span class="material-symbols-outlined text-sm">add</span>
                    Thêm Dịch Vụ Mới
                </button>
            </div>
        </header>

        <div class="px-6 pb-6 flex flex-col gap-6 w-full">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div
                    class="flex flex-col gap-2 rounded-2xl p-6 bg-white border border-gray-200 shadow-sm"
                >
                    <div class="flex justify-between items-start">
                        <p
                            class="text-gray-500 text-sm font-bold uppercase tracking-wider"
                        >
                            Tổng Dịch Vụ
                        </p>
                        <span
                            class="material-symbols-outlined text-primary p-2 bg-orange-50 rounded-xl"
                            >inventory_2</span
                        >
                    </div>
                    <p class="text-gray-900 tracking-tight text-3xl font-black">
                        {{ totalServices }}
                    </p>
                </div>
            </div>

            <div
                class="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden flex-1 flex flex-col"
            >
                <div class="overflow-x-auto">
                    <table class="w-full text-left border-collapse">
                        <thead
                            class="bg-gray-50 text-gray-500 text-xs uppercase font-extrabold tracking-wider border-b border-gray-200"
                        >
                            <tr>
                                <th class="px-6 py-4">Tên dịch vụ</th>
                                <th class="px-6 py-4">Mô tả</th>
                                <th class="px-6 py-4">Đơn giá</th>
                                <th class="px-6 py-4 text-center">
                                    Trạng thái
                                </th>
                                <th class="px-6 py-4 text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-100">
                            <tr v-if="isLoading">
                                <td
                                    colspan="5"
                                    class="px-6 py-10 text-center text-gray-500 font-medium"
                                >
                                    Đang tải dữ liệu...
                                </td>
                            </tr>
                            <tr v-else-if="services.length === 0">
                                <td
                                    colspan="5"
                                    class="px-6 py-10 text-center text-gray-500 font-medium"
                                >
                                    Không tìm thấy dịch vụ nào.
                                </td>
                            </tr>
                            <tr
                                v-else
                                v-for="item in services"
                                :key="item.service_id"
                                class="hover:bg-gray-50/80 transition-colors"
                            >
                                <td class="px-6 py-4">
                                    <div class="flex items-center gap-3">
                                        <div
                                            class="size-8 bg-orange-50 text-primary rounded-lg flex items-center justify-center"
                                        >
                                            <span
                                                class="material-symbols-outlined text-base"
                                                >local_cafe</span
                                            >
                                        </div>
                                        <span
                                            class="text-sm font-bold text-gray-900"
                                            >{{ item.service_name }}</span
                                        >
                                    </div>
                                </td>
                                <td
                                    class="px-6 py-4 text-sm text-gray-500 max-w-[300px] truncate"
                                >
                                    {{ item.description || 'Không có mô tả' }}
                                </td>
                                <td class="px-6 py-4">
                                    <div class="flex flex-col">
                                        <span
                                            class="text-sm font-bold text-gray-900"
                                            >{{
                                                formatCurrency(item.price)
                                            }}</span
                                        >
                                        <span
                                            class="text-[11px] font-semibold text-gray-400"
                                            >/ {{ item.unit }}</span
                                        >
                                    </div>
                                </td>
                                <td class="px-6 py-4 text-center">
                                    <span
                                        class="px-2.5 py-1 rounded-md bg-green-50 text-green-600 text-[11px] font-extrabold"
                                        >ĐANG BÁN</span
                                    >
                                </td>
                                <td class="px-6 py-4 text-right">
                                    <div
                                        class="flex items-center justify-end gap-2"
                                    >
                                        <button
                                            class="p-1.5 text-gray-400 hover:text-primary transition-colors"
                                        >
                                            <span
                                                class="material-symbols-outlined text-lg"
                                                >edit</span
                                            >
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <div
            @click="isAddPanelOpen = false"
            class="fixed inset-0 z-40 bg-gray-900/50 backdrop-blur-sm transition-opacity duration-300"
            :class="
                isAddPanelOpen
                    ? 'opacity-100 pointer-events-auto'
                    : 'opacity-0 pointer-events-none'
            "
        ></div>

        <section
            class="fixed inset-y-0 right-0 w-[450px] bg-white shadow-2xl z-50 flex flex-col border-l border-gray-200 transform transition-transform duration-300"
            :class="isAddPanelOpen ? 'translate-x-0' : 'translate-x-full'"
        >
            <div
                class="p-6 border-b border-gray-200 flex items-center justify-between bg-gray-50"
            >
                <div>
                    <h3 class="text-lg font-black text-gray-900">
                        Thêm Dịch Vụ Mới
                    </h3>
                    <p class="text-xs text-gray-500 font-medium mt-1">
                        Thiết lập món đồ/dịch vụ mới cho khách.
                    </p>
                </div>
                <button
                    @click="isAddPanelOpen = false"
                    class="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-200 rounded-full transition-colors"
                >
                    <span class="material-symbols-outlined">close</span>
                </button>
            </div>

            <div class="flex-1 p-6 overflow-y-auto flex flex-col gap-6">
                <div class="flex flex-col gap-2">
                    <label class="text-sm font-bold text-gray-900"
                        >Tên Dịch vụ <span class="text-red-500">*</span></label
                    >
                    <input
                        v-model="form.service_name"
                        class="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                        placeholder="VD: Nước tăng lực Bò húc"
                        type="text"
                    />
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <div class="flex flex-col gap-2">
                        <label class="text-sm font-bold text-gray-900"
                            >Giá (VNĐ)
                            <span class="text-red-500">*</span></label
                        >
                        <input
                            v-model.number="form.price"
                            class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-mono outline-none"
                            placeholder="0"
                            type="number"
                        />
                    </div>
                    <div class="flex flex-col gap-2">
                        <label class="text-sm font-bold text-gray-900"
                            >Đơn vị tính</label
                        >
                        <input
                            v-model="form.unit"
                            class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                            placeholder="VD: Lon, Chai, Lượt..."
                            type="text"
                        />
                    </div>
                </div>

                <div class="flex flex-col gap-2">
                    <label class="text-sm font-bold text-gray-900"
                        >Mô tả thêm</label
                    >
                    <textarea
                        v-model="form.description"
                        class="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none outline-none"
                        placeholder="Mô tả chi tiết về dịch vụ này..."
                        rows="4"
                    ></textarea>
                </div>
            </div>

            <div class="p-6 border-t border-gray-200 flex gap-3 bg-white">
                <button
                    @click="isAddPanelOpen = false"
                    class="flex-1 py-3 bg-gray-100 text-gray-700 text-sm font-bold rounded-xl hover:bg-gray-200 transition-colors"
                >
                    Hủy bỏ
                </button>
                <button
                    @click="submitService"
                    :disabled="isSubmitting"
                    class="flex-1 py-3 bg-primary text-white text-sm font-bold rounded-xl shadow-lg hover:bg-orange-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                    <span
                        v-if="isSubmitting"
                        class="material-symbols-outlined animate-spin text-sm"
                        >autorenew</span
                    >
                    {{ isSubmitting ? 'Đang lưu...' : 'Tạo Dịch Vụ' }}
                </button>
            </div>
        </section>
    </div>
</template>
