import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
    {
        path: '/:pathMatch(.*)*',
        redirect: { name: 'home' },
    },
    {
        name: 'auth-root',
        path: '/auth',
        redirect: { name: 'login' },
        children: [
            {
                name: 'login',
                path: 'login',
                component: () =>
                    import('@/pages/auth/components/LoginPage.vue'),
            },
            {
                name: 'register',
                path: 'register',
                component: () =>
                    import('@/pages/auth/components/RegisterPage.vue'),
            },
        ],
    },
    {
        name: 'root',
        path: '/',
        component: () => import('@/layouts/DefaultLayout.vue'),
        redirect: { name: 'home' },
        children: [
            {
                name: 'home',
                path: '',
                component: () => import('@/pages/home/HomePage.vue'),
            },
            {
                path: 'room',
                children: [
                    {
                        name: 'room',
                        path: '',
                        component: () => import('@/pages/room/RoomPage.vue'),
                    },
                    {
                        name: 'room-detail',
                        path: ':id',
                        props: true,
                        component: () => import('@/pages/room/RoomDetail.vue'),
                    },
                ],
            },
            {
                name: 'service',
                path: 'service',
                component: () => import('@/pages/service/ServicePage.vue'),
            },
            {
                path: 'booking',
                meta: { requiresAuth: true },
                children: [
                    {
                        name: 'booking',
                        path: ':id',
                        props: true,
                        component: () =>
                            import('@/pages/booking/BookingPage.vue'),
                    },
                    {
                        name: 'booking-complete',
                        path: ':id/complete',
                        props: true,
                        component: () =>
                            import('@/pages/booking/BookingComplete.vue'),
                    },
                ],
            },
            {
                name: 'profile',
                path: 'profile',
                redirect: { name: 'info' },
                meta: { requiresAuth: true },
                children: [
                    {
                        name: 'info',
                        path: 'info',
                        component: () =>
                            import('@/pages/profile/ProfileInfo.vue'),
                    },
                    {
                        name: 'my-bookings',
                        path: 'my-bookings',
                        component: () =>
                            import('@/pages/booking/BookingHistory.vue'),
                    },
                ],
            },
        ],
    },
    {
        name: 'admin',
        path: '/admin',
        component: () => import('@/pages/admin/layouts/AdminLayout.vue'),
        redirect: { name: 'admin-overview' },
        meta: { requiresAuth: true, requiresAdmin: true },
        children: [
            {
                name: 'admin-overview',
                path: 'overview',
                component: () =>
                    import('@/pages/admin/overview/OverviewAdmin.vue'),
            },
            {
                path: 'users',
                children: [
                    {
                        name: 'admin-users',
                        path: '',
                        component: () =>
                            import('@/pages/admin/users/UsersAdmin.vue'),
                    },
                    {
                        name: 'admin-users-create',
                        path: 'create',
                        component: () =>
                            import('@/pages/admin/users/AddNewUser.vue'),
                    },
                    {
                        name: 'admin-users-edit',
                        path: ':id/edit',
                        props: true,
                        component: () =>
                            import('@/pages/admin/users/EditUser.vue'),
                    },
                ],
            },
            {
                path: 'bookings',
                children: [
                    {
                        name: 'admin-bookings',
                        path: '',
                        component: () =>
                            import('@/pages/admin/bookings/BookingsAdmin.vue'),
                    },
                    // {
                    //     name: 'admin-bookings-create',
                    //     path: 'create',
                    //     component: () =>
                    //         import('@/pages/admin/bookings/BookingCreate.vue'),
                    // },
                    // {
                    //     name: 'admin-bookings-edit',
                    //     path: ':id/edit',
                    //     props: true,
                    //     component: () =>
                    //         import('@/pages/admin/bookings/BookingEdit.vue'),
                    // },
                ],
            },
            {
                path: 'services',
                children: [
                    {
                        name: 'admin-services',
                        path: '',
                        component: () =>
                            import('@/pages/admin/services/ServicesAdmin.vue'),
                    },
                    // {
                    //     name: 'admin-services-create',
                    //     path: 'create',
                    //     component: () =>
                    //         import('@/pages/admin/services/ServiceCreate.vue'),
                    // },
                    // {
                    //     name: 'admin-services-edit',
                    //     path: ':id/edit',
                    //     props: true,
                    //     component: () =>
                    //         import('@/pages/admin/services/ServiceEdit.vue'),
                    // },
                ],
            },
            {
                path: 'rooms',
                children: [
                    {
                        name: 'admin-rooms',
                        path: '',
                        component: () =>
                            import('@/pages/admin/rooms/RoomsAdmin.vue'),
                    },
                    {
                        name: 'admin-rooms-create',
                        path: 'create',
                        component: () =>
                            import('@/pages/admin/rooms/CreateNewRoom.vue'),
                    },
                    {
                        name: 'admin-rooms-edit',
                        path: ':id/edit',
                        props: true,
                        component: () =>
                            import('@/pages/admin/rooms/EditRoom.vue'),
                    },
                ],
            },
        ],
    },
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
})

router.beforeEach((to, from, next) => {
    const isAuthenticated = !!localStorage.getItem('access_token')
    let userRole = 'CUSTOMER'

    const userInfoStr = localStorage.getItem('user_info')
    if (userInfoStr) {
        try {
            const userInfo = JSON.parse(userInfoStr)
            userRole = userInfo.role || 'CUSTOMER'
        } catch (e) {
            console.error('Lỗi đọc dữ liệu người dùng')
        }
    }

    if (to.meta.requiresAuth && !isAuthenticated) {
        next({ name: 'login' })
    } else if (to.path.startsWith('/auth') && isAuthenticated) {
        next({ name: 'home' })
    } else if (to.meta.requiresAdmin && userRole !== 'ADMIN') {
        alert('Bạn không có quyền truy cập trang quản trị!')
        next({ name: 'home' })
    } else {
        next()
    }
})

export default router
