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
                name: 'room',
                path: 'room',
                component: () => import('@/pages/room/RoomPage.vue'),
            },
            {
                name: 'room-detail',
                path: 'room-detail/:id',
                props: true,
                component: () => import('@/pages/room/RoomDetail.vue'),
            },
            {
                name: 'service',
                path: 'service',
                component: () => import('@/pages/service/ServicePage.vue'),
            },
            {
                name: 'booking',
                path: 'booking',
                component: () => import('@/pages/booking/BookingPage.vue'),
                meta: { requiresAuth: true },
            },
            {
                name: 'booking-complete',
                path: 'booking/:id/complete',
                props: true,
                component: () => import('@/pages/booking/BookingComplete.vue'),
                meta: { requiresAuth: true },
            },
            {
                name: 'profile',
                path: 'profile',
                // component: () => import('@/pages/profile/ProfileLayout.vue'),
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
                            import('@/pages/profile/BookingHistory.vue'),
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

    if (to.meta.requiresAuth && !isAuthenticated) {
        // Đá về trang đăng nhập
        next({ name: 'login' })
    }
    else if (to.path.startsWith('/auth') && isAuthenticated) {
        next({ name: 'home' })
    }

    else {
        next()
    }
})

export default router
