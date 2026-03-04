<script setup></script>

<template>
    <div class="layout-content-container flex flex-col w-full">
        <header
            class="flex items-center justify-between whitespace-nowrap px-10 py-3"
        >
            <div
                class="flex items-center gap-4 text-[#181510] dark:text-[#f8f7f5]"
            >
                <h2 class="text-black font-bold leading-tight tracking-[-0.015em]">
                    MacHotel
                </h2>
            </div>
            <div class="flex flex-1 justify-end gap-8">
                <div class="hidden md:flex items-center gap-9">
                    <a
                        class="text-sm font-medium leading-normal hover:text-primary transition-colors"
                        href="#"
                        >Hotels</a
                    >
                    <a
                        class="text-sm font-medium leading-normal hover:text-primary transition-colors"
                        href="#"
                        >Resorts</a
                    >
                    <a
                        class="text-sm font-medium leading-normal hover:text-primary transition-colors"
                        href="#"
                        >Offers</a
                    >
                    <a
                        class="text-sm font-medium leading-normal hover:text-primary transition-colors"
                        href="#"
                        >My Bookings</a
                    >
                </div>
                <button
                    class="flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-orange-400 text-white text-sm font-bold leading-normal tracking-[0.015em]"
                >
                    <span class="truncate">Log Out</span>
                </button>
                <div
                    class="bg-center cursor-pointer bg-no-repeat aspect-square bg-cover rounded-full size-10 border border-[#e7e2da]"
                    style="
                        background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuBtIc-oYiCcM-uI4I_pMIJ3NqN_3Yxv-MMaNt89-NaGNXjEEELnYXevQf6ieMhBGNhfSks7izRinfiERWB520EWTPOd6S5Rsk3ji28SbN_ao4-Qcy03e3HU4oJogtMp9oWt7oJO-1-60pWP5XdkJMRZzeEmRlgltlgSZevvjtY_0BsP3wa6i_Xs3RPrI0Dx1Ra6eHr6qLzUYKUE0sqs05c4Dm-3UNNEysZLAj8uErqF77rNRo1ClN1oiM6P90TJOPPF2C9uVZ6V1JI');
                    "
                ></div>
            </div>
        </header>
    </div>
</template>

<style lang="scss" scoped></style>
